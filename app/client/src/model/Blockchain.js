import Web3 from 'web3';
import DateToken from "../contracts/Date.json";

let contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

let web3 = undefined
let account = undefined
let contract = undefined

export function tokenIdFromDate(date) {
    return (date.getFullYear()-1)*372 + date.getMonth()*31 + date.getDate()-1 
}

export async function initWeb3() {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      return true
    }
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider)
      return true
    }

    return false
}

export function isWeb3Ready() {
    return web3 !== undefined
}

export async function connectToBlockchain() {
    const accounts = await web3.eth.getAccounts()

    contract = new web3.eth.Contract(DateToken.abi, contractAddress)
    account = accounts[0]
}

export function isConnectedToBlockchain() {
    return contract !== undefined && account !== undefined
}

export async function loadAllMintedDates() {
    if (!isConnectedToBlockchain) {
        return {}
    }

    let allMintedDates = {}
    const totalSupply = await contract.methods.totalSupply().call()
    for (let i=0; i<totalSupply; i++) {
        const tokenId = await contract.methods.tokenByIndex(i).call()
        const token = await loadToken(tokenId)
        allMintedDates[tokenId.toString()] = token
    }
    return allMintedDates
}

export function claimDate(date, note) {
    return contract.methods.claim(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        note,
    ).send({
        from: account, 
        value: Web3.utils.toWei('10', 'finney')
    })
}

export async function loadToken(tokenId) {
    const tokenData = await contract.methods.get(tokenId).call()
    const owner = await contract.methods.ownerOf(tokenId).call()

    return {
        tokenId: tokenId,
        date: (() => { 
          let d = new Date()
          d.setUTCDate(tokenData[2])
          d.setUTCMonth(tokenData[1]-1)
          d.setFullYear(tokenData[0])
          return d
        })(),
        color: tokenData[3],
        title: tokenData[4].toString(),
        owner: owner
    }
}

export async function loadTokenForDate(date) {
    let token = await loadToken(tokenIdFromDate(date))
    return token
}