#!/bin/bash

truffle compile
mkdir -p app/contracts
mkdir -p app/client/src/contracts
cp abis/Date.json app/contracts/Date.json
cp abis/Date.json app/client/src/contracts/Date.json