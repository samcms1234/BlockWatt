package main

import (
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract defines the contract structure
type SmartContract struct {
	contractapi.Contract
}

// InitLedger initializes the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	return nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		log.Panicf("Error creating blockwatt chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("Error starting blockwatt chaincode: %v", err)
	}
}
