/**
 * @author harsha bakku
 * @since 0.1
 * @version 0.1
 */
 require('log-timestamp');
 const axios = require('axios'); 
 const fetch = require('node-fetch');


 let offset = 0;
 const limit = 500

 // ====== Get Data From Full Collection API 
 
 fetchActivities = async (collectionSymbol) => {

    //note:  below API is not available is the documentation(https://api.magiceden.dev/), 
        //frontend collection pages of magicEden are observed to identify the URL
        // provides the royalty amounts(creator_fees_amount) for every sale transaction which is of prime importance for this tool
        // also note that /collections/:symbol/activities has offset limits and does not give creator_fees_amount 


    // all sales txTypes are included below : ["exchange","acceptBid","auctionSettled"]
    let dataURL = "https://api-devnet.magiceden.io/rpc/getGlobalActivitiesByQueryWithAttributes?excludeSources=%5B%22yawww%22%2C%22solanart%22%2C%22tensortrade%22%2C%22hadeswap%22%2C%22coralcube_v2%22%2C%22elixir_buy%22%2C%22elixir_sell%22%2C%22hyperspace%22%5D"
    +"&txTypes=%5B%22exchange%22%2C%22acceptBid%22%2C%22auctionSettled%22%5D&mintAttributes=%5B%5D" 

    // +"&filterOnChainCollection="+ onChainCollection  // use this for even more explict filtering for a collection on mainnet

    if(collectionSymbol){
        dataURL = dataURL +"&filterCollectionSymbol="+collectionSymbol
    }
    dataURL += "&offset="+ offset + "&limit="+ limit

    console.log('Fetching Data now....'+ dataURL);
    try{
        const response = await axios.get(`${dataURL}`,{
            headers: {
                "Content-Type": "application/json",
            }                                
        });
       
        const activities = response.data.results;
        // console.log (activities);
        console.log("fetched sale activities "+ activities.length);

        return activities;    
    }catch(e){
        console.log(e)
        return 
    }    
}




fetchRoyaltyRespecters = async (collectionSymbol) => {

    let activities = await fetchActivities(collectionSymbol);
    let allSaleActivities = activities;
    
    while (activities && activities.length == limit ) {
        allSaleActivities = allSaleActivities.concat(activities);
        // increase offset and fetch again
        offset = offset + limit;
        console.log("fetching data again using offset "+ offset)
        activities = await fetchActivities(collectionSymbol);  
        
    }
    
    console.log("total activities fetched "+ allSaleActivities.length);

    const royaltyRespecters = allSaleActivities.flatMap(activity => {

        if(activity.mintObject){
            // console.log(activity)
            const royaltyPercentage = activity.mintObject.sellerFeeBasisPoints / 100;
            // console.log(royaltyPercentage);
            
            const royaltyPercentagePaid = (activity.parsedTransaction.creator_fees_amount / activity.parsedTransaction.total_amount) * 100 
            // console.log(royaltyPercentagePaid);
            
            // royalty is respected if atleast half of royalty is paid our when NFT is purchased
            const royaltyRespected =  royaltyPercentagePaid >= royaltyPercentage/2   
            
            if(royaltyRespected){
                return {...activity.parsedTransaction, ...{royaltyPercentage:royaltyPercentage, royaltyPercentagePaid: royaltyPercentagePaid, buyer_address: activity.buyer_address}}        
            }else{
                return []
            }
        }else{

            return []
        }
    });

    console.log("no. of royalty respecters for collection symbol '" + collectionSymbol + "' : " + royaltyRespecters.length);

    return royaltyRespecters;
    
}    
 
   
 
module.exports = {
   fetchRoyaltyRespecters
}
