/**
 * @author harsha bakku
 * @since 0.1
 * @version 0.1
 */
 require('log-timestamp');
 const axios = require('axios'); 
 const fetch = require('node-fetch');


 let offset = 0;
 let activitiesHistory = [];

 // ====== Get Data From Full Collection API 
 
 fetchActivities = async (collectionSymbol) => {

     
    //note:  below API is not available is the documentation(https://api.magiceden.dev/), 
        //frontend collection pages of magicEden are observed to identify the URL
        // provides the royalty amounts(creator_fees_amount) for every sale transaction which is of prime importance for this tool
        // also note that /collections/:symbol/activities has offset limits and does not give creator_fees_amount 


    // all sales txTypes are included below : ["exchange","acceptBid","auctionSettled"]
    const dataURL = "https://api-devnet.magiceden.io/rpc/getGlobalActivitiesByQueryWithAttributes?excludeSources=%5B%22yawww%22%2C%22solanart%22%2C%22tensortrade%22%2C%22hadeswap%22%2C%22coralcube_v2%22%2C%22elixir_buy%22%2C%22elixir_sell%22%2C%22hyperspace%22%5D"
    +"&txTypes=%5B%22exchange%22%2C%22acceptBid%22%2C%22auctionSettled%22%5D" 
    // +"&filterCollectionSymbol="+collectionSymbol
    // +"&filterOnChainCollection="+ onChainCollection  // use this for even more explict filtering for collection on mainnet
    +"&mintAttributes=%5B%5D&offset="+ offset + "&limit=50"

    console.log('Fetching Data now....'+ dataURL)
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




fetchCollectionActivitiesHistory = async () => {

    const collectionSymbol = 'y00ts';
    let activities = await fetchActivities(collectionSymbol);
    console.log (activities.length);

    while (activities && activities.length >= 0 ) {
        activitiesHistory = activitiesHistory.concat(activities);
        // increase offset and fetch again
        offset = offset + 50;
        console.log("fetching data again using offset "+ offset)
        activities = await fetchActivities(collectionSymbol);
        
    }
    
    console.log("total activities fetched "+ activitiesHistory.length);

}    
 
   
 
module.exports = {
   fetchCollectionActivitiesHistory
}
