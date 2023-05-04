import React, { useState } from "react";
import ConnectWallet from "./ConnectWallet";
import { BrowserProvider, ethers } from "ethers";
import ContractICO from "../abi/ICO.json";

type Props = {
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
  balance: string | undefined;
  chainName: string | undefined;
  chainId: number | undefined;
};

declare const window: Window &
  typeof globalThis & {
    ethereum: any;
  };

const MakeTheTransaction = ({
  wallet,
  setWallet,
  balance,
  chainName,
  chainId,
}: Props) => {
  const [inputValue, setInputValue] = useState("");

  const [transactionInProgress, setTransactionInProgress] = useState(false);

  const purchaseButtonIsDisabled = wallet !== "" && inputValue !== "";

  const transfer = async () => {
    if (!window.ethereum) return;
    setTransactionInProgress(true);
    const provider = new BrowserProvider(window.ethereum);
    console.log(provider.getBlockNumber());
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(
      ContractICO.address,
      ContractICO.abi,
      signer
    );

    const res = await erc20.buyTokens(wallet, {
      value: ethers.parseEther(inputValue),
    });

    await res.wait();
    setTransactionInProgress(false);
    setInputValue("")
    console.log(res);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center border-2 border-cyan-800 rounded-lg w-11/12 px-28">
        <ConnectWallet wallet={wallet} setWallet={setWallet} />
        <h1 className="text-3xl mt-20 mb-14">
          Join the Vibe Revolution : Buy Tokens Today 🤯
        </h1>
        <div className="w-full flex flex-row justify-center items-center ">
          <input
            type="number"
            placeholder="The amount of Ethereum you want to exchange"
            className="input input-bordered input-primary w-full text-lg mr-5"
            disabled={wallet === ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p className="bg-cyan-800 p-3 rounded-lg w-48 text-center">
            ETHEREUM
          </p>
        </div>
        {balance && (
          <div className="items-start w-full">
            <p className="pt-4">Your balance : {balance}</p>
            <p className="pt-1">
              Current chain : {chainName} - {chainId?.toString()}
            </p>
          </div>
        )}

        <div className="w-full flex flex-row justify-center items-center mt-10">
          <input
            type="number"
            placeholder="The value in VIBES"
            className="input input-primary w-full text-lg mr-5"
            disabled={wallet === ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p className="bg-cyan-800 p-3 rounded-lg w-48 text-center">VIBES</p>
        </div>
        {transactionInProgress ? (
          <div className="w-72 bg-primary/[.06] flex justify-center py-5 rounded-2xl my-14">
            <progress className="progress progress-primary w-9/12"></progress>
          </div>
        ) : (
          <button
            className="btn btn-primary w-72 text-lg my-14"
            disabled={!purchaseButtonIsDisabled}
            onClick={transfer}
          >
            Get Your Vibes Here 🚀
          </button>
        )}
      </div>
    </div>
  );
};
export default MakeTheTransaction;
