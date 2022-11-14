# Aglive Blockchain Configuration

Recommendation on deployment of POA blockchain for Projects.
<img src="./img/poa-network-cowbuy.png?raw=true">
<!-- ![help](/img/poa-network-cowbuy.png) -->
## Objectives
1. Deploy go-ethereum blockchain networks 

## Glossaries
1. Nodes - go-ethereum client
2. POA - proof of authority
3. Full Node - Node for user to perform transactions
4. Sealer Node - Node for block sealing
5. Faucet - Application to distribute test token to users
6. Ethstats - Nodes network statistics
7. Ethscanner - Blocks information


## Importants
1. Odd numbers of nodes should be maintained at all the times

## Minimum Machine Requirement
1. t3.medium

## Setup
Use screen commands or others terminal multiplexer so your work on remote machine will not loss due to connection drops or SSH session is terminated.
### setup Services
#### 1. Setup ethstats
##### setup-netstats.sh
```bash
#!/bin/bash

sudo apt-get update
sudo apt install -y curl nano git
sudo apt update


curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash 

export NVM_DIR="$HOME/.nvm" \
    && source $NVM_DIR/nvm.sh \
    && nvm install 8.11.1 \
    && npm i npm@6.4.1 -g \
    && npm i grunt -g


git clone https://github.com/goerli/ethstats-server

# sudo chmod -R 777 ethstats-server

cd ethstats-server \
        && npm install \
        && grunt poa


export WS_SECRET="eth-net-stats-secret"

npm start

```
#### 2. setup epirus-free
Install docker compose
```bash
sudo apt install docker-compose
```
Download epirus-free
```bash
git clone https://github.com/web3labs/epirus-free.git
```
Open docker-compose.yml inside the folder epirus-free and change the nginx ports to the ports we want
```bash
  nginx:
    image: nginx:latest
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./5xx.html:/www/error_pages/5xx.html
    ports:
      - 3000:80
    depends_on:
      - api
      - web
    networks:
      - epirus
```
Run docker-compose with NODE_ENDPOINT to the **Full Node**. If you not yet run your **Full Node**, run this steps after you run your **Full Node**.
```bash
sudo NODE_ENDPOINT=http://13.211.137.65:8500 docker-compose up
```

### Run Sealer Node
#### 1. Setup EC2
##### setup-ec2.sh
```bash
#!/bin/bash

sudo apt-get update
sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum
sudo apt update
sudo apt install -y curl nano git
```
#### 2. Create Sealer's Account
Create a folder for chain data and keystore
```bash
mkdir aglive
````
Create a sealer's keystore. Follow the instruction on screen. Save the password in a file call **password.txt**
```bash
geth account new --datadir aglive
```

#### 3. Create Funded Account
Create an account which will be funded. This account will hold the tokens for the whole project. Sealer account expected to gain token from transaction's gas, that need to be transfer to this account in the future.
```bash
geth account new --datadir aglive
```
#### 4. Create Genesis File
Start the process by using command **puppeth**. Use **CTRL-D** to escape any time.
```bash
puppeth
```
Example of input
```bash
-----------------------------------------------------------+
| Welcome to puppeth, your Ethereum private network manager |
|                                                           |
| This tool lets you create a new Ethereum network down to  |
| the genesis block, bootnodes, miners and ethstats servers |
| without the hassle that it would normally entail.         |
|                                                           |
| Puppeth uses SSH to dial in to remote servers, and builds |
| its network components out of Docker containers using the |
| docker-compose toolset.                                   |
+-----------------------------------------------------------+

Please specify a network name to administer (no spaces, hyphens or capital letters please)
> aglive

Sweet, you can set this via --network=aglive next time!

INFO [05-05|09:21:10.631] Administering Ethereum network           name=aglive
INFO [05-05|09:21:10.639] No remote machines to gather stats from 

What would you like to do? (default = stats)
 1. Show network stats
 2. Configure new genesis
 3. Track new remote server
 4. Deploy network components
> 2

What would you like to do? (default = create)
 1. Create new genesis from scratch
 2. Import already existing genesis
> 1

Which consensus engine to use? (default = clique)
 1. Ethash - proof-of-work
 2. Clique - proof-of-authority
> 2

How many seconds should blocks take? (default = 15)
> 2

Which accounts are allowed to seal? (mandatory at least one)
> 0x0981d20d34a0fc96e73ffa783d0c560156142d90
> 0x

Which accounts should be pre-funded? (advisable at least one)
> 0x0981d20d34a0fc96e73ffa783d0c560156142d90
> 0x

Should the precompile-addresses (0x1 .. 0xff) be pre-funded with 1 wei? (advisable yes)
> no

Specify your chain/network ID if you want an explicit one (default = random)
> 88
INFO [05-05|09:22:11.103] Configured new genesis block 

What would you like to do? (default = stats)
 1. Show network stats
 2. Manage existing genesis
 3. Track new remote server
 4. Deploy network components
> 2

 1. Modify existing configurations
 2. Export genesis configurations
 3. Remove genesis configuration
> 2

Which folder to save the genesis specs into? (default = current)
  Will create aglive.json, aglive-aleth.json, aglive-harmony.json, aglive-parity.json
> 
INFO [05-05|09:22:23.046] Saved native genesis chain spec          path=aglive.json
ERROR[05-05|09:22:23.048] Failed to create Aleth chain spec        err="unsupported consensus engine"
ERROR[05-05|09:22:23.048] Failed to create Parity chain spec       err="unsupported consensus engine"
INFO [05-05|09:22:23.048] Saved genesis chain spec                 client=harmony path=aglive-harmony.json

What would you like to do? (default = stats)
 1. Show network stats
 2. Manage existing genesis
 3. Track new remote server
 4. Deploy network components
> CRIT [05-05|09:22:40.600] Failed to read user input                err=EOF
```
If successful, two new files created in the current folder, **aglive.json** and **aglive-harmony.json**.
#### 5. Modify Genesis File
Open Genesis File and modify as below. Remove **Sealer account** from **alloc**, and add balance for **Funded account**.
```bash
# Original Files
{
  "config": {
    "chainId": 88,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "clique": {
      "period": 2,
      "epoch": 30000
    }
  },
  "nonce": "0x0",
  "timestamp": "0x6273268e",
  "extraData": "0x00000000000000000000000000000000000000000000000000000000000000000981d20d34a0fc96e73ffa783d0c560156142d900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x47b760",
  "difficulty": "0x1",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {
    "fD456676e6893f6a01FD1FD55e8c5161F25B32C0":{
      "balance": "0x200000000000000000000000000000000000000000000000000000000000000",
    }

  },
  "number": "0x0",
  "gasUsed": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "baseFeePerGas": null
}
```

#### 6. Start Sealer

##### start-sealer.sh
T he second and third lines can be uncomments during the first time running this script. If you restart from a stopped nodes, please comment the second and third lines.
```bash
#!/bin/bash
#rm -rf aglive/geth/
#geth --datadir aglive init aglive.json
geth --datadir aglive \
                --nousb \
                --networkid 88 \
                --syncmode full \
                --ethstats eth-testnet-standard-$(curl ifconfig.me):eth-net-stats-secret@3.26.199.199:3000 \
                --unlock 0981d20d34a0fc96e73ffa783d0c560156142d90 \
                --password password.txt \
                --port 30303 \
                --mine \
                --miner.gasprice 1 \
                --miner.gastarget 30000000 \
                --miner.gaslimit 30000000 \
                --miner.etherbase 0981d20d34a0fc96e73ffa783d0c560156142d90 \
                --nodiscover \
                --allow-insecure-unlock

```

### Full node
Full node is the node where the transaction happen.
#### 1. Setup EC2
##### setup-ec2.sh
```bash
#!/bin/bash

sudo apt-get update
sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum
sudo apt update
sudo apt install -y curl nano git

```
create a folder
```bash
mkdir aglive
```
#### 2. Create aglive.json
Copy the genesis file from sealer 1 (**aglive.json**)
#### 3. Copy Funded Account Keystore file from sealer 1
Copy the keystore file for funded account and save it into folder aglive

#### 4. Start 
```bash
#!/bin/bash
#rm -rf aglive/geth/
#geth --datadir aglive init aglive.json
geth --datadir aglive \
        --nousb \
        --networkid 88 \
        --syncmode full \
        --ethstats eth-testnet-standard-$(curl ifconfig.me):eth-net-stats-secret@3.26.199.199:3000 \
        --rpc.allow-unprotected-txs \
        --http \
        --http.addr 0.0.0.0 \
        --http.port 8500 \
        --http.api 'eth,web3,net,txpool' \
        --http.corsdomain '*' \
        --http.vhosts '*' \
        --ws \
        --ws.addr 0.0.0.0 \
        --ws.port 8600 \
        --ws.api 'eth,web3,net,txpool' \
        --ws.origins '*' \
        --port 30303 \
        --nodiscover

```

#### 4. Add Peer
```bash
INFO [05-05|04:54:28.196] Started P2P networking                   self="enode://2dd2890619666447a6494d30df0e5e3a247216bdbf70d9da1b87e9783d15f9ccf747311fb6a7c3d77a983bc18cad60e72c682688d390eeec727338793186582e@127.0.0.1:30303?discport=0"
INFO [05-05|04:54:28.196] HTTP server started                      endpoint=[::]:8500 auth=false prefix= cors=* vhosts=*
INFO [05-05|04:54:28.197] WebSocket enabled                        url=ws://[::]:8600
INFO [05-05|04:54:28.197] Stats daemon started
INFO [05-05|05:54:28.180] Writing clean trie cache to disk         path=/home/ubuntu/aglive/geth/triecache threads=1
INFO [05-05|05:54:28.180] Regenerated local transaction journal    transactions=0 accounts=0
INFO [05-05|05:54:28.201] Persisted the clean trie cache           path=/home/ubuntu/aglive/geth/triecache elapsed=20.698ms

```
Modify to enode as below
```bash
enode://2dd2890619666447a6494d30df0e5e3a247216bdbf70d9da1b87e9783d15f9ccf747311fb6a7c3d77a983bc18cad60e72c682688d390eeec727338793186582e@52.62.203.251:30303
```
Go back to Sealer 1, attached to Sealer 1
```bash
geth attach aglive/geth.ipc
admin.addPeer("enode://2dd2890619666447a6494d30df0e5e3a247216bdbf70d9da1b87e9783d15f9ccf747311fb6a7c3d77a983bc18cad60e72c682688d390eeec727338793186582e@52.62.203.251:30303")
```
#### 6. Setup faucet
Download this folder **eth-private-faucet** into the **Full Node** machine

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh
source ~/.bashrc
nvm install v14.15.1
```

```bash
cd eth-private-faucet
npm install
npm start
```
#### 5. Return blockchain explorerer and start the docker-compose


## Static Node
Geth supports a feature called static nodes if you have certain peers you always want to connect to. Static nodes are re-connected on disconnects. You can configure permanent static nodes by putting something like the following into **<datadir>/geth/static-nodes.json**:
```json
[
  "enode://f4642fa65af50cfdea8fa7414a5def7bb7991478b768e296f5e4a54e8b995de102e0ceae2e826f293c481b5325f89be6d207b003382e18a8ecba66fbaf6416c0@33.4.2.1:30303",
  "enode://pubkey@ip:port"
]
```

```json
[
  "enode://d84d5d22f4bde1749a70a5a55d3c2aa6596373f6be47fff352aa5dddce2756175a0a04d0702ee0bcddda51e4ce4c78c148fc1217ed70131003dce6be428b815c@3.26.197.16:30303",
  "enode://1d7140f1bdbbcd2a4896410e27c2c8330b4b176ad466eab6a3ef839b99422f3905b8f5283a04d6aa185edca00ecb74a534aaeba8195900cd1974f48b543372d4@54.206.250.17:30303",
  "enode://04f62605f84ef818c8ba1ce7f2cd1908384364e8f2f389c9338d97f7439f7571033a5656fc69da2cd234f0567e9cdbd87ebe0fab52355f7c6def8fd012a857e5@13.211.4.73:30303",
  "enode://a7ba42ba740cf9902fa66f9f1ec47c20d03488ea44b01f314bb32cfc6ff9c082dcc23380872d0cca1d87d0261f50b3413ef3ea8a5f2a13bf7b9b5e2ea25887e1@3.25.139.140:30303",
  "enode://a3ac5b8ec9092741858d50b694fdd148f8c04a588d62dcc3b5173180666edf90ee1cd507683530406c02bbe529b766329d4b796563030ef2e8a11af8815bdda1@3.26.255.61:30303",
  "enode://06c92ee984874098a96db3bc5036cf0453f6501058eb69b147a2aa3a4ab5243e24120f8629204e06e87272ff8d8ff0dcdc9c5afc4c0bc1916f78d54ffd2b5072@13.55.210.220:30303",
  "enode://e2e99e771347f751bc5bf8379e073ea67b1ecc4d3714d9f0bf03bdcb3776dc75c16e5cd7e4012f0ac831d9162d18d1cdf5eff6210e81200db29321cfd9f02914@13.211.177.237:30303",
  "enode://d5f01d7391fef64ba53986c60612c655d134b64b94fa171bcbdd98e46ca4f77f16bcb40353b3b6491d8ffce2b3446f592d31d9679864b42cc3539a5db8a33968@3.104.117.123:30303",
  "enode://8115760d39cd15ab48983cc8ced0cb0a9e9372be11e8f2b74e239f916ed735c859d859bba2e77d455db3c12372b080423220d547307c3e86f731edb295b7b140@3.26.30.245:30303",
  "enode://93a36d9541a664f1de3fa5742f2f88bf41ae07904bb5cad4b1b83701721fc8dc9ad9dc340bf375d89ee8f4d5e0c3abe08e051298a77075ca7d1a4b0e020e883f@54.206.89.205:30303"
]
```
Get enode after **geth init**
```bash
geth_enode=$(bootnode -nodekeyhex $(cat aglive/geth/nodekey) -writeaddress)
echo "enode://${geth_enode}@$(curl ifconfig.me):30303"
```

retrieve base name
```bash
basename aglive/keystore/* | awk -F'[-.]' '{print $10}'
```

### Add Peer


### Setup block explorer
### Propose new sealer

## Deadlock
Deadlock happen when

### Rewind of Deadlock
https://github.com/IDChain-eth/IDChain/blob/release/1.9/deadlock_resolver.py
Below steps are according to step given above. All these step need to be perform to every sealer nodes in the networks
1. log into each machine of each sealer
2. attach to the node rpc on the machine itself
```bash
geth attach aglive/geth.ipc
```
3. Stop the sealer
```bash
miner.stop()
```
4. Set the new head. This number have to be in hexadecimal. Calculate the new head using formula
target = latest block number - (total sealer)//2 + 1
```bash
debug.setHead("0x123")
```
5. Restart sealer
```bash
miner.start()
```
6. The nodes should be running again.

