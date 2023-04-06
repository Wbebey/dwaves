import React from "react";
import { BrowserProvider } from "ethers";

declare const window: Window &
  typeof globalThis & {
    ethereum: any;
  };

const ConnectWallet = ({
  wallet,
  setWallet,
}: {
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const onClickConnect = () => {
    //client side code
    if (!window.ethereum) {
      console.log("please install MetaMask");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);

    provider
      .send("eth_requestAccounts", [])
      .then((accounts: any) => {
        if (accounts.length > 0) setWallet(accounts[0]);
      })
      .catch((e: any) => console.log(e));
  };

  return (
    <div className="w-full flex justify-end">
      <div className="pt-20">
        {!wallet ? (
          <button
            className="btn btn-primary w-48 text-lg"
            onClick={onClickConnect}
          >
            Log in with 🦊
          </button>
        ) : (
          <p className="bg-cyan-800 rounded-lg p-2">Your address : {wallet}</p>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
