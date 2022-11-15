//fetches full activity history of magicEdenCollection using /collections/:symbol/activities (leverage offset and limit)
//creatorRoyalty fetched from /tokens API, buys and listings filtered and buys mapped with respective listing. 
//listings prices always matching with buy prices and additional royalty amounts(creator_fees_amount) not observed,
//( offset > 16000 also not working for activities API)
/**
 * @author harsha bakku
 * @since 0.1
 * @version 0.1
 */
 require('log-timestamp');
 const axios = require('axios'); 

 let offset = 0;
 let activitiesHistory = [];

 // ====== Get Data From Full Collection API 
 
 fetchActivities = async (collectionName) => {
        
    const collectionURL = "https://api-mainnet.magiceden.dev/v2/collections/"+ collectionName + "/activities?offset="+ offset + "&limit=1000"
    console.log('Fetching Data now....'+ collectionURL)
    
    try{
        const result = await axios.get(`${collectionURL}`,{
            headers: {
                "Content-Type": "application/json"
            }                                
        });
        const activities = result.data;
        console.log(activities.length);

        const activityTypes = []
        activities.map(async activity => (            
            !activityTypes.includes(activity.type) && activityTypes.push(activity.type)                             
        ));
        console.log(activityTypes);
        
        return activities;    
    }catch{
        return 
    }    
}

//filters activity and returns a Map with tokenMint as key and all of its activities as value  
filterMapWithTokenMint = async (activitiesHistory, activityType) => {

    const filteredResult = activitiesHistory.filter(function (activity) {     
        return activity.type == activityType
    });    
    
    const tokenMintActivities = filteredResult.reduce(function(map, activity) {
        
        !map[activity.tokenMint] && ( map[activity.tokenMint] = [] )
        map[activity.tokenMint].push(activity) ;

        return map;
    }, {});

    return tokenMintActivities;
}

fetchCreatorRoyalty = async (tokenMint) => {

    const tokenURL = "https://api-mainnet.magiceden.dev/v2/tokens/"+ tokenMint; 
    const result = await axios.get(`${tokenURL}`,{
        headers: {
            "Content-Type": "application/json"
        }                                
    });
    // console.log(result.data)
    return result.data.sellerFeeBasisPoints;
}

fetchRoyaltyRespecters = async () => {

    const collectionName = 'y00ts';
    let activities = await fetchActivities(collectionName);
    while (activities && activities.length >= 0 ) {
        activitiesHistory = activitiesHistory.concat(activities);
        // increase offset and fetch again
        offset = offset + 1000;
        console.log("fetching data again using offset "+ offset)
        activities = await fetchActivities(collectionName);
    }

    console.log("total activities fetched "+ activitiesHistory.length);

    //creatorRoyalty is same for the all tokens in entire collection. using the latest activity tokenMint here
    const creatorRoyalty = await fetchCreatorRoyalty(activitiesHistory[0].tokenMint)

    console.log(" creatorRoyalty for collection " + collectionName + " :  "+   creatorRoyalty/100 )
    
    const buys = activitiesHistory.filter(function (activity) {     
        return activity.type == 'buyNow'
    });
    console.log("no. of buyNow activities "+ buys.length);
    //returns a Map with tokenMint as key and all of its listings activities array as value  
    const listings = await filterMapWithTokenMint(activitiesHistory,"list");
     

    //returns buys with the listing matching the seller. every buyNow mapped with its listing
    buysWithListings = buys.map((buy) => {

        if(listings[buy.tokenMint]){
            for (let i=0; i < listings[buy.tokenMint].length; i++) {
                const listing = listings[buy.tokenMint][i];
                //buy.price > listing.price is used to identify bids accepted
                if (buy.seller == listing.seller && buy.blockTime > listing.blockTime && buy.price >= listing.price) {                
                    if(buy.listing){
                        //multiple listings exist for the buy, update with the most recent one.                      
                        if(listing.blockTime > buy.listing.blockTime) {                             
                            console.log( "earlier one")
                            console.log(buy.listing);
                            buy.listing = listing 
                            console.log( "new one")
                            console.log(buy.listing);
                        }  
                    }else{
                        buy.listing = listing;
                    }
                } 
            }
        }    
        return buy;
    });

    console.log(buysWithListings);
               

}    
 
   
 
module.exports = {
   fetchRoyaltyRespecters
}
