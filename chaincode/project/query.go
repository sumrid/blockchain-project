package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// query all by key
func (C *Chaincode) query(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	logger.Info(`query: start`)
	var key string
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	key = args[0]

	// Get the state from the ledger
	valbytes, err := stub.GetState(key)
	if err != nil {
		jsonResp := fmt.Sprintf(`{"Error":"Failed to get state for "%s"}`, key)
		logger.Error("query:", jsonResp)
		return shim.Error(jsonResp)
	}

	if valbytes == nil {
		jsonResp := fmt.Sprintf(`{"Error!!":"Nil amount for "%s"}`, key)
		logger.Error("query:", jsonResp)
		return shim.Error(jsonResp)
	}

	jsonResp := fmt.Sprintf(`{"Name":"%s","Amount":"%s"}`, key, string(valbytes))
	logger.Infof("Query Response: %sn", jsonResp)
	return shim.Success(valbytes)
}

func (C *Chaincode) queryAllWithSelector(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	logger.Info("queryAllWithSelector: start")
	if len(args) < 1 {
		logger.Error("Incorrect number of arguments. Expecting key to query")
		return shim.Error("Incorrect number of arguments. Expecting key to query")
	}

	qryStr := args[0]

	resultBytes, err := C.queryWithSelector(stub, qryStr)
	if err != nil {
		return shim.Error(err.Error())
	}

	var payloads []interface{}
	for _, valByte := range resultBytes {
		var val interface{}
		json.Unmarshal(valByte, &val)
		payloads = append(payloads, val)
	}

	payloadAsByte, err := json.Marshal(payloads)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(payloadAsByte)
}

func byteToStruct(bytes [][]byte, outputType interface{}) ([]interface{}, error) {
	var vals []interface{}
	for _, valAsByte := range bytes {
		val := outputType
		err := json.Unmarshal(valAsByte, &val)
		if err != nil {
			logger.Error("byteToStruct", err.Error())
			return nil, err
		}
		vals = append(vals, val)
	}
	logger.Info("byteToStruct:", byteToStruct)
	return vals, nil
}

// ใช้ค้นหาโดยใช้ selector
func (C *Chaincode) queryWithSelector(stub shim.ChaincodeStubInterface, query string) ([][]byte, error) {
	interator, err := stub.GetQueryResult(query)
	defer interator.Close()
	if err != nil {
		return nil, err
	}

	var results [][]byte
	for interator.HasNext() {
		result, err := interator.Next()
		if err != nil {
			return nil, err
		}
		// เพิ่มผลลัพธ์ลงไปใน list
		results = append(results, result.Value)
	}
	return results, nil
}
