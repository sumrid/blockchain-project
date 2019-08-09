package main

import (
	"testing"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

var loggerTest = shim.NewLogger("project_test.go")

func TestInit(T *testing.T) {
	loggerTest.Info(`Start testing function "Init"`)

	stub := shim.NewMockStub("Test init", new(Chaincode))
	response := stub.MockInit("01", nil)
	payload := response.GetPayload()

	if response.Status != shim.OK {
		loggerTest.Error(`Response status should 200`)
		T.Error("Response should be 200")
	}
	if string(payload) != "Init Success" {
		loggerTest.Error(`Payload should be "Init Success"`)
		T.Error(`Payload should be "Init Success"`)
	}
}

func TestCreateProject(T *testing.T) {
	loggerTest.Info(`Start testing function "CreateProject"`)
}

func TestDonate(T *testing.T) {
	loggerTest.Info(`Start testing function "Donate"`)
}
