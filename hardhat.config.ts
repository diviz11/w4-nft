import { HardhatUserConfig } from 'hardhat/config';
import { config as dotenvConfig } from 'dotenv';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { HardhatNetworkUserConfig } from 'hardhat/types';

dotenvConfig(); // Load environment variables from .env file

const { API_URL, PRIVATE_KEY } = process.env as Record<string, string>;

if (!API_URL || !PRIVATE_KEY) {
  throw new Error('Please provide API_URL and PRIVATE_KEY in your .env file');
}

const config: HardhatUserConfig = {
   solidity: '0.8.6',
   defaultNetwork: 'sepolia',
   networks: {
     hardhat: {},
     sepolia: {
       url: API_URL,
       accounts: [`0x${PRIVATE_KEY}`],
     } as HardhatNetworkUserConfig, // Type assertion
   },
 };
 
 export default config;
 