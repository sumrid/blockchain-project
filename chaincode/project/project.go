package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

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
	start, err := time.Parse(time.RFC3339, args[5])
	end, err := time.Parse(time.RFC3339, args[6])
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
	if len(args) < 5 {
		return shim.Error("Incorrect number of arguments.")
	}

	// Create donation object
	donation := Donation{}
	donation.TxID = stub.GetTxID()
	donation.UserID = args[0]
	donation.ProjectID = args[1]
	donation.Amount, err = strconv.ParseFloat(args[2], 64)
	donation.Time, err = time.Parse(time.RFC3339, args[3])
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
	return shim.Success(dByte)
}

func (C *Chaincode) donateWithWallet(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	usrID := args[0]
	prjID := args[1]
	amount, err := strconv.ParseFloat(args[2], 64)
	disName := args[3]
	if err != nil {
		return shim.Error(err.Error())
	}

	donation := Donation{}
	donation.ID = "donation_" + stub.GetTxID()
	donation.TxID = stub.GetTxID()
	donation.UserID = usrID
	donation.DisplayName = disName
	donation.ProjectID = prjID
	donation.Amount = amount
	t, _ := stub.GetTxTimestamp()
	donation.Time = time.Unix(t.GetSeconds(), 0)
	donation.Method = "wallet"
	donation.Type = "donation"

	usr := User{}
	prj := Project{}

	usrAsByte, _ := stub.GetState(usrID)
	prjAsByte, _ := stub.GetState(prjID)

	if usrAsByte == nil {
		return shim.Error("User not fond.")
	}
	if prjAsByte == nil {
		return shim.Error("Project not fond.")
	}

	err = json.Unmarshal(usrAsByte, &usr)
	err = json.Unmarshal(prjAsByte, &prj)
	if err != nil {
		return shim.Error(err.Error())
	}

	if (usr.Balance < amount) {
		return shim.Error("Not enough money in wallet.")
	}

	usr.Balance -= amount
	prj.Balance += amount
	prj.Accumulated += amount

	usrAsByte, err = json.Marshal(usr)
	prjAsByte, err = json.Marshal(prj)
	dntAsByte, err := json.Marshal(donation)
	if err != nil {
		return shim.Error(err.Error())
	}

	stub.PutState(usr.ID, usrAsByte)
	stub.PutState(prj.ID, prjAsByte)
	stub.PutState(donation.ID, dntAsByte)

	return shim.Success(dntAsByte)
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
	logger.Info("payBack: start.")

	// TODO  คือทีเดียวทุกคนเลย เพื่อจะได้ไม่มี tx เกิดขึ้นเยอะ
	projectID := agrs[0]

	// Get project ที่ต้องการจะทำการคืนเงิน
	p := Project{}
	pByte, err := stub.GetState(projectID)
	if err != nil {
		return shim.Error(err.Error())
	} else if pByte == nil {
		logger.Error("payBack: Project not found.")
		return shim.Error("Project not found.")
	}

	err = json.Unmarshal(pByte, &p) // To struct
	if err != nil {
		logger.Error("payBack:", err.Error())
		return shim.Error(err.Error())
	}

	if p.Status == Fail {
		return shim.Success(pByte)
	}

	// Get donations ของการโครงการนั้นๆ
	var donations []Donation
	res, err := stub.GetState("history_" + projectID)
	if err != nil {
		return shim.Error(err.Error())
	}

	if res != nil {
		err = json.Unmarshal(res, &donations)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	// ทำการคืนเงิน
	// balance := p.Balance // ยอดเงินคงเหลือขณะนั้น
	percent := (p.Balance / p.Accumulated) * 100
	for _, donation := range donations {
		toPayBack := (donation.Amount * percent) / 100
		p.Balance -= toPayBack // เอาเงินออก

		// คืนเงิน user
		usr := User{}
		usrAsByte, _ := stub.GetState(donation.UserID)
		if usrAsByte == nil {
			usr.ID = donation.UserID
			usr.Type = "user"
			usr.Balance += toPayBack
		} else {
			err = json.Unmarshal(usrAsByte, &usr)
			usr.Balance += toPayBack
		}

		trns := Donation{}
		trns.TxID = stub.GetTxID()
		trns.UserID = usr.ID
		trns.ProjectID = projectID
		trns.Amount = toPayBack
		trns.Type = "transfer"
		t, _ := stub.GetTxTimestamp()
		trns.Time = time.Unix(t.GetSeconds(), 0)

		usrAsByte, err = json.Marshal(usr)
		trnsAsByte, err := json.Marshal(trns)
		if err != nil {
			return shim.Error(err.Error())
		}

		// save user
		stub.PutState(usr.ID, usrAsByte)
		stub.PutState("transfer_"+donation.TxID, trnsAsByte)
	}

	evt := Event{}
	evt.ID = "event_" + stub.GetTxID()
	evt.TxID = stub.GetTxID()
	evt.ProjectID = p.ID
	evt.Event = "payback"
	evt.Message = "คืนเงินให้ผู้บริจาคเนื่องจากยอดเงินไม่ครบกำหนด"
	t, _ := stub.GetTxTimestamp()
	evt.Timestamp = t.GetSeconds()
	evt.Type = "event"
	evtAsByte, err := json.Marshal(evt)
	if err != nil {
		return shim.Error(err.Error())
	}

	// เปลี่ยนสถานะ
	p.Status = Fail

	// Save state
	pByte, err = json.Marshal(p)
	err = stub.PutState(projectID, pByte)
	err = stub.PutState(evt.ID, evtAsByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(pByte)
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
	inv := args[3]                                 // invoice id
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

// โอนเงินให้เจ้าของโครงการ
func (C *Chaincode) transfer(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	ursID := args[0]
	prjID := args[1]
	amt, err := strconv.ParseFloat(args[2], 64)
	if err != nil {
		return shim.Error(err.Error())
	}

	usrAsByte, err := stub.GetState(ursID)
	prjAsByte, err := stub.GetState(prjID)
	if err != nil {
		return shim.Error(err.Error())
	}

	usr := User{}
	prj := Project{}

	err = json.Unmarshal(usrAsByte, &usr)
	err = json.Unmarshal(prjAsByte, &prj)
	if err != nil {
		return shim.Error(err.Error())
	}

	if prj.Balance < amt {
		return shim.Error("Not enough money to transfer.")
	}

	usr.Balance += amt
	prj.Balance -= amt

	trnsf := Donation{}
	trnsf.ID = "transfer_" + stub.GetTxID()
	trnsf.TxID = stub.GetTxID()
	trnsf.UserID = ursID
	trnsf.ProjectID = prjID
	trnsf.Amount = amt
	trnsf.Type = "transfer"
	t, _ := stub.GetTxTimestamp()
	trnsf.Time = time.Unix(t.GetSeconds(), 0)

	// Create event
	evt := Event{}
	evt.ID = "event_" + stub.GetTxID()
	evt.Type = "event"
	evt.TxID = stub.GetTxID()
	evt.ProjectID = prjID
	evt.Event = "withdraw"
	evt.Message = fmt.Sprintf("Transfer money to %s %.2f Baht", ursID, amt)
	evt.Timestamp = t.GetSeconds()

	usrAsByte, err = json.Marshal(usr)
	prjAsByte, err = json.Marshal(prj)
	evtAsByte, err := json.Marshal(evt)
	trnsfAsByte, err := json.Marshal(trnsf)
	if err != nil {
		return shim.Error(err.Error())
	}

	stub.PutState(ursID, usrAsByte)
	stub.PutState(prj.ID, prjAsByte)
	stub.PutState(evt.ID, evtAsByte)
	stub.PutState(trnsf.ID, trnsfAsByte)

	return shim.Success(trnsfAsByte)
}
