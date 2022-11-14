import Web3 from "web3";
import fs from "fs";
import fetch from "node-fetch";
import path from "path";


// Get ETH from faucet
let response = await fetch('http://13.211.137.65:5000/0xc01485Ac32EF75aDfA181455E5bE421A6C593a6E');
console.log(await response.text());

// Connect to http
const web3 = new Web3(new Web3.providers.HttpProvider("http://13.211.137.65:8500/"));

web3.eth.getBalance("0xc01485Ac32EF75aDfA181455E5bE421A6C593a6E").then(res=>console.log("0xc01485Ac32EF75aDfA181455E5bE421A6C593a6E balance:",res));

const account = web3.eth.accounts.privateKeyToAccount("0xfa0c091453c9a47f0a079b7d40118c009c4e2f5d3c735d5ebd6743534adc089b");

const jsonFile = '../contracts/simple_loop/build/contracts/loop.json'
const __dirname = path.resolve(path.dirname('')); 
const parsed = JSON.parse(fs.readFileSync(path.resolve(__dirname,jsonFile)));
const abi = parsed.abi;
const contractAddress = '0x02F8eDf8aD77D4e2a679dB7D5f0fB858af42ae9c';
const contract = new web3.eth.Contract(abi,contractAddress);

const quantities=10;

let nonce = await web3.eth.getTransactionCount(account.address);

console.log("Nonce before transactions:",nonce);



let p = [];
let old_time = new Date();
for(let i=0;i<quantities;i++){
    let estimateGas = await contract.methods.summation(10).estimateGas({from:account.address})
    let data = contract.methods.summation(10).encodeABI();
    let signedTx = await web3.eth.accounts.signTransaction({
        nonce:nonce,
        to:contractAddress,
        data:data,
        value:0,
        gas:Math.ceil(estimateGas/20000)*20000
    },account.privateKey);
    p.push(web3.eth.sendSignedTransaction(signedTx.rawTransaction));
    nonce++;
}
let result = await Promise.all(p);

for(let i=0;i<result.length;i++){
    console.log(result[i].blockNumber,result[i].status,result[i].gasUsed);
}
let new_time = new Date();
console.log("Milliseconds passed:",new_time-old_time);
nonce = await web3.eth.getTransactionCount(account.address);
console.log("Nonce after transactions:",nonce);


