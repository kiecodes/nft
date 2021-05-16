import React, { Component } from "react";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "."

class DateTokenView extends Component {
    render() {
        let tokenId = this.props.tokenId
        let year = this.props.date.getFullYear()
        let month = this.props.date.getMonth()+1
        let day = this.props.date.getDate()
        let color = this.props.color

        return (
            <img 
                key={tokenId}
                alt={`Date Token ${tokenId}`}
                src={`${apiBaseUrl}/token/svg/${tokenId}/${year}/${month}/${day}/${color}`} 
                style={{
                    width: "100%",
                    marginBottom: "-1.5em",
                    marginTop: "-1.5em",
                    marginLeft: "-1.5em",
                    marginRight: "-1.5em",
                    maxWidth: "20em"
                }}
            />
        )
    }
}

export default DateTokenView;