package main

import (
	"encoding/json"

	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// addInvoice เพิ่มใบกำกับภาษีเข้าระบบ
func (C *Chaincode) addInvioce(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	prj := args[0]
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

	invObj.ProjectID = prj
	invObj.Type = "invoice"
	invObj.TxID = stub.GetTxID()

	invAsByte, err := json.Marshal(invObj)
	if err != nil {
		return shim.Error(err.Error())
	}

	stub.PutState(invObj.ID, invAsByte)

	return shim.Success(invAsByte)
}

// ทำการเพิ่มใบกำกับภาษี และ ถอนเงินจากโครงการไปให้คนเพิ่มใบกำกับภาษี
func (C *Chaincode) addInvioceAndTransfer(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	logger.Info("addInvioceAndTransfer: start")
	usrID := args[0]
	prjID := args[1]
	invJSON := args[2]

	inv := Invoice{}
	err := json.Unmarshal([]byte(invJSON), &inv)
	if err != nil {
		return shim.Error(err.Error())
	}
	inv.ProjectID = prjID
	inv.Type = "invoice"
	inv.TxID = stub.GetTxID()

	// check if invoice exists
	ck, err := stub.GetState(inv.ID)
	if err != nil {
		return shim.Error(err.Error())
	} else if ck != nil {
		return shim.Error("Invoice invoice already exixts.")
	}

	prj := Project{}
	prjAsByte, err := stub.GetState(prjID)
	if err != nil {
		return shim.Error(err.Error())
	} else if prjAsByte == nil {
		return shim.Error("Project not found.")
	}

	err = json.Unmarshal(prjAsByte, &prj)
	if err != nil {
		return shim.Error(err.Error())
	}

	if prj.Balance < inv.Total {
		return shim.Error("Not enough money to withdraw.")
	}

	prj.Balance -= inv.Total // เอาเงินจากโครงการ

	usr := User{}
	usrAsByte, err := stub.GetState(usrID)
	if err != nil {
		shim.Error(err.Error())
	}

	if usrAsByte == nil { // if user not create.
		usr.ID = usrID
		usr.Type = "user"
		usr.Balance += inv.Total
	} else {
		json.Unmarshal(usrAsByte, &usr)
		usr.Balance += inv.Total
	}

	// create event
	evt := Event{}
	evt.ID = "event_" + stub.GetTxID()
	evt.Type = "event"
	evt.TxID = stub.GetTxID()
	evt.ProjectID = prjID
	evt.Event = "withdraw"
	evt.Message = fmt.Sprintf("Transfer money to %s %.2f Baht (tex invoice: %s)", usr.ID, inv.Total, inv.ID)
	t, _ := stub.GetTxTimestamp()
	evt.Timestamp = t.GetSeconds()

	invAsByte, err := json.Marshal(inv)
	prjAsByte, err = json.Marshal(prj)
	usrAsByte, err = json.Marshal(usr)
	evtAsByte, err := json.Marshal(evt)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Put state
	stub.PutState(inv.ID, invAsByte)
	stub.PutState(prj.ID, prjAsByte)
	stub.PutState(usr.ID, usrAsByte)
	stub.PutState(evt.ID, evtAsByte)

	return shim.Success(invAsByte)
}

func (C *Chaincode) deleteInvoice(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	invID := args[0]

	err := stub.DelState(invID)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}
