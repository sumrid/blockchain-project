<h1 align="center">Donate-web</h1>
<h3 align="center">เว็บไซต์การบริจาคเงินและการตรวจสอบความโปร่งใสด้วยเทคโนโลยีบล็อคเชน</h3>

[![CircleCI](https://circleci.com/gh/sumrid/project.svg?style=svg&circle-token=cbaffc65d87b8510aa96e562e98809d08ff981f7)](https://circleci.com/gh/sumrid/project)

## สิ่งที่ต้องติดตั้งบนเครื่อง
* Docker and Docker-compose
* nodejs and npm

## ขั้นตอนการเริ่มระบบครั้งแรก
```
# 1. Install dependencies
make install

# 2. Start blockchain network
./start-network.sh

# 3. Regis user to system
make register

# Start api and web
docker-compose up
```