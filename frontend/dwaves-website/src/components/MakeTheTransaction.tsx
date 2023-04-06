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
  rate: number | undefined;
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
  rate,
}: Props) => {
  const [ethersValue, setEthersValue] = useState<string>("");
  const [vibesValue, setVibesValue] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [txnHash, setTxnHash] = useState(
    "0x03b430994b92557aa2a876e92a9973d91f9fc0547d1ef0855919900c01b7b5a4"
  );

  const purchaseButtonIsDisabled =
    wallet !== "" &&
    parseFloat(ethersValue) !== 0 &&
    parseFloat(ethersValue) < parseFloat(balance!);

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
      value: ethers.parseEther(ethersValue!.toString()),
    });

    await res.wait();
    setTxnHash(
      "0x03b430994b92557aa2a876e92a9973d91f9fc0547d1ef0855919900c01b7b5a4"
    );
    setOpenModal(true);
    setTransactionInProgress(false);
    setEthersValue("");
    console.log(res);
  };

  const changeEthersValue = (value: string) => {
    setEthersValue(value)
    const result = +value*rate!
    setVibesValue(result.toString())
  }

  const changeVibesValue = (value: string) => {
    setVibesValue(value)
    const result = +value/rate!
    setEthersValue(result.toString())
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center border-2 border-cyan-800 rounded-lg w-11/12 px-28">
        <ConnectWallet wallet={wallet} setWallet={setWallet} />
        <h1 className="text-3xl mt-14 mb-16">
          Join the Vibe Revolution : Buy Tokens Today 🤯
        </h1>
        <div className="w-full flex flex-row justify-center items-center ">
          <input
            type="number"
            placeholder="The amount of Ethereum you want to exchange"
            className="input input-bordered input-primary w-full text-lg mr-5"
            disabled={wallet === ""}
            value={ethersValue}
            onChange={(e) => changeEthersValue(e.target.value)}
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
            value={vibesValue}
            onChange={(e) => changeVibesValue(e.target.value)}
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

      <input
        type="checkbox"
        checked={openModal}
        id="my-modal"
        className="modal-toggle"
        onChange={() => {
          setOpenModal(false);
        }}
      />
      <div className="modal w-full">
        <div className="modal-box flex items-center flex-col">
          <h3 className="font-bold text-2xl text-center mb-4">
            Your transaction is completed 🥳 🎉 !
          </h3>
          <img
            className="w-40"
            src={`https://media.tenor.com/0IEk-u1XpG0AAAAd/angry-dog.gif`}
            alt=""
          />

          <a
            href="https://dwaves-app-staging.tonfrere.fr/"
            target="_blank"
            className="btn btn-ghost normal-case text-xl flex flex-row items-center mt-5"
          >
            <p className="mr-4">Discover the power of </p>
            <img
              className="w-28"
              src={`./../public/logo-dwaves-white.png`}
              alt=""
            />
            <p className="ml-3">now !</p>
          </a>

          <a
            href={`https://${chainName}.etherscan.io/tx/${txnHash}`}
            target="_blank"
            className="btn btn-ghost normal-case text-xl flex flex-row items-center mt-5"
          >
            <p className="">View Transaction on Etherscan</p>
          </a>

          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              PLUS ULTRA 💥 !
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MakeTheTransaction;
