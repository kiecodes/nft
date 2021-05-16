import React, { Component } from "react";
import Calendar from 'react-calendar';
import DateTokenView from "./views/DateTokenView"
import ClaimFormView from "./views/ClaimFormView"
import RarityView from "./views/RarityView"
import { loadTokenForDate, connectToBlockchain, isConnectedToBlockchain, initWeb3, isWeb3Ready, loadAllMintedDates, tokenIdFromDate } from "./model/Blockchain"
import { Col, Container, Row } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';
import "./App.css";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loadingBlockchainData: true,
      selectedDate: new Date(),
      allMintedDates: {}
    }
  }

  loadBlockchainData = async () => {
    if (!isWeb3Ready() || !isConnectedToBlockchain()) {
      return
    }

    this.setState({ loadingBlockchainData: true })

    let allMintedDates = await loadAllMintedDates()
    this.setState({ allMintedDates })

    this.setState({ loadingBlockchainData: false })
  }

  getTokenForDate = (date) => {
    return this.state.allMintedDates[tokenIdFromDate(date)]
  }

  componentDidMount = async () => {
    let result = await initWeb3()
    if (!result) {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        return
    }

    await connectToBlockchain()
    
    await this.loadBlockchainData()
  };

  renderClaimFormOrAlreadyClaimed = () => {
    if (this.state.loadingBlockchainData) {
      return (<p>loading …</p>)
    }

    let token = this.getTokenForDate(this.state.selectedDate)
    if (token !== undefined) {
      return this.renderDateAlreadyClaimed(token)
    } else {
      return (
        <ClaimFormView
          selectedDate={this.state.selectedDate}
          onSubmit={ () => {
            this.setState({ loadingBlockchainData: true })
          }}
          onDone={ async () => {
            let newDateToken = await loadTokenForDate(this.state.selectedDate)
            console.log(newDateToken)
            let allMintedDates = this.state.allMintedDates
            allMintedDates[tokenIdFromDate(this.state.selectedDate)] = newDateToken
            this.setState({ allMintedDates })

            this.setState({ loadingBlockchainData: false })
          }}
          onError={ ()=> {
            this.setState({ loadingBlockchainData: false })
          }}
        />
      )
    }
  }

  renderDateAlreadyClaimed = (token) => {
    return (
      <div>
        <DateTokenView tokenId={token.tokenId} date={token.date} color={token.color} />
        <p className="mt-3">
          <span className="tokenTitle noteBox py-2 px-2">
            {token.title}
          </span>
        </p>
        <p className="ownerAdress mt-3">
          <b>Owner:</b>
          <a href={`https://opensea.io/accounts/${token.owner}`}>
            {token.owner.substring(0,16)}...
          </a>
        </p>
      </div>
    )
  }

  render() {
    let elonsBirthdate = new Date(1971, 5, 28)

    return (
      <Container fluid>
        <Row className="justify-content-center dark headline">
          <div className="text-center mt-3 mb-1">
            <h1>Date Token</h1>
            <p className="lead">Every day is unique</p>
          </div>
        </Row>
        <Row id="explanation" className="justify-content-center bg-light pt-4 pb-3">
          <Col lg="3" md="6" sm="12" className="text-center">
            <div>
              <DateTokenView tokenId={tokenIdFromDate(elonsBirthdate)} date={elonsBirthdate} color="7"/>
              <p className="mt-2">Elon's Birthday</p>
            </div>
          </Col>
          <Col lg="3" md="6" sm="12" className="mt-10">
          <p>DATE TOKEN are ERC721 Non-Fungible-Tokens stored inside the Ethereum Blockchain.</p>
          <p>Each DATE TOKEN is unique. There can only be one for each Date since Monday, January 1st of Year 1. The date is fully encoded in each element of the token.</p>
          <p>The owner of a DATE TOKEN can change its title and trade it like any other ERC721 NFT.</p>
          <p>DATE TOKEN come in 8 styles with different rarities.</p>
          </Col>
        </Row>
        <Row className="medium text-center pt-4">
          <Col>
          <h2 className="headline">Claim your date in history</h2>
          </Col>
        </Row>
        <Row className="medium text-center pt-4">
          <Col>
            <p id="explanation">You can claim any unclaimed date between today and the 1. January of the year 0001.</p>
          </Col>
        </Row>
        <Row className="justify-content-center medium pt-4 pb-4">
          <Col lg="3" md="6" sm="12">
            <Calendar 
                className="mt-3 calendar"
                value={this.state.selectedDate}
                onClickDay={ (selectedDate, event) => this.setState({ selectedDate }) }
                maxDate={ new Date() }
                tileClassName={ ({ date, view }) => view === 'month' && this.getTokenForDate(date) !== undefined ? 'claimed' : null}
              />
          </Col>
          <Col lg="3" md="6" sm="12" className="mt-3">
            {this.renderClaimFormOrAlreadyClaimed()}
          </Col>
        </Row>
        <Row id="rarity" className="justify-content-center pt-4 bg-light">
          <Col lg="6" md="8" sm="12" className="text-center">
          < h2 className="headline">Rarity</h2>
            <p>Each date is unique, but in order to increase the fun while minting, there are also some materials a DATE TOKEN can be minted with. The material is randomly choosen during the process and stored for eternity in the blockchain.</p>
          </Col>
        </Row>
        <RarityView />
        <Row className="medium justify-content-center pt-4"> 
          <h2 className="headline">Date inventory</h2>
        </Row>
        <Row className="medium justify-content-center pt-4"> 
          <h2>coming soon …</h2>
        </Row>
      </Container>
    );
  }
}

export default App;
