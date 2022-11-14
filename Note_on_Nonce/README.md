# Nonce Management
## Important Notes
1. Transaction nonce is managed by the sender.
2. Transactions from the same sender will be mined in nonce order.
3. Transactions with too low a nonce get immediately rejected.
4. Transactions with too high a nonce get placed in the transaction pool queue.
5. If a transaction isn't mined, transactions with a higher nonce cannot be mined.
6. If transactions with nonces that fill the gap between the last valid nonce and the too high nonce are sent and the nonce sequence is complete, all the transactions in the sequence will get processed and mined.
7. The transaction pool queue will only hold a maximum of 64 transactions with the same From: address with nonces out of sequence.
8. It is possible to rapidly submit transactions but it demands precision at the transaction level. Things can go wrong, such as:

    * GasPrice too low
    * Transaction lost (no reason)
9. Transaction cancellation
    * Send zero ether to itself specifying with the nonce of the transaction to cancel and a gasPrice higher than the transaction to cancel. 
    * Use the same data and nonce as the missing transaction and a higher gasPrice.
10. It is advisable to wait for several confirmations as you would for any other transaction.
 
## References
https://ethereum.stackexchange.com/questions/2808/what-happens-when-a-transaction-nonce-is-too-high/2809
https://ethereum.stackexchange.com/questions/23611/how-to-send-a-lot-of-transactions-to-ethereum-using-js
https://ethereum.stackexchange.com/questions/39790/concurrency-patterns-for-account-nonce
