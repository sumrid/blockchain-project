package main

import (
	"encoding/json"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

func (C *Chaincode) addUser(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	logger.Info("[addUser]: start.")

	if len(args) < 2 {
		logger.Error("[addUser]", "Incorrect arguments.")
		return shim.Error("[addUser] Incorrect arguments.")
	}

	uid := args[0]
	role := args[1]

	usr := User{
		ID:   uid,
		Role: role,
		Type: "user",
	}

	usrAsByte, err := stub.GetState(uid)
	// if err != nil {
	// 	return shim.Error(err.Error())
	// } else if usrAsByte != nil {
	// 	return shim.Error("User exists id: " + uid)
	// }

	usrAsByte, err = json.Marshal(usr)
	if err != nil {
		return shim.Error(err.Error())
	}

	stub.PutState(usr.ID, usrAsByte)

	return shim.Success(usrAsByte)
}

func (C *Chaincode) updateUserVerify(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	logger.Info("[updateUserVerify]: start.")

	uid := args[0]
	vfy, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	// Get state
	usrAsByte, err := stub.GetState(uid)
	if err != nil {
		return shim.Error(err.Error())
	} else if usrAsByte == nil {
		return shim.Error("User not found.")
	}

	usr := User{}
	err = json.Unmarshal(usrAsByte, &usr)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Update
	usr.Verify = vfy

	type payload struct {
		TxID    string      `json:"txid"`
		Payload interface{} `json:"payload"`
	}

	usrAsByte, err = json.Marshal(usr)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Put state
	stub.PutState(usr.ID, usrAsByte)

	res := payload{}
	res.TxID = stub.GetTxID()
	res.Payload = usr

	resAsByte, _ := json.Marshal(res)

	return shim.Success(resAsByte)
}

func (C *Chaincode) deleteUser(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	uid := args[0]

	stub.DelState(uid)

	return shim.Success(nil)
}
