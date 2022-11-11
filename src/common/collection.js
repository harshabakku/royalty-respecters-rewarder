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

     
     
     const onChainCollection = "4mKSoDDqApmF1DqXvVTSL6tu2zixrSSNjqMxUnwvVzy2"
     
    //note:  below API is not available is the documentation(https://api.magiceden.dev/), 
        //frontend collection pages of magicEden are observed to identify the URL
        // provides the royalty amounts(creator_fees_amount) for every sale transaction which is of prime importance for this tool
        // also note that /collections/:symbol/activities has offset limits and does not give creator_fees_amount 


    // all sales txTypes are included here : ["exchange","acceptBid","auctionSettled"]
    const dataURL = "https://api-mainnet.magiceden.io/rpc/getGlobalActivitiesByQueryWithAttributes?excludeSources=%5B%22yawww%22%2C%22solanart%22%2C%22tensortrade%22%2C%22hadeswap%22%2C%22coralcube_v2%22%2C%22elixir_buy%22%2C%22elixir_sell%22%2C%22hyperspace%22%5D&txTypes=%5B%22exchange%22%2C%22acceptBid%22%2C%22auctionSettled%22%5D&filterCollectionSymbol="+collectionSymbol+"&filterOnChainCollection="+ onChainCollection +"&mintAttributes=%5B%5D&offset="+ offset + "&limit=50"

    console.log('Fetching Data now....'+ dataURL)
    
    try{
        // const result = await axios.get(`${dataURL}`,{
        //     headers: {
        //         "Content-Type": "application/json",
        //         'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'
        //     }                                
        // });

       const response = await fetch("https://api-mainnet.magiceden.io/rpc/getGlobalActivitiesByQueryWithAttributes?excludeSources=%5B%22yawww%22%2C%22solanart%22%2C%22tensortrade%22%2C%22hadeswap%22%2C%22coralcube_v2%22%2C%22elixir_buy%22%2C%22elixir_sell%22%2C%22hyperspace%22%5D&txTypes=%5B%22exchange%22%2C%22acceptBid%22%2C%22auctionSettled%22%5D&filterCollectionSymbol=y00ts&filterOnChainCollection=4mKSoDDqApmF1DqXvVTSL6tu2zixrSSNjqMxUnwvVzy2&mintAttributes=%5B%5D&offset=0&limit=50", {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en,en-US;q=0.9",
          "cache-control": "max-age=0",
          "if-none-match": "W/\"520b7-iPePkvm98V4KRtbaxT25N9ClNEQ\"",
          "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });

console.log (response);
        // // const activities = result.data;
        // // console.log(activities.length);
        
        // return activities;    
    }catch(e){
        console.log(e)
        return 
    }    
}




fetchCollectionActivitiesHistory = async () => {

    const collectionName = 'y00ts';
    let activities = await fetchActivities(collectionName);
    while (activities && activities.length >= 0 ) {
        activitiesHistory = activitiesHistory.concat(activities);
        // increase offset and fetch again
        offset = offset + 50;
        console.log("fetching data again using offset "+ offset)
        console.log("total activities fetched "+ activitiesHistory.length);
        activities = await fetchActivities(collectionName);
    }


               

}    
 
   
 
module.exports = {
   fetchCollectionActivitiesHistory
}
