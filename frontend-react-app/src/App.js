import logo from './logo.svg';
import './App.css';
import { Component } from "react";
import { Button } from "reactstrap";
// import {  Col, Row } from "reactstrap";
import { Container, Row, Col } from 'react-bootstrap';

import axios from "axios";

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

 
connectWallet =  async() =>{
 
  const provider = getProvider(); // see "Detecting the Provider"
  try {
      const resp = await provider.connect();
      console.log("connectedAddress " + resp.publicKey.toString());
      await this.setState({
        connectedAddress : resp.publicKey.toString()
      });
      // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
  } catch (err) {
     console.log(err)  
    // { code: 4001, message: 'User rejected the request.' }
  }

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

}


render() {

  let { pageNumber, pageSize, rowPerPage, respectersData, isLoading } = this.state;


  return (
    <div>

            <Button 
                outline
                className="mt-4 raffleButton"
                color="primary"
                type="submit"
                onClick={this.connectWallet}
            >            
                Connect Wallet
            </Button>

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
