### Raffle NFT Rewarder for Royalty Respecters

##### Combine optional royalties with raffle tickets to encourage royalties:

The objective is to be able to facilitate raffles and gift raffle NFT amongst the royalty respecters of a collection.

The creator of the collection saves upto 3 items(n NFTs) that have high rarity. These rare items are to be given out to the raffle winners.

Every time a buyer pays atleast half royalty when purchasing an NFT,the buyer would also earn a raffle ticket for this particular collection. Buyer paying full royalty would earn two raffle tickets on every NFT purchase.

It is upto the creators to decide how many raffles they want to run and at what point they want to run the raffles and give out these rare items to the raffle winners.

This tool facilitates the creators to view the list of buyers that respected royalties and run a raffle and send out the rare NFT to the raffle winner. Users/buyers should be able to check how many times(tickets) their address exists in this list.

---------------------
Note: To avoid wash trading (by setting really low prices and buying from oneself) to gain more raffle tickets by buyers, it is ideal to compute the no. of raffle tickets gained by the buyer taking in total royalty amount(SOL) paid by the buyer instead of half or full royalty as I described above.

I am merely keeping it simple as a POC for this hackathon by considering every royalty paid as a raffle ticket.

#### Setup  Instructions:

--------------------------------

#### Backend Service Setup:

Backend code is responsible for fetching all the activites/sales of particular collection , compute and return list of all txns and user addresses that respected royalties. 


```sh
  git clone https://github.com/harshabakku/royalty-respecters-rewarder.git
  cd backend/
  npm install 
  npm run server
  or
  npm start 
```
The above commands should start the server on port 5000 and  should be able to returns royalty respecters like this
http://localhost:5000/api/service/royaltyRespecters?collectionSymbol=meowths

-------------------

#### Frontend Setup:
Frontend code is responsible for displaying all royalty respecters, run a raffle, compute the winner and transfer the raffle NFT to winner.  
```sh
 cd frontend
 npm install
 npm start 
 ```

 The above commands should start the server on port 3000 and the UI should be available to view the respecters with buttons available to run Raffle and send Raffle NFT for a collection.

-------------------------

#### Testing for any Collection : 


use 'Run Raffle' and 'Send Raffle NFT' buttons in the UI after setting up both frontend and backend as described above. current setup is configured to use solana devnet.

Example Backend API with respecters data :
>http://localhost:5000/api/service/royaltyRespecters?collectionSymbol=kikiverse
>http://localhost:5000/api/service/royaltyRespecters?collectionSymbol=solgods

Example Datassource API from which sales data is fetched and royalty respecters data computed in the backend: (there is repetitive data on devnet)
>https://api-devnet.magiceden.io/rpc/getGlobalActivitiesByQueryWithAttributes?excludeSources=%5B%22yawww%22%2C%22solanart%22%2C%22tensortrade%22%2C%22hadeswap%22%2C%22coralcube_v2%22%2C%22elixir_buy%22%2C%22elixir_sell%22%2C%22hyperspace%22%5D&txTypes=%5B%22exchange%22%2C%22acceptBid%22%2C%22auctionSettled%22%5D&mintAttributes=%5B%5D&filterCollectionSymbol=meowths&offset=0&limit=500

To change the datasource API to mainnet, please set 'dataURLPrefix' as  'https://api-mainnet.magiceden.io/' in [backend/config.js](backend/config.js). 

To view royalty respecters for different collection and to run the raffle  please update 'raffleCollectionSymbol' in [frontend-react-app/src/config.js](frontend-react-app/src/config.js). 


Please note that API calls from backend like below are sometimes being blocked by magicEden cloudflare and that is why I had been using devnet for testing and development.
> https://api-mainnet.magiceden.io/rpc/getGlobalActivitiesByQueryWithAttributes?excludeSources=%5B%22yawww%22%2C%22solanart%22%2C%22tensortrade%22%2C%22hadeswap%22%2C%22coralcube_v2%22%2C%22elixir_buy%22%2C%22elixir_sell%22%2C%22hyperspace%22%5D&txTypes=%5B%22exchange%22%2C%22acceptBid%22%2C%22auctionSettled%22%5D&filterCollectionSymbol=y00ts&filterOnChainCollection=4mKSoDDqApmF1DqXvVTSL6tu2zixrSSNjqMxUnwvVzy2&mintAttributes=%5B%5D&offset=0&limit=50


----------------------------------------------------------

#### Demo Video 

> https://www.youtube.com/watch?v=uCZTvtm1200


------------------------------------------------------------

#### live setup on AWS server  

All the development and testing was locally done on a **16GB RAM** machine. I recommend atleast **8GB RAM** machine for the setup. 

Feel free to connect with me for any queries

> https://discordapp.com/users/harshabakku#3608

> https://t.me/harshabakku

