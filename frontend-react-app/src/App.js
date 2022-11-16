import logo from './logo.svg';
import './App.css';
import { Component } from "react";
// import {  Col, Row } from "reactstrap";
import { Container, Row, Col } from 'react-bootstrap';

import axios from "axios";


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
    isLoading: false,
    respectersData: respectersData    
  });

  await this.computeRaffleWinner(respectersData);

};

computeRaffleWinner = async (royaltyRespecters) => {

  console.log(royaltyRespecters.length)
  const randIndex = Math.floor(Math.random() * royaltyRespecters.length)

  console.log(randIndex)
  console.log(royaltyRespecters[randIndex]);
  console.log("raffle winner "+ royaltyRespecters[randIndex].buyer_address);

}


render() {

  let { pageNumber, pageSize, rowPerPage, respectersData, isLoading } = this.state;


  return (
    <div>
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
