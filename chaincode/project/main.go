package main

import (
	"fmt"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// สถานะของโครงการ
const (
	Open   = "open"
	Closed = "closed"
	Fail   = "fail"
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
	ID          string    `json:"id"`
	TxID        string    `json:"txid"`        // Transaction ID ของการบริจาคครั้งนั้น
	UserID      string    `json:"user"`        // uid ของผู้บริจาคเงิน
	DisplayName string    `json:"displayname"` // ชื่อที่จะแสดงบนรายการบริจาค
	ProjectID   string    `json:"project"`     // uid ของโปรเจค
	Amount      float64   `json:"amount"`      // จำนวนเงินที่การบริจาคมาในครั้งหนี่ง
	Time        time.Time `json:"time"`        // เวลาที่ทำการบริจาค
	Method      string    `json:"method"`
	Type        string    `json:"type"`
}

// User ข้อมูลของผู้ใช้
type User struct {
	ID      string  `json:"id"`      // uid ของฝู้ใช้
	Name    string  `json:"name"`    // ชื่อผู้ใช้
	Balance float64 `json:"balance"` // จำนวนเงินที่ได้จากการคืนหรือ จำนวนเงินที่รอพร้อมถอนออก
	Role    string  `json:"role"`
	Verify  int     `json:"verify"`
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
	Verified     bool      `json:"verified"`
}

var logger = shim.NewLogger("chaincode")

// Chaincode ...
type Chaincode struct {
}

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
	} else if fn == "donateWithWallet" {
		return C.donateWithWallet(stub, args)
	} else if fn == "getHistory" { // ...
		return C.getHistory(stub, args)
	} else if fn == "closeProject" { // เปลี่ยนสถานะโครงการเป็นปิด เมื่อเวลาหมดลง
		return C.closeProject(stub, args)
	} else if fn == "updateStatus" {
		return C.updateStatus(stub, args)
	} else if fn == "updateProject" {
		return C.updateProject(stub, args)
	} else if fn == "deleteProject" {
		return C.deleteProject(stub, args)
	} else if fn == "payBack" { // คืนเงินให้คนบริจาค
		return C.payBack(stub, args)
	} else if fn == "withdraw__" { // ถอนเงินจากโครงการไปให้ คนที่เป็นเจ้าของหรือคนที่รับเงิน
		return C.withdraw(stub, args)
	} else if fn == "withdraw" { // นำเงินจากโครงการออกไปใช้จ่ายก่อน
		return C.transfer(stub, args)
	} else if fn == "addInvoice" {
		return C.addInvioce(stub, args)
	} else if fn == "deleteInvoice" {
		return C.deleteInvoice(stub, args)
	} else if fn == "addInvioceAndTransfer" {
		return C.addInvioceAndTransfer(stub, args)
	} else if fn == "queryAllWithSelector" {
		return C.queryAllWithSelector(stub, args)
	} else if fn == "addUser" {
		return C.addUser(stub, args)
	} else if fn == "updateUserVerify" {
		return C.updateUserVerify(stub, args)
	} else if fn == "deleteUser" {
		return C.deleteUser(stub, args)
	}

	logger.Error("invoke did not find func: " + fn)
	return shim.Error("Received unknown function " + fn)
}

func main() {
	err := shim.Start(new(Chaincode))
	if err != nil {
		fmt.Printf("Error start chaincode: %s", err)
	}
}
