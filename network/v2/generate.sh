#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export FABRIC_CFG_PATH=${PWD}

# channel name
CHANNEL_NAME=donation

# remove previous crypto material and config transactions
# ลบของเก่าทิ้งแล้วสร้างไฟล์ใหม่
rm -fr config/*
# rm -fr crypto-config/*

echo "######## 1.generate crypto material"
#############################
# 1.generate crypto material
# เรียกใช้ไฟล์ cypto-config.yml
#############################
# cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

echo "######## 2.generate genesis block for orderer"
#########################################
# 2.generate genesis block for orderer
# เรียกใช้ไฟล์ configtx.yaml
# เป็นการสร้าง block แรกใน network
#########################################
configtxgen -profile ThreeOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

echo "######## generate channel configuration transaction"
##############################################
# generate channel configuration transaction
# สำหรับแต่ละ channel
##############################################
configtxgen -profile ThreeOrgChannel -outputCreateChannelTx ./config/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME    # main channel
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi


echo "######## generate anchor peer transaction"
#####################################
# generate anchor peer transaction
# ในแต่ละ channel
#####################################

# anchor peer for main channel
configtxgen -profile ThreeOrgChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors_main.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
configtxgen -profile ThreeOrgChannel -outputAnchorPeersUpdate ./config/Org2MSPanchors_main.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
configtxgen -profile ThreeOrgChannel -outputAnchorPeersUpdate ./config/Org3MSPanchors_main.tx -channelID $CHANNEL_NAME -asOrg Org3MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi
