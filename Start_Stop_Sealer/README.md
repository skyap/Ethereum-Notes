# Start Stop Sealer
## Objective
Stop sealer when there are no transactions
## javascript console
### Observation using javascript console
1. Stopping one miner will not stop mining work of other sealers. It do not have have effect on overall network. Others sealers will continue sealing blocks.
2. Code loaded into geth console will be remove after geth console closed.
3.
### Code
#### Seal only when there are transactions
```js
function checkWork() {
    if (eth.getBlock("pending").transactions.length > 0 || eth.pendingTransactions.length > 0) {
        if (eth.mining) return;
        console.log("== Pending transactions! Mining...");
        miner.start(1);
    } else {
        miner.stop();  // This param means nothing
        console.log("== No transactions! Mining stopped.");
    }
}

eth.filter("latest", function(err, block) { checkWork(); });
eth.filter("pending", function(err, block) { checkWork(); });
checkWork();

```
#### Mining until 12 confirmations have been achieved
```js
function checkWork() {
    if (eth.getBlock("pending").transactions.length > 0 || eth.pendingTransactions.length > 0) {
        txBlock = eth.getBlock("pending").number
        if (eth.mining) return;
        console.log("  Transactions pending. Mining...");
        miner.start(mining_threads)
        while (eth.getBlock("latest").number < txBlock + 12) {
            if (eth.getBlock("pending").transactions.length > 0 || eth.pendingTransactions.length > 0) txBlock = eth.getBlock("pending").number;
        }
        console.log("  12 confirmations achieved; mining stopped.");
        miner.stop()
    }
    else {
        miner.stop()
        }
}

eth.filter("latest", function(err, block) { checkWork(); });
eth.filter("pending", function(err, block) { checkWork(); });
checkWork();
```
## References
https://ethereum.stackexchange.com/questions/3151/how-to-make-miner-to-mine-only-when-there-are-pending-transactions
