#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

CC_RUNTIME_LANGUAGE=golang
CC_SRC_PATH=github.com/chaincode/project
CC_NAME=mychaincode
CHANNEL=donation

# clean the keystore
rm -rf ./hfc-key-store

# launch network, create channel and join peer to channel
# เริ่มเครือข่าย สร้างชาแนล และ เข้าร่วมชาแนล
cd network/v2
./start.sh

sleep 3

#########################
#     ติดตั้ง chaincode
#########################
echo "===========  Install CHAINCODE ============="
echo $CC_SRC_PATH
docker exec \
	-e "CORE_PEER_LOCALMSPID=Org1MSP" \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
	-e 'CORE_PEER_ADDRESS=peer0.org1.example.com:7051' \
	-e 'CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt' \
	cli \
	peer chaincode install \
	-n $CC_NAME \
	-v 1.0 \
	-p $CC_SRC_PATH \
	-l $CC_RUNTIME_LANGUAGE
docker exec \
	-e "CORE_PEER_LOCALMSPID=Org1MSP" \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
	-e 'CORE_PEER_ADDRESS=peer1.org1.example.com:7051' \
	-e 'CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt' \
	cli \
	peer chaincode install \
	-n $CC_NAME \
	-v 1.0 \
	-p $CC_SRC_PATH \
	-l $CC_RUNTIME_LANGUAGE

docker exec \
	-e "CORE_PEER_LOCALMSPID=Org2MSP" \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
	-e 'CORE_PEER_ADDRESS=peer0.org2.example.com:7051' \
	-e 'CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt' \
	cli \
	peer chaincode install \
	-n $CC_NAME \
	-v 1.0 \
	-p $CC_SRC_PATH \
	-l $CC_RUNTIME_LANGUAGE
docker exec \
	-e "CORE_PEER_LOCALMSPID=Org2MSP" \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
	-e 'CORE_PEER_ADDRESS=peer1.org2.example.com:7051' \
	-e 'CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt' \
	cli \
	peer chaincode install \
	-n $CC_NAME \
	-v 1.0 \
	-p $CC_SRC_PATH \
	-l $CC_RUNTIME_LANGUAGE

docker exec \
	-e "CORE_PEER_LOCALMSPID=Org3MSP" \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp" \
	-e 'CORE_PEER_ADDRESS=peer0.org3.example.com:7051' \
	-e 'CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt' \
	cli \
	peer chaincode install \
	-n $CC_NAME \
	-v 1.0 \
	-p $CC_SRC_PATH \
	-l $CC_RUNTIME_LANGUAGE
docker exec \
	-e "CORE_PEER_LOCALMSPID=Org3MSP" \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp" \
	-e 'CORE_PEER_ADDRESS=peer1.org3.example.com:7051' \
	-e 'CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls/ca.crt' \
	cli \
	peer chaincode install \
	-n $CC_NAME \
	-v 1.0 \
	-p $CC_SRC_PATH \
	-l $CC_RUNTIME_LANGUAGE

#########################
# instantiate chaincode
#########################
echo "========= Instantiate chaincode ========="
echo "## main channel ##"
docker exec \
	-e "CORE_PEER_LOCALMSPID=Org1MSP" \
	-e 'CORE_PEER_ADDRESS=peer0.org1.example.com:7051' \
	-e 'CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt' \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
	cli \
	peer chaincode instantiate \
	-o orderer.example.com:7050 \
	-C $CHANNEL -n $CC_NAME -l golang -v 1.0 \
	-c '{"Args":["Init"]}' -P "AND ('Org1MSP.member','Org2MSP.member', 'Org3MSP.member')"
# -c '{"Args":["Init", "c", "500", "d", "100"]}' -P "OR ('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')"

sleep 3

#############
#   Invoke
#############
# --peerAddresses peer0.org2... เป็นการบอกว่าจะส่งไปขอรับรองจาก peer ใดบ้าง ตาม policy ที่กำหนดไว้

echo "============== Invoke ============="
docker exec \
	-e "CORE_PEER_LOCALMSPID=Org2MSP" \
	-e 'CORE_PEER_ADDRESS=peer0.org2.example.com:7051' \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
	cli peer chaincode invoke \
	-o orderer.example.com:7050 \
	-C $CHANNEL -n $CC_NAME -c '{"Args":["createProject","p_01","แมวจรจัด","open","0", "i8sB6Q7smBeFNcaE72Fu9W2Kd7H3", "09-08-2019:13:54:44", "15-08-2019:13:54:44", "5iTN33yflbO6uWFhpAJox6FbR5o2", "100000"]}' \
	--peerAddresses peer0.org1.example.com:7051 \
	--peerAddresses peer0.org2.example.com:7051 \
    --peerAddresses peer0.org3.example.com:7051

sleep 3

docker exec \
	-e "CORE_PEER_LOCALMSPID=Org2MSP" \
	-e 'CORE_PEER_ADDRESS=peer0.org2.example.com:7051' \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
	cli peer chaincode invoke \
	-o orderer.example.com:7050 \
	-C $CHANNEL -n $CC_NAME -c '{"Args":["createProject","p_02","ทุนการศึกษา","open", "0", "i8sB6Q7smBeFNcaE72Fu9W2Kd7H3", "09-08-2019:13:54:44", "10-10-2019:13:54:44", "user1", "50000"]}' \
	--peerAddresses peer0.org1.example.com:7051 \
	--peerAddresses peer0.org2.example.com:7051 \
    --peerAddresses peer0.org3.example.com:7051

sleep 3

echo "============== Query =============="
docker exec \
	-e "CORE_PEER_LOCALMSPID=Org1MSP" \
	-e 'CORE_PEER_ADDRESS=peer0.org1.example.com:7051' \
	-e 'CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt' \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
	cli peer chaincode query \
	-C $CHANNEL \
	-n $CC_NAME \
	-c '{"Args":["query", "p_01"]}'

docker exec \
	-e "CORE_PEER_LOCALMSPID=Org1MSP" \
	-e 'CORE_PEER_ADDRESS=peer0.org1.example.com:7051' \
	-e 'CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt' \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
	cli peer chaincode query \
	-C $CHANNEL \
	-n $CC_NAME \
	-c '{"Args":["query", "p_02"]}'
