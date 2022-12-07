import logo from './logo.svg';
import './App.css';
import { Component } from "react";
import { Button } from "reactstrap";
// import {  Col, Row } from "reactstrap";
import { Container, Row, Col } from 'react-bootstrap';

import axios from "axios";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from  "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, transfer } from  "@solana/spl-token";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

//recieves NFT
const toWalletPublicKeyString = "YXAe6cRwn3UczVNpFWgr5vadupVcqT9Nq8qzvmmaMiX";


const getProvider = () => {
  if ('phantom' in window) {
    const provider = window.phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }

  window.open('https://phantom.app/', '_blank');
};



const getRoyaltyRespecters = async (collectionSymbol) => {
  try {
      const response = await axios.get(
          `http://localhost:5000/api/service/royaltyRespecters?${collectionSymbol?"collectionSymbol="+collectionSymbol:""}`,
      );
      
       console.log(response.data)
      return response.data;
  } catch (err) {
      console.log("Error Fetching royalty respecters for collection ", collectionSymbol);
  }
};


class App extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      respectersData : [],
      isLoading: true,
      rowPerPage: 100,
      pageNumber: 0,
      pageSize: 0,
      
    };
  }



componentDidMount = async () => {

  const collectionSymbol = undefined 
  console.log("fetching royalty respecters for collection  .."+ collectionSymbol);
  const respectersData  = await getRoyaltyRespecters(collectionSymbol);

  await this.setState({
    collectionSymbol : collectionSymbol,
    isLoading: false,
    respectersData: respectersData    
  });


};

 
connectPhantomWallet =  async() =>{
 
  const provider = getProvider(); // see "Detecting the Provider"
  try {
      const resp = await provider.connect();
      console.log("connectedAddress " + resp.publicKey.toString());
      await this.setState({
        connectedAddress : resp.publicKey.toString()
      });
  } catch (err) {
     console.log(err)  
    // { code: 4001, message: 'User rejected the request.' }
  }

}

disconnectPhantomWallet =  async() =>{
 
  const provider = getProvider(); // see "Detecting the Provider"
  try {
      provider.disconnect();
      console.log("disconnecting Wallet " + this.state.connectedAddress);
      await this.setState({
        connectedAddress : null
      });      
  } catch (err) {
     console.log(err)  
  }

}


sendRaffleNftTransaction =  async() =>{
 
  // Connect to cluster
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();
  const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL
  );

  // Wait for airdrop confirmation
  await connection.confirmTransaction(fromAirdropSignature);

  // Create a new token 
  const mint = await createMint(
    connection, 
    fromWallet,            // Payer of the transaction
    fromWallet.publicKey,  // Account that will control the minting 
    null,                  // Account that will control the freezing of the token 
    0                      // Location of the decimal place 
  );

  // Get the token account of the fromWallet Solana address. If it does not exist, create it.
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey
  );

  // Generate a new wallet to receive the newly minted token
  // const toWallet = Keypair.generate();
 
  const toWalletPublicKey = new PublicKey(toWalletPublicKeyString);
  // Get the token account of the toWallet Solana address. If it does not exist, create it.
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    toWalletPublicKey
    // toWallet.publicKey

  );

  // Minting 1 new token to the "fromTokenAccount" account we just returned/created.
  let signature = await mintTo(
    connection,
    fromWallet,               // Payer of the transaction fees 
    mint,                     // Mint for the account 
    fromTokenAccount.address, // Address of the account to mint to 
    fromWallet.publicKey,     // Minting authority
    1                         // Amount to mint 
  );

  console.log("NFT Mint SIGNATURE", signature);

  await setAuthority(
    connection,
    fromWallet,            // Payer of the transaction fees
    mint,                  // Account 
    fromWallet.publicKey,  // Current authority 
    0,                     // Authority type: "0" represents Mint Tokens 
    null                   // Setting the new Authority to null
  );

  signature = await transfer(
    connection,
    fromWallet,               // Payer of the transaction fees 
    fromTokenAccount.address, // Source account 
    toTokenAccount.address,   // Destination account 
    fromWallet.publicKey,     // Owner of the source account 
    1                         // Number of tokens to transfer 
  );

  console.log("Transfer SIGNATURE", signature);

}


computeRaffleWinner = async () => {
  
  const royaltyRespecters = this.state.respectersData;

  console.log(royaltyRespecters.length)
  const randIndex = Math.floor(Math.random() * royaltyRespecters.length)

  console.log(randIndex)
  console.log(royaltyRespecters[randIndex]);
  console.log("raffle winner "+ royaltyRespecters[randIndex].buyer_address);

  await this.setState({
    raffleWinner : royaltyRespecters[randIndex].buyer_address
  })
  
  await this.sendRaffleNftTransaction()

}


render() {

  let { pageNumber, pageSize, rowPerPage, respectersData, isLoading } = this.state;


  return (
    <div>
             
             {

             !this.state.connectedAddress? (
            <Button 
                outline
                className="mt-4 raffleButton"
                color="primary"
                type="submit"
                onClick={this.connectPhantomWallet}
            >            
                Connect Wallet
            </Button>):(
             <div>
                <p>connectedAddress</p>
                <p>{this.state.connectedAddress}</p>
                <Button 
                  outline
                  className="mt-4 raffleButton"
                  color="primary"
                  type="submit"
                  onClick={this.disconnectPhantomWallet}
                >            
                   Disconnect Wallet
                </Button>
             </div> 
            )
            }

            <Button 
                outline
                className="mt-4 raffleButton"
                color="primary"
                type="submit"
                onClick={this.computeRaffleWinner}
            >            
                Run Raffle
            </Button>

      {this.state.raffleWinner && 
      <div>      
          <h1 className="text-4xl leading-normal">
          Raffle Winner amongst Royalty Respecters for Collection <br></br>  {this.state.collectionSymbol}
          {this.state.raffleWinner} 
          </h1>

          <Button 
            outline
            className="mt-4 raffleButton"
            color="primary"
            type="submit"
            // onClick={this.computeRaffleWinner}
          >            
          Send Raffle NFT
          </Button>
          </div>
      
      }


      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />   
      </header> */}

      <div className=''>
      {respectersData?.map((i) => (
                            <Row className="" style={{ fontSize: 15, fontWeight:500}}>
                                <Col > {i.buyer_address}</Col>

                                <Col > {i.seller_address}</Col>
                                   
                            </Row>
                        ))}

      </div>

      <Container>
                <Row>
                    <Col>1</Col>
                    <Col>2</Col>
                    <Col>3</Col>
                </Row>
            </Container>
    </div>
  );
}

}

export default App;
