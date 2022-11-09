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
 
 fetchActivities = async () => {
        
    const collectionURL = "https://api-mainnet.magiceden.dev/v2/collections/y00ts/activities?offset="+ offset + "&limit=1000"
    console.log('Fetching Data now....'+ collectionURL)
    
    try{
        const result = await axios.get(`${collectionURL}`,{
            headers: {
                "Content-Type": "application/json"
            }                                
        });


        console.log(result.data);

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

fetchCollectionActivitiesHistory = async () => {

    let activities = await fetchActivities();
    while (activities && activities.length >= 0 ) {
        activitiesHistory = activitiesHistory.concat(activities);
        // increase offset and fetch again
        offset = offset + 1000;
        console.log("fetching data again using offset "+ offset)
        activities = await fetchActivities();
    }

    console.log("total activities fetched "+ activitiesHistory.length);

}    
 
   
 
module.exports = {
   fetchCollectionActivitiesHistory
}
