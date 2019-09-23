package main

import (
	"encoding/json"

	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

func (C *Chaincode) addInvioce(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	prjct := args[0]
	invArg := args[1] // invoice json string

	invObj := Invoice{}
	err := json.Unmarshal([]byte(invArg), &invObj)
	if err != nil {
		return shim.Error(err.Error())
	}

	// check if exists
	ck, err := stub.GetState(invObj.ID)
	if err != nil {
		return shim.Error(err.Error())
	} else if ck != nil {
		return shim.Error("Invoice invoice already exixts.")
	}

	invObj.ProjectID = prjct
	invObj.Type = "invoice"
	invObj.TxID = stub.GetTxID()

	invAsByte, err := json.Marshal(invObj)
	if err != nil {
		return shim.Error(err.Error())
	}

	stub.PutState(invObj.ID, invAsByte)

	return shim.Success(invAsByte)
}

func (C *Chaincode) queryInvoiceByProjectID(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	logger.Info("queryInvoiceByProjectID: start.")

	prj := args[0]
	queryStr := fmt.Sprintf(`{"selector":{"type":{"$eq": "invoice"},"project":{"$eq":"%s"}}}`, prj)
	resutls, err := C.queryWithSelector(stub, queryStr)
	if err != nil {
		return shim.Error(err.Error())
	}

	var invs []Invoice
	for _, invAsByte := range resutls {
		inv := Invoice{}
		json.Unmarshal(invAsByte, &inv)

		invs = append(invs, inv)
	}

	payload, err := json.Marshal(invs)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(payload)
}

func (C *Chaincode) deleteInvoice(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	invID := args[0]

	err := stub.DelState(invID)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}
