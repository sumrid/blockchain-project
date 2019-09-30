package main

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"gotest.tools/assert"
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
	start := "1997-07-11T12:00:00Z"
	end := "2021-01-01T12:00:00Z"
	receiver := "user2"
	goal := "500000"
	args := [][]byte{
		[]byte(fn),
		[]byte(id),
		[]byte(title),
		[]byte(status),
		[]byte(balance),
		[]byte(owner),
		[]byte(start),
		[]byte(end),
		[]byte(receiver),
		[]byte(goal)}

	res := stub.MockInvoke("002", args)

	if res.GetStatus() != shim.OK {
		loggerTest.Error("Response status should 200", res.GetMessage())
		T.Error("Response status should 200")
	}

	// Check state
	b, err := stub.GetState("p_01")
	p := Project{}
	err = json.Unmarshal(b, &p)
	if err != nil {
		loggerTest.Error(err.Error())
	}

	assert.Equal(T, p.ID, id)
	assert.Equal(T, p.Title, title)
	assert.Equal(T, p.Status, status)
	assert.Equal(T, p.Balance, 0.0)
	assert.Equal(T, p.Owner, owner)
	assert.Equal(T, p.Receiver, receiver)
	assert.Equal(T, p.Type, "project")
	assert.Equal(T, p.EndTime.Format(time.RFC3339), end)
}

func TestCreateProjectFails(T *testing.T) {
	args := [][]byte{
		[]byte("createProject"),
	}
	res := stub.MockInvoke("test-create-fails", args)

	assert.Assert(T, res.GetStatus() == shim.ERROR)
	assert.Equal(T, res.GetMessage(), "Incorrect arguments, Want 9 input.")
}

func TestDonate(T *testing.T) {
	loggerTest.Info(`Start testing function "Donate"`)
	args := [][]byte{
		[]byte("donate"),
		[]byte("user"),
		[]byte("p_01"),
		[]byte("99"),
		[]byte("2019-07-11T12:00:00Z"),
		[]byte("s.k"),
	}
	res := stub.MockInvoke("003", args)

	if res.GetStatus() != shim.OK {
		loggerTest.Error(res.GetMessage(), "Response status should 200")
		T.Error("Response status should 200")
	}

	// Check state
	b, err := stub.GetState("p_01")
	p := Project{}
	err = json.Unmarshal(b, &p)
	if err != nil {
		loggerTest.Error(err.Error())
	}

	assert.Assert(T, res.GetPayload() != nil)
	assert.Equal(T, p.Balance, 99.00)
	assert.Equal(T, p.Accumulated, 99.00)
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
	if result[0].UserID != "user" {
		loggerTest.Error("User id should user")
		T.Error("User id should user")
	}
}
func TestQeuryAllProjects(T *testing.T) {
	loggerTest.Info(`Start testing function "queryAllProjects"`)

	// ไม่สามารถทดสอบการ query แบบ selector ได้
	// args := [][]byte{
	// 	[]byte("queryAllProjects"),
	// }
	// res := stub.MockInvoke("005", args)
	// projects := []Project{}
	// json.Unmarshal(res.GetPayload(), &projects)

	// if res.GetStatus() != shim.OK {
	// 	loggerTest.Error(res.GetMessage(), "Response status should 200")
	// 	T.Error("Response status should 200")
	// }
}

func TestQuery(T *testing.T) {
	loggerTest.Info(`Start testing function "query"`)

	args := [][]byte{
		[]byte("query"),
		[]byte("p_01"),
	}
	res := stub.MockInvoke("006", args)
	p := Project{}
	json.Unmarshal(res.GetPayload(), &p)

	assert.Assert(T, res.GetStatus() == shim.OK)
	assert.Equal(T, p.ID, "p_01")
	assert.Equal(T, p.Balance, 99.0)
}

func TestQueryDonationsByUserID(T *testing.T) {
	loggerTest.Info(`Start testing function "queryDonationsByUserID"`)
	// ไม่สามารถทดสอบการ query แบบ selector ได้
	// args := [][]byte{
	// 	[]byte("queryDonationByUserID"),
	// 	[]byte("user"),
	// }
	// res := stub.MockInvoke("007", args)
	// loggerTest.Info(res)
	assert.Equal(T, true, true)
}

func TestGetHistoryInvalidAgrs(T *testing.T) {
	args := [][]byte{
		[]byte("getHistory"),
	}
	res := stub.MockInvoke("007", args)

	assert.Assert(T, res.GetStatus() == shim.ERROR)
	assert.Equal(T, res.GetMessage(), "Incorrect number of arguments.")
}

func TestCloseProject(T *testing.T) {
	args := [][]byte{
		[]byte("closeProject"),
		[]byte("p_01"),
	}
	res := stub.MockInvoke("008", args)

	// Check state
	b, err := stub.GetState("p_01")
	p := Project{}
	err = json.Unmarshal(b, &p)
	if err != nil {
		loggerTest.Error(err.Error())
	}

	assert.Assert(T, res.GetStatus() == shim.OK)
	assert.Equal(T, p.Status, "closed")
}

func TestCloseProjectInvalidArgs(T *testing.T) {
	args := [][]byte{
		[]byte("closeProject"),
	}
	res := stub.MockInvoke("009", args)

	assert.Assert(T, res.GetStatus() == shim.ERROR)
	assert.Equal(T, res.GetMessage(), "Expect 1 argument.")
}

func TestInvalidFunctionName(T *testing.T) {
	loggerTest.Info("Test invalid function name.")
	args := [][]byte{
		[]byte("some-function"),
	}
	res := stub.MockInvoke("010", args)

	assert.Assert(T, res.GetStatus() == shim.ERROR)
	assert.Equal(T, res.GetMessage(), "Received unknown function some-function")
}
