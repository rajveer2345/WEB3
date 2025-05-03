import abi from './Lottery.json';
import abiusdt from './USDT.json';

// Define types for ABI if needed
interface ABI {
  abi: any; // You can replace 'any' with a more specific type if you have the ABI type definitions
}


type Address = `0x${string}`;
// Type-cast imports
const lotteryAbi = abi as ABI;
const usdtAbi = abiusdt as ABI;

export const LOTTERY_CONTRACT_ADDRESS: Address = "0x8F565e563B73784B8e63642baC0279d280782494";
export const USDT_CONTRACT_ADDRESS: Address = "0xFF53FA9388Cd7A68AB6867C9fEC1301c07AcDDD3";

export const LOTTERY_ABI = lotteryAbi.abi;
export const USDT_ABI = usdtAbi.abi;
