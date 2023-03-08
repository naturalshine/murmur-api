/**
* @type import('hardhat/config').HardhatUserConfig
*/
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
  defaultNetwork: "polygonmumbai",
  networks: {
    hardhat: {
    },
    polygonmumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/" + process.env.ALCHEMY_API,
      accounts: [process.env.DEPLOY_KEY]
   },
   polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API,
      accounts: [process.env.DEPLOY_KEY]
   }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
}


 