import logo from './logo.svg';
import './App.css';
import { Component } from "react";
import ReactTable from "react-table-6";
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

  this.setState({
    isLoading: false,
    respectersData: respectersData    
  });

};

render() {

  let { pageNumber, pageSize, rowPerPage, respectersData, isLoading } = this.state;


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Testing : Learn React
        </a>
      </header>

      <ReactTable
            data={respectersData}
            columns={[
                {
                    Header: "Buyer",
                    accessor: "buyer_address",
                },
                {
                    Header: "Seller",
                    accessor: "seller_address",
                },
            ]}
            loading={isLoading}
            loadingText={"Fetching Royalty Respecters for collection..."}
            minRows={
                respectersData?.length
            }
            manual={true}
            manualPagination={true}
            page={pageNumber}
            pages={pageSize}
            pageSize={rowPerPage}
            defaultPageSize={rowPerPage}
            pageSizeOptions={[100, 500, 1000]}
            onPageChange={this.onPageChange}
            onPageSizeChange={this.onRowPerPageChange}
      />
    </div>
  );
}

}

export default App;
