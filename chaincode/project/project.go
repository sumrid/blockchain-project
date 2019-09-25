package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

const (
	DatetimeLayout = "02-01-2006:15:04:05"
	Open           = "open"
	Closed         = "closed"
	Fail           = "fail"
)

// Project เป็นโครงการสำหรับเก็บช้อมูลใน blockchain
type Project struct {
	ID          string    `json:"id"`          // เป็นรหัสของโครงการ จะมีลักษณะเป็น 'p_30d1ea-c0af...'
	Title       string    `json:"title"`       // ชื่อหรือหัวข้อของโครงการ
	Status      string    `json:"status"`      // สถานะของโครงการว่าเปิดอยู่ หรือ หมดเวลาแล้ว
	Balance     float64   `json:"balance"`     // ยอดจำนวนเงินปัจุบันของโครงการ
	Accumulated float64   `json:"accumulated"` // ยอดเงินสะสมทั้งหมด
	Owner       string    `json:"owner"`       // เป็น uid ของผู้ที่เป็นเจ้าของโครงการ
	StartTime   time.Time `json:"starttime"`   // เวลาที่การสร้างโครงการ
	EndTime     time.Time `json:"endtime"`     // เวลาที่โครงการสิ้นสุด
	Receiver    string    `json:"receiver"`    // uid ของผู้รับเงิน TODO เพิ่มไอดีผู้รับเงิน
	Goal        float64   `json:"goal"`        // จำนวนเงินที่ต้องการ TODO เพิ่มยอดเงินที่ต้องการด้วย
	Condition   int       `json:"condition"`   // เงื่อนไขการตัดเงินของโครงการ
	Type        string    `json:"type"`
}

// Donation ข้อมูลของการบริจาค
type Donation struct {
	TxID        string    `json:"txid"`        // Transaction ID ของการบริจาคครั้งนั้น
	UserID      string    `json:"user"`        // uid ของผู้บริจาคเงิน
	DisplayName string    `json:"displayname"` // ชื่อที่จะแสดงบนรายการบริจาค
	ProjectID   string    `json:"project"`     // uid ของโปรเจค
	Amount      float64   `json:"amount"`      // จำนวนเงินที่การบริจาคมาในครั้งหนี่ง
	Time        time.Time `json:"time"`        // เวลาที่ทำการบริจาค
	Type        string    `json:"type"`
}

// User ข้อมูลของผู้ใช้
type User struct {
	ID      string  `json:"id"`      // uid ของฝู้ใช้
	Name    string  `json:"name"`    // ชื่อผู้ใช้
	Balance float64 `json:"balance"` // จำนวนเงินที่ได้จากการคืนหรือ จำนวนเงินที่รอพร้อมถอนออก
	Role    string  `json:"role"`
	Type    string  `json:"type"`
	// TODO สร้างการเก็บข้อมูลของผู้ใช้ว่าจะให้มีอะไรบ้าง  ..คนสร้างโครงการ ..ผู้รับเงิน
}

// Event เหตุการณ์ของโครงการ เช่น เปิดโครงการ, ยอมรับ, ปิด, ล้มเหลว เมื่อเวลาไหน
type Event struct {
	ID        string `json:"id"`
	TxID      string `json:"txid"`
	ProjectID string `json:"project"`
	Event     string `json:"event"`
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
	Type      string `json:"type"`
}

// WithdrawRequest ขอเงินโอนเงิน
type WithdrawRequest struct {
	ID            string `json:"id"`
	Type          string `json:"type"`
	Project       string `json:"project"` // uid ของโครงการ
	Status        string `json:"status"`
	InvoiceNumber string `json:"invoice"`
}

// Item สินค้าในใบกำกับภาษี
type Item struct {
	Name   string  `json:"name"`
	Price  float64 `json:"price"`
	Amount int     `json:"amount"`
}

// Invoice ข้อมูลของใบกำกับภาษี
type Invoice struct {
	ID           string    `json:"id"`      // invoice uid
	ProjectID    string    `json:"project"` // รหัสโครงการ
	Number       int       `json:"number"`  // เลขที่ใบกำกับภาษี
	CustomerName string    `json:"cusname"`
	VAT          float64   `json:"vat"`
	Items        []Item    `json:"items"`
	Total        float64   `json:"total"`
	Date         time.Time `json:"date"`
	Type         string    `json:"type"`
	TxID         string    `json:"txid"`
}

// Chaincode ...
type Chaincode struct {
}

var logger = shim.NewLogger("chaincode")

// Init เป็นฟังก์ชันเอาไว้เริ่มต้น chaincode
// จะถูกเรียกใช้ตอนที่ทำการ Instantiate
func (C *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	logger.Info("Init chaincode success.")
	return shim.Success([]byte("Init Success"))
}

// Invoke เป็นฟังก์ชันหลักที่ chaincode ต้องมี
func (C *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()

	if fn == "query" { // ดึงข้อมูลใน blockchain จากคีย์
		return C.query(stub, args)
	} else if fn == "createProject" { // สร้างโครงการ
		return C.createProject(stub, args)
	} else if fn == "donate" { // ทำการบริจาคเงินให้กับโครงการ
		return C.donate(stub, args)
	} else if fn == "getHistory" { // ...
		return C.getHistory(stub, args)
	} else if fn == "getDonationHistory" { // ดึงรายการการบริจาคของโครงการนั้นๆ ด้วย uid
		return C.getDonationHistory(stub, args)
	} else if fn == "queryAllProjects" { // ดึงโครงการทั้งหมดออกมา
		return C.queryAllProjects(stub, args)
	} else if fn == "closeProject" { // เปลี่ยนสถานะโครงการเป็นปิด เมื่อเวลาหมดลง
		return C.closeProject(stub, args)
	} else if fn == "queryDonationByUserID" { // ดึงรายการบริจาคด้วย uid ของผู้ใช้
		return C.queryDonationByUserID(stub, args)
	} else if fn == "queryProjectByUserID" {
		return C.queryProjectByUserID(stub, args)
	} else if fn == "queryProjectByReceiverID" {
		return C.queryProjectByReceiverID(stub, args)
	} else if fn == "updateStatus" {
		return C.updateStatus(stub, args)
	} else if fn == "updateProject" {
		return C.updateProject(stub, args)
	} else if fn == "deleteProject" {
		return C.deleteProject(stub, args)
	} else if fn == "payBack" {
		return C.payBack(stub, args)
	} else if fn == "withdraw" {
		return C.withdraw(stub, args)
	} else if fn == "queryEvent" {
		return C.queryEventByProjectID(stub, args)
	} else if fn == "addInvoice" {
		return C.addInvioce(stub, args)
	} else if fn == "queryInvoiceByProjectID" {
		return C.queryInvoiceByProjectID(stub, args)
	} else if fn == "deleteInvoice" {
		return C.deleteInvoice(stub, args)
	} else if fn == "addInvioceAndTransfer" {
		return C.addInvioceAndTransfer(stub, args)
	}

	logger.Error("invoke did not find func: " + fn)
	return shim.Error("Received unknown function " + fn)
}

// createProject - สำหรับสร้างโครงการ
// มีการรับ agrs ดังนี้
// 	- args[0] function name
func (C *Chaincode) createProject(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	logger.Info("createProject: start.")
	// Check arguments
	if len(args) != 9 {
		return shim.Error("Incorrect arguments, Want 9 input.")
	}

	// Create project object
	id := args[0]
	title := args[1]
	status := args[2]
	balance, err := strconv.ParseFloat(args[3], 64)
	owner := args[4]
	start, err := time.Parse(DatetimeLayout, args[5])
	end, err := time.Parse(DatetimeLayout, args[6])
	receiver := args[7]
	goal, err := strconv.ParseFloat(args[8], 64)
	oType := "project" // กำหนดชนิดของข้อมูล
	if err != nil {
		return shim.Error(err.Error())
	}

	p := Project{
		ID:          id,
		Title:       title,
		Status:      status,
		Balance:     balance,
		Accumulated: 0.0,
		Owner:       owner,
		StartTime:   start,
		EndTime:     end,
		Receiver:    receiver,
		Goal:        goal,
		Type:        oType,
	}

	pJSON, err := json.Marshal(p)
	if err != nil {
		fmt.Println(err.Error())
		return shim.Error(err.Error())
	}

	// Create event
	evt := Event{}
	evt.ID = "event_" + stub.GetTxID()
	evt.TxID = stub.GetTxID()
	evt.ProjectID = p.ID
	evt.Event = "create project"
	evt.Message = "create project"
	evt.Type = "event"
	t, _ := stub.GetTxTimestamp()
	evt.Timestamp = t.GetSeconds()
	evtByte, err := json.Marshal(evt)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Put state
	err = stub.PutState(id, pJSON)
	err = stub.PutState(evt.ID, evtByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Return success
	logger.Info("createProject: success, project ID: " + p.ID)
	return shim.Success(pJSON)
}

func (C *Chaincode) updateProject(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments.")
	}
	id := args[0]
	title := args[1]

	// Get
	pByte, err := stub.GetState(id)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Set
	p := Project{}
	err = json.Unmarshal(pByte, &p)
	p.Title = title

	// Put
	pByte, err = json.Marshal(p)
	err = stub.PutState(id, pByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(pByte)
}

func (C *Chaincode) donate(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	var err error

	// Check arguments
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments.")
	}

	// Create donation object
	donation := Donation{}
	donation.TxID = stub.GetTxID()
	donation.UserID = args[0]
	donation.ProjectID = args[1]
	donation.Amount, err = strconv.ParseFloat(args[2], 64)
	donation.Time, err = time.Parse(DatetimeLayout, args[3])
	donation.DisplayName = args[4]
	donation.Type = "donation" // กำหนดชนิดของข้อมูล
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
		return shim.Error("Project not fond.")
	}

	p := Project{}
	err = json.Unmarshal(projectByte, &p)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check if the project is closed.
	if p.Status != Open {
		return shim.Error("Project is not open.")
	}

	// Check if time out.
	if p.EndTime.Before(time.Now()) {
		return shim.Error("This project has timed out.")
	}

	// Get Donations.
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
	p.Accumulated += donation.Amount

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

	// Put donations history
	hisByte, err = json.Marshal(donations)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(donationKey, hisByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Put donation type
	dByte, err := json.Marshal(donation)
	err = stub.PutState(donation.TxID, dByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Return
	return shim.Success(nil)
}

// getDonationHistory by project ID
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

// getHistory แสดงรายการการเปลี่ยนแปลง ของ key นั้นๆ
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

// query all by key
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
	// Query all projects
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

// Query donation by userID
func (C *Chaincode) queryDonationByUserID(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	userID := args[0]
	queryString := fmt.Sprintf(`{"selector":{"type":{"$eq": "donation"},"user":{"$eq":"%s"}}}`, userID)

	results, err := C.queryWithSelector(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	var donations []Donation
	for _, dByte := range results {
		d := Donation{}
		err = json.Unmarshal(dByte, &d)
		if err != nil {
			return shim.Error(err.Error())
		}
		donations = append(donations, d)
	}

	payload, err := json.Marshal(donations)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Return result
	return shim.Success(payload)
}

// Query project by ownerID
func (C *Chaincode) queryProjectByUserID(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	userID := args[0]
	queryString := fmt.Sprintf(`{"selector":{"type":{"$eq": "project"},"owner":{"$eq":"%s"}}}`, userID)

	results, err := C.queryWithSelector(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	var projects []Project
	for _, pByte := range results {
		p := Project{}
		err = json.Unmarshal(pByte, &p)
		if err != nil {
			return shim.Error(err.Error())
		}
		projects = append(projects, p)
	}

	payload, err := json.Marshal(projects)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(payload)
}

func (C *Chaincode) queryProjectByReceiverID(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	reID := args[0]
	queryString := fmt.Sprintf(`{"selector":{"type":{"$eq": "project"},"receiver":{"$eq":"%s"}}}`, reID)

	results, err := C.queryWithSelector(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	var projects []Project
	for _, pByte := range results {
		p := Project{}
		err = json.Unmarshal(pByte, &p)
		if err != nil {
			return shim.Error(err.Error())
		}
		projects = append(projects, p)
	}

	payload, err := json.Marshal(projects)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(payload)
}

func (C *Chaincode) queryProjectBySelector(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// TODO อาจจะทำ query by selector
	query := args[0]
	results, err := C.queryWithSelector(stub, query)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Byte to struct
	var projects []Project
	for _, pByte := range results {
		p := Project{}
		err = json.Unmarshal(pByte, &p)
		if err != nil {
			return shim.Error(err.Error())
		}
		projects = append(projects, p)
	}

	payload, err := json.Marshal(projects)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(payload)
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

func (C *Chaincode) closeProject(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 1 {
		return shim.Error("Expect 1 argument.")
	}

	// Get state
	key := args[0]

	result, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	} else if result == nil {
		return shim.Error("Project not fond.")
	}

	p := Project{}
	err = json.Unmarshal(result, &p)
	if err != nil {
		return shim.Error(err.Error())
	}

	// เปลี่ยนสถานะโครงการ
	if p.Status != Closed {
		p.Status = Closed
	}

	result, err = json.Marshal(p)
	if err != nil {
		return shim.Error(err.Error())
	}

	evt := Event{}
	evt.ID = "event_" + stub.GetTxID()
	evt.TxID = stub.GetTxID()
	evt.ProjectID = p.ID
	evt.Event = "update"
	evt.Message = "The project is closed because the time is up."
	evt.Type = "event"
	t, _ := stub.GetTxTimestamp()
	evt.Timestamp = t.GetSeconds()
	evtAsByte, err := json.Marshal(evt)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Save project
	err = stub.PutState(key, result)
	err = stub.PutState(evt.ID, evtAsByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("Success."))
}

func (C *Chaincode) updateStatus(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 3 {
		return shim.Error("Expect 1 argument.")
	}
	user := args[0]
	id := args[1]
	status := args[2]

	// Get project
	result, err := stub.GetState(id)
	if err != nil {
		return shim.Error(err.Error())
	}

	p := Project{}
	err = json.Unmarshal(result, &p)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check permission
	if p.Receiver != user && p.Owner != user {
		return shim.Error("401 " + user)
	}

	// Update project
	p.Status = status

	evt := Event{}
	evt.ID = "event_" + stub.GetTxID()
	evt.TxID = stub.GetTxID()
	evt.ProjectID = p.ID
	evt.Event = "update"
	evt.Message = fmt.Sprintf(`Change project status to "%s" by %s`, status, user)
	evt.Type = "event"
	t, _ := stub.GetTxTimestamp()
	evt.Timestamp = t.GetSeconds()
	evtAsByte, err := json.Marshal(evt)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Save project
	result, err = json.Marshal(p)
	err = stub.PutState(id, result)
	err = stub.PutState(evt.ID, evtAsByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(result)
}

func (C *Chaincode) deleteProject(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 1 {
		return shim.Error("Expect 1 argument.")
	}

	key := args[0]

	err := stub.DelState(key)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("Delete success. key: " + key))
}

// คืนเงินให้คนบริจาาค ในกรณีที่โครงการล้มเหลว
func (C *Chaincode) payBack(stub shim.ChaincodeStubInterface, agrs []string) peer.Response {

	// TODO  คือทีเดียวทุกคนเลย เพื่อจะได้ไม่มี tx เกิดขึ้นเยอะ
	projectID := agrs[0]

	// Get project ที่ต้องการจะทำการคืนเงิน
	p := Project{}
	pByte, err := stub.GetState(projectID)
	if err != nil {
		return shim.Error(err.Error())
	} else if pByte == nil {
		return shim.Error("Project not found.")
	}
	err = json.Unmarshal(pByte, &p) // To struct

	if p.Status == Fail {
		return shim.Success(pByte)
	}

	// Get donations ของการโครงการนั้นๆ
	var donations []Donation
	res, err := stub.GetState("history_" + projectID)
	if res == nil {
		return shim.Success(nil)
	}

	err = json.Unmarshal(res, &donations)
	if err != nil {
		return shim.Error(err.Error())
	}

	// ทำการคืนเงิน
	// balance := p.Balance // ยอดเงินคงเหลือขณะนั้น
	percent := (p.Balance / p.Accumulated) * 100
	for _, donation := range donations {
		toPayBack := (donation.Amount * percent) / 100
		p.Balance -= toPayBack // เอาเงินออก

		// ให้เงิน user
	}

	// เปลี่ยนสถานะ
	p.Status = Fail

	// Save state
	pByte, err = json.Marshal(p)
	err = stub.PutState(projectID, pByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// withdraw ถอนเงินจากโครงการไปให้ คนที่เป็นเจ้าของหรือคนที่รับเงิน
func (C *Chaincode) withdraw(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	logger.Info("withdraw: start.")

	if len(args) < 4 {
		logger.Error("Expected 4 arguments.")
		return shim.Error("Expected 4 arguments.")
	}

	user := args[0]                                // user id
	project := args[1]                             // project id
	amount, err := strconv.ParseFloat(args[2], 64) // amount to withdraw
	inv := args[3]
	if err != nil {
		return shim.Error(err.Error())
	}

	pAsByte, err := stub.GetState(project)
	if err != nil {
		return shim.Error(err.Error())
	} else if pAsByte == nil {
		return shim.Error("Project not found.")
	}

	p := Project{}
	err = json.Unmarshal(pAsByte, &p)
	if err != nil {
		return shim.Error(err.Error())
	}

	if p.Balance < amount {
		return shim.Error("Not enough money to withdraw.")
	}

	p.Balance -= amount
	// user.balance += amount

	pAsByte, err = json.Marshal(p)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Create event
	evt := Event{}
	evt.ID = "event_" + stub.GetTxID()
	evt.Type = "event"
	evt.TxID = stub.GetTxID()
	evt.ProjectID = project
	evt.Event = "withdraw"
	evt.Message = fmt.Sprintf("Transfer money to %s %.2f Baht (tex invoice: %s)", user, amount, inv)
	t, _ := stub.GetTxTimestamp()
	evt.Timestamp = t.GetSeconds()
	evtAsByte, err := json.Marshal(evt)
	if err != nil {
		return shim.Error(err.Error())
	}

	// put state
	stub.PutState(project, pAsByte)
	stub.PutState(evt.ID, evtAsByte)
	// stub.PutState(user, nil)

	type payload struct {
		Amount float64 `json:"amount"`
	}
	pay, err := json.Marshal(payload{amount})
	logger.Info("withdraw: success. txID: " + stub.GetTxID())
	return shim.Success(pay)
}

func (C *Chaincode) queryEventByProjectID(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	proj := args[0]
	queryStr := fmt.Sprintf(`{"selector":{"type":{"$eq": "event"},"project":{"$eq":"%s"}}}`, proj)

	results, err := C.queryWithSelector(stub, queryStr)
	if err != nil {
		return shim.Error(err.Error())
	}

	var evts []Event
	for _, evtByte := range results {
		evt := Event{}
		err = json.Unmarshal(evtByte, &evt)
		if err != nil {
			return shim.Error(err.Error())
		}
		evts = append(evts, evt)
	}

	payload, err := json.Marshal(evts)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(payload)
}

func (C *Chaincode) withdrawRequest(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	return shim.Success(nil)
}

func main() {
	err := shim.Start(new(Chaincode))
	if err != nil {
		fmt.Printf("Error start chaincode: %s", err)
	}
}
