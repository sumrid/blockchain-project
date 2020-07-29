<h1 align="center">Donate-web</h1>

[![CircleCI](https://circleci.com/gh/sumrid/blockchain-project.svg?style=svg&circle-token=cbaffc65d87b8510aa96e562e98809d08ff981f7)](https://circleci.com/gh/sumrid/blockchain-project)
![Imgur](https://i.imgur.com/RzjoAKa.png)

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