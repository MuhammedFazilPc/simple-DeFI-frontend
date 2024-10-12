import React, { useState } from "react";
import {
  getContractBalance,
  getWalletBalance,
  depositToContract,
  withdrawFromContract,
} from "./contract";
import { ethers } from "ethers"; // ethers v6
import { use } from "framer-motion/m";

const App = () => {
  const [contractBalance, setContractBalance] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [amount, setAmount] = useState(null);
  const [withdrawalAmountInWei, setWithdrawalAmountInWei] = useState(null);
  const [depositLoader, setdepositLoader] = useState(false);
  const [withdrawalLoader, setwithdrawalLoader] = useState(false);
  const [contractBalanceLoader, setcontractBalanceLoader] = useState(false);
  const [walletBalanceLoader, setwalletBalanceLoader] = useState(false);

  const fetchContractBalance = async () => {
    
    setcontractBalanceLoader(true)
    try {
      const balance = await getContractBalance();
      setContractBalance(balance.toString());
    } catch (error) {
      console.error("Error fetching contract balance:", error);
    }
    setcontractBalanceLoader(false)
  };

  const deposit = async () => {
    
    setdepositLoader(true)
    try {
      await depositToContract(amount);
      setAmount(null);
    } catch (error) {
      console.log(error);
    }
    setdepositLoader(false);
  };

  const withdraw = async () => {
    setwithdrawalLoader(true);
    try {
      await withdrawFromContract(withdrawalAmountInWei);
      setWithdrawalAmountInWei(null);
    } catch (error) {
      console.error(error);
    }
    setwithdrawalLoader(false);
  };

  const fetchWalletBalance = async () => {
    setwalletBalanceLoader(true);
    try {
      const balance = await getWalletBalance();
      setWalletBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
    setwalletBalanceLoader(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8">Simple DeFi dApp</h1>

      {/* Get Contract Balance */}
      <button
        onClick={fetchContractBalance}
        className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded mb-4"
        disabled={contractBalanceLoader}
      >
        {contractBalanceLoader ? "Loading..." : "Get Contract Balance"}
      </button>
      {contractBalance && (
        <p className="text-lg mb-4">Contract Balance: {contractBalance} wei</p>
      )}

      {/* Get Wallet Balance */}
      <button
        onClick={fetchWalletBalance}
        className="bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded mb-4"
        disabled={walletBalanceLoader}
      >
        {walletBalanceLoader ? "Loading..." : "Get Wallet Balance"}
      </button>
      {walletBalance && (
        <p className="text-lg mb-4">Wallet Balance: {walletBalance} ETH</p>
      )}

      {/* Deposit USDT */}
      <input
        type="number"
        placeholder="Enter deposit amount in ETH"
        value={amount || ""}
        onChange={(e) => setAmount(e.target.value)}
        className="text-black px-4 py-2 rounded mb-4 w-64 text-center"
      />
      <button
        onClick={deposit}
        className="bg-yellow-600 hover:bg-yellow-800 text-white font-semibold py-2 px-4 rounded mb-4"
        disabled={depositLoader || !amount}
      >
        {depositLoader ? "Processing..." : "Deposit ETH"}
      </button>

      {/* Withdraw Wei */}
      <input
        type="number"
        placeholder="Enter withdraw amount in Wei"
        value={withdrawalAmountInWei || ""}
        onChange={(e) => setWithdrawalAmountInWei(e.target.value)}
        className="text-black px-4 py-2 rounded mb-4 w-64 text-center"
      />
      <button
        onClick={withdraw}
        className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded mb-4"
        disabled={withdrawalLoader || !withdrawalAmountInWei}
      >
        {withdrawalLoader ? "Processing..." : "Withdraw Wei"}
      </button>
    </div>
  );
};

export default App;
