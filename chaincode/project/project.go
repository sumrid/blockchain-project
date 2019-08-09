package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// type User struct {
// 	StdID  string `json:"stdID"`
// 	Name   string `json:"name"`
// 	Tel    string `json:"tel"`
// 	Status bool   `json:"status"`
// }
// type Wallet struct {
// 	WalletName string  `json:"walletName"`
// 	Money      float64 `json:"money"`
// 	Owner      string  `json:"owner"`
// }

const DatetimeLayout = "02-01-2006:15:04:05"

type Project struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Status    string    `json:"status"`
	Balance   float64   `json:"balance"`
	Owner     string    `json:"owner"`
	StartTime time.Time `json:"starttime"`
	EndTime   time.Time `json:"endtime"`
}

type Donation struct {
	TxID      string    `json:"txid"`
	UserID    string    `json:"user"`
	ProjectID string    `json:"project"`
	Amount    float64   `json:"amount"`
	Time      time.Time `json:"time"`
}

type Chaincode struct {
}

var logger = shim.NewLogger("chaincode")

// Init เป็นฟังก์ชันเอาไว้เริ่มต้น chaincode
func (C *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	logger.Info("Init chaincode success.")
	return shim.Success([]byte("Init Success"))
}

// Invoke เป็นฟังก์ชันหลักที่ chaincode ต้องมี
func (C *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()

	if fn == "query" {
		return C.query(stub, args)
	} else if fn == "createProject" {
		return C.createProject(stub, args)
	} else if fn == "donate" {
		return C.donate(stub, args)
	} else if fn == "getHistory" {
		return C.getHistory(stub, args)
	} else if fn == "getDonationHistory" {
		return C.getDonationHistory(stub, args)
	} else if fn == "queryAllProjects" {
		return C.queryAllProjects(stub, args)
	}

	logger.Error("invoke did not find func: " + fn)
	return shim.Error("Received unknown function " + fn)
}

func (C *Chaincode) createProject(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// Check arguments
	if len(args) != 7 {
		return shim.Error("Incorrect arguments, Want 5 input.")
	}

	// Create project object
	id := args[0]
	title := args[1]
	status := args[2]
	balance, _ := strconv.ParseFloat(args[3], 64)
	owner := args[4]
	start, err := time.Parse(DatetimeLayout, args[5])
	end, err := time.Parse(DatetimeLayout, args[6])
	if err != nil {
		return shim.Error(err.Error())
	}
	p := Project{id, title, status, balance, owner, start, end}

	pJSON, err := json.Marshal(p)
	if err != nil {
		fmt.Println(err.Error())
		return shim.Error(err.Error())
	}

	// Put state
	err = stub.PutState(id, pJSON)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Return success
	logger.Info("createProject : success")
	return shim.Success(pJSON)
}

func (C *Chaincode) donate(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	var err error

	// Check arguments
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments.")
	}

	// Create donation object
	donation := Donation{}
	donation.TxID = stub.GetTxID()
	donation.UserID = args[0]
	donation.ProjectID = args[1]
	donation.Amount, err = strconv.ParseFloat(args[2], 64)
	donation.Time, err = time.Parse(DatetimeLayout, args[3])
	if err != nil {
		return shim.Error(err.Error())
	}

	// TODO อาจจะทำการเช็ค user in chaincode
	// Check user exist
	// userByte, err := stub.GetState(user)
	// if err != nil {
	// 	shim.Error(err.Error())
	// }
	// if userByte == nil {
	// 	shim.Error("User id not fond.")
	// }

	// Get project
	projectByte, err := stub.GetState(donation.ProjectID)
	if err != nil {
		return shim.Error(err.Error())
	} else if projectByte == nil {
		return shim.Error("Project id not fond.")
	}

	// TODO ทำให้โปรเจคเปลี่ยนสถานะ เมื่อหมดเวลา
	// TODO ตรวจด้วยว่าโปรเจคถูกปิดหรือยัง

	p := Project{}
	err = json.Unmarshal(projectByte, &p)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Get Donations
	donationKey := "history_" + donation.ProjectID
	hisByte, err := stub.GetState(donationKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	var donations []Donation
	if hisByte != nil {
		err = json.Unmarshal(hisByte, &donations)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	// Update project
	p.Balance += donation.Amount

	// Update donations
	donations = append(donations, donation)

	// Put project
	projectByte, err = json.Marshal(p)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(p.ID, projectByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Put donations
	hisByte, err = json.Marshal(donations)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(donationKey, hisByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Return
	return shim.Success(nil)
}
func (C *Chaincode) getDonationHistory(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments.")
	}

	// Set key for query
	donationKey := "history_" + args[0]

	// Get state for key
	bytes, err := stub.GetState(donationKey)
	if err != nil {
		return shim.Error(err.Error())
	} else if bytes == nil {
		return shim.Success([]byte("[]"))
	}

	return shim.Success(bytes)
}

func (C *Chaincode) getHistory(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments.")
	}

	his, err := stub.GetHistoryForKey(args[0])
	defer his.Close()
	if err != nil {
		shim.Error(err.Error())
	}

	type item struct {
		ID    string `json:"id"`
		Value string `json:"value"`
	}
	var results []item

	for his.HasNext() {
		result, err := his.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		i := item{result.GetTxId(), string(result.GetValue())}

		// เพิ่มผลลัพธ์ลงไปใน list
		results = append(results, i)
	}

	fmt.Println(results)

	bytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Return
	return shim.Success(bytes)
}

func (C *Chaincode) query(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	var key string // Entities
	var err error

	// Check arguments
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	key = args[0]

	// Get the state from the ledger
	Avalbytes, err := stub.GetState(key)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	if Avalbytes == nil {
		jsonResp := "{\"Error!!\":\"Nil amount for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	jsonResp := "{\"Name\":\"" + key + "\",\"Amount\":\"" + string(Avalbytes) + "\"}"
	fmt.Printf("Query Response:%s\n", jsonResp)
	return shim.Success(Avalbytes)
}

func (C *Chaincode) queryAllProjects(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// Query all
	query := `{"selector":{"id":{"$regex":"p_"}}}`
	results, err := C.queryWithSelector(stub, query)
	if err != nil {
		return shim.Error(err.Error())
	}

	var projects []Project
	for _, pByte := range results {
		p := Project{}
		json.Unmarshal(pByte, &p)

		projects = append(projects, p)
	}

	// Return result
	res, _ := json.Marshal(projects)
	return shim.Success(res)
}

func (C *Chaincode) queryWithSelector(stub shim.ChaincodeStubInterface, query string) ([][]byte, error) {

	queryString := query
	interator, err := stub.GetQueryResult(queryString)
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

// TODO ทำฟังก์ชั่นเปลี่ยน status ของโครงการที่หมดเวลา

func main() {
	err := shim.Start(new(Chaincode))
	if err != nil {
		fmt.Printf("Error start chaincode: %s", err)
	}
}
