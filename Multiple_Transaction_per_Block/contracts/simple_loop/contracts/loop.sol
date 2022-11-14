// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.6.0;
contract loop {
    mapping(uint256=>uint256) sums;
    uint256 private counter;
    event sumEvent(
        uint256 counter,
        uint256 sum
    );
    function summation(uint256 len)public{
        
        uint i=1;
        uint sum=0;
        for(i=1;i<len;i++){
            sum+=i;
        }
        sums[counter]=sum;
        emit sumEvent(counter,sum);
        counter++;
    }
}

