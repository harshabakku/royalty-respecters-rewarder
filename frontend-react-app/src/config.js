/**
 * Basic configurations of the server
 * @author harsha bakku
 * @since 0.1
 * @version 0.1
 */


(function() {
    // export configuration parameters
    module.exports = {
       
        backendRoyaltyRespectersDataURL : 'http://localhost:5000/api/service/royaltyRespecters', 

        //   kikiverse, solgods,  meltedcrocos,meowths are the only the collections with data on devnet.  
        //   go to backend/config.js to change the dataUrl to mainnet as needed
        raffleCollectionSymbol : 'meowths',

        phantomWebURL : 'https://phantom.app/'
                         
    }
})();
