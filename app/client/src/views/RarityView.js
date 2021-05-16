import React, { Component } from "react";
import { Col, Row } from 'react-bootstrap';
import { tokenIdFromDate } from "../model/Blockchain"
import DateTokenView from "./DateTokenView"

class RarityView extends Component {

    render() {
        let today = new Date()
        let tokenId = tokenIdFromDate(today)

        return (
            <Row id="rarity" className="pt-4 bg-light justify-content-center">
              <Col>
                <div className="text-center rarity-item">
                  <h2 className="mb-4">Pearl</h2>
                  <DateTokenView tokenId={tokenId} date={today} color="7"/>
                  <p className="mt-3">0.1%</p>
                </div>
              </Col>
              <Col>
                <div className="text-center rarity-item">
                  <h2 className="mb-4">Neon</h2>
                  <DateTokenView tokenId={tokenId} date={today} color="6"/>
                  <p className="mt-3">0.5%</p>
                </div>
              </Col>
              <Col>
                <div className="text-center rarity-item">
                  <h2 className="mb-4">Gold</h2>
                  <DateTokenView tokenId={tokenId} date={today} color="5"/>
                  <p className="mt-3">1%</p>
                </div>
              </Col>
              <Col>
                <div className="text-center rarity-item">
                  <h2 className="mb-4">Silver</h2>
                  <DateTokenView tokenId={tokenId} date={today} color="4"/>
                  <p className="mt-3">5%</p>
                </div>
              </Col>
              <Col>
                <div className="text-center rarity-item">
                  <h2 className="mb-4">Black</h2>
                  <DateTokenView tokenId={tokenId} date={today} color="3"/>
                  <p className="mt-3">10%</p>
                </div>
              </Col>
              <Col>
                <div className="text-center rarity-item">
                  <h2 className="mb-4">Green</h2>
                  <DateTokenView tokenId={tokenId} date={today} color="2"/>
                  <p className="mt-3">20%</p>
                </div>
              </Col>
              <Col>
                <div className="text-center rarity-item">
                  <h2 className="mb-4">Red</h2>
                  <DateTokenView tokenId={tokenId} date={today} color="1"/>
                  <p className="mt-3">30%</p>
                </div>
              </Col>
              <Col>
                <div className="text-center rarity-item">
                  <h2 className="mb-4">Blue</h2>
                  <DateTokenView tokenId={tokenId} date={today} color="0"/>
                  <p className="mt-3">33.4%</p>
                </div>
              </Col>
            </Row>
        )
    }
}

export default RarityView;