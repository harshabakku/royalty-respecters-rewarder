/**
 * Basic configurations of the server
 * @author harsha bakku
 * @since 0.1
 * @version 0.1
 */

const dotenv = require('dotenv');
dotenv.config(); //leverage this and maintain separate .env files for different environments in the future.

(function() {
    // export configuration parameters
    module.exports = {

        
        //mainnet equivalent is 
        // https://api-mainnet.magiceden.io/rpc/getGlobalActivitiesByQueryWithAttributes?excludeSources=%5B%22yawww%22%2C%22solanart%22%2C%22tensortrade%22%2C%22hadeswap%22%2C%22coralcube_v2%22%2C%22elixir_buy%22%2C%22elixir_sell%22%2C%22hyperspace%22%5D&txTypes=%5B%22exchange%22%2C%22acceptBid%22%2C%22auctionSettled%22%5D&filterCollectionSymbol=y00ts&filterOnChainCollection=4mKSoDDqApmF1DqXvVTSL6tu2zixrSSNjqMxUnwvVzy2&mintAttributes=%5B%5D&offset=0&limit=50
        // mainnet url currently blocked for hackathon devs by cloudflare but works directly in the browser 
        // mainnet url also leveraged on https://magiceden.io/marketplace/y00ts?activeTab=activity 
        // this url gets all sale data for a particular collection along with royaltyAmount and royaltyPaid (creator_fees_amount)
        
        dataURLPrefix : 'https://api-devnet.magiceden.io/', 

        expressServerPort : 5000,
                         
    }
})();
