import { BrowserProvider, Contract ,parseEther} from "ethers"; // ethers v6
import SimpleDeFiArtifact from "./artifacts/contracts/Lock.sol/SimpleDeFi.json";

const { REACT_APP_CONTRACT_ADDRESS } = process.env;

export const getProviderAndSigner = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) {
    throw new Error("No MetaMask accounts found");
  }

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  
  return { provider, signer };
};

export const getContract = async () => {
  const { signer } = await getProviderAndSigner();
  const contract = new Contract(REACT_APP_CONTRACT_ADDRESS, SimpleDeFiArtifact.abi, signer);
  return contract;
};

// Fetch balance by calling the 'checkBalance' function from the contract
export const getContractBalance = async () => {
  console.log("in contract balance")
  const contract = await getContract();
  console.log(`contract is ${contract}`)
  const balance = await contract.checkBalance();  // Call checkBalance
  return balance;
};

// Fetch the wallet (ETH) balance
export const getWalletBalance = async () => {
  const { provider, signer } = await getProviderAndSigner();
  const address = await signer.getAddress();
  const balance = await provider.getBalance(address);
  return balance;
};

// Deposit ETH into the contract
export const depositToContract = async (amountInEther) => {
  const contract = await getContract();
  const tx = await contract.deposit({ value: parseEther(amountInEther) }); // Convert to wei
  await tx.wait();
  return tx;
};

// Withdraw ETH from the contract
export const withdrawFromContract = async (amountInWei) => {
  const contract = await getContract();
  const tx = await contract.withdraw(amountInWei); // Convert to wei
  await tx.wait();
  return tx;
};