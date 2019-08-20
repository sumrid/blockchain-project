package main

import (
	"encoding/json"
	"testing"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

var loggerTest = shim.NewLogger("project_test.go")
var stub = shim.NewMockStub("stub", new(Chaincode))

func TestInit(T *testing.T) {
	loggerTest.Info(`Start testing function "Init"`)

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

	fn := "createProject"
	id := "p_01"
	title := "Project name"
	status := "open"
	balance := "0"
	owner := "user1"
	start := "11-07-2019:12:00:00"
	end := "11-09-2019:12:00:00"
	args := [][]byte{
		[]byte(fn),
		[]byte(id),
		[]byte(title),
		[]byte(status),
		[]byte(balance),
		[]byte(owner),
		[]byte(start),
		[]byte(end)}

	res := stub.MockInvoke("002", args)

	if res.GetStatus() != shim.OK {
		loggerTest.Error("Response status should 200")
		T.Error("Response status should 200")
	}
}

func TestDonate(T *testing.T) {
	loggerTest.Info(`Start testing function "Donate"`)
	args := [][]byte{
		[]byte("donate"),
		[]byte("user"),
		[]byte("p_01"),
		[]byte("99"),
		[]byte("11-07-2019:12:00:00"),
		[]byte("s.k"),
	}
	res := stub.MockInvoke("003", args)

	if res.GetStatus() != shim.OK {
		loggerTest.Error(res.GetMessage(), "Response status should 200")
		T.Error("Response status should 200")
	}
}

func TestGetDonationHistory(T *testing.T) {
	loggerTest.Info(`Start testing function "getDonationHistory"`)

	args := [][]byte{
		[]byte("getDonationHistory"),
		[]byte("p_01")}
	res := stub.MockInvoke("004", args)

	result := []Donation{}
	json.Unmarshal(res.GetPayload(), &result)

	if res.GetStatus() != shim.OK {
		loggerTest.Error(res.GetMessage(), "Response status should 200")
		T.Error("Response status should 200")
	}
	if len(result) != 1 {
		T.Error("Donation should be 1.")
	}
}
func TestQeuryAllProjects(T *testing.T) {
	loggerTest.Info(`Start testing function "queryAllProjects"`)
}
