package main

import (
	"encoding/json"
	"testing"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"gotest.tools/assert"
)

var loggerTestInvoice = shim.NewLogger("invoice_test.go")

func TestAddInvoice(T *testing.T) {
	loggerTestInvoice.Info(`Start testing function "addInvioce"`)

	inv := Invoice{
		ID:     "001",
		Number: 1,
	}
	invAsByte, _ := json.Marshal(inv)
	args := [][]byte{
		[]byte("addInvoice"),
		[]byte("p_01"),
		invAsByte,
	}

	res := stub.MockInvoke("INV001", args)

	json.Unmarshal(res.GetPayload(), &inv)

	assert.Assert(T, res.GetStatus() == shim.OK)
	assert.Equal(T, inv.ID, "001")
	assert.Equal(T, inv.Type, "invoice")
	assert.Equal(T, inv.ID, "001")
	assert.Equal(T, inv.VAT, 0.0)
}

// func TestQueryInvoicd(T *testing.T) {
// 	loggerTestInvoice.Info(`Start testing function "queryInvoice"`)

// 	args := [][]byte{
// 		[]byte("queryInvoiceByProjectID"),
// 		[]byte("p_01"),
// 	}

// 	res := stub.MockInvoke("INV002", args)

// 	assert.Assert(T, res.GetStatus() == shim.OK)
// }
