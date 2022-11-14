const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development:{
      network_id: 88,
      provider:()=>new HDWalletProvider("0xfa0c091453c9a47f0a079b7d40118c009c4e2f5d3c735d5ebd6743534adc089b","http://13.211.137.65:8500"),
      gas:7500000,
      from:'0xc01485Ac32EF75aDfA181455E5bE421A6C593a6E'
    },
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.10",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
};
