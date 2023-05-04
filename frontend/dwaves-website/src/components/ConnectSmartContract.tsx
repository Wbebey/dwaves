import { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import ReadErc20 from "./ReadErc20";


declare let window: any;

const ConnectSmartContract = () => {
  const [balance, setBalance] = useState<string | undefined>();
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [chainName, setChainName] = useState<string | undefined>();


  useEffect(() => {
    if (!currentAccount || !ethers.isAddress(currentAccount)) return;
    //client side code
    if (!window.ethereum) return;
    const provider = new BrowserProvider(window.ethereum);
    provider.getBalance(currentAccount).then((result: any) => {
      setBalance(ethers.formatEther(result));
    });
    provider.getNetwork().then((result: any) => {
      setChainId(result.chainId);
      setChainName(result.name);
    });
  }, [currentAccount]);

  const onClickConnect = () => {
    //client side code
    if (!window.ethereum) {
      console.log("please install MetaMask");
      return;
    }
    /*
                //change from window.ethereum.enable() which is deprecated
                //see docs: https://docs.metamask.io/guide/ethereum-provider.html#legacy-methods
                window.ethereum.request({ method: 'eth_requestAccounts' })
                .then((accounts:any)=>{
                  if(accounts.length>0) setCurrentAccount(accounts[0])
                })
                .catch('error',console.error)
                */

    //we can do it using ethers.js
    const provider = new BrowserProvider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    provider
      .send("eth_requestAccounts", [])
      .then((accounts: any) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
      })
      .catch((e: any) => console.log(e));
  };

  const onClickDisconnect = () => {
    console.log("onClickDisConnect");
    setBalance(undefined);
    setCurrentAccount(undefined);
  };

  return (
    <div className="pt-10">
      <div>Hello World</div>
      {currentAccount ? (
        <button onClick={onClickDisconnect}>Account:{currentAccount}</button>
      ) : (
        <button onClick={onClickConnect}>Connect MetaMask</button>
      )}
      {currentAccount
          ?<div>
            <p>Account info</p>
            <p>ETH Balance of current account: {balance}</p>
            <p>Chain Info: ChainId {chainId} name {chainName}</p>
          </div>
          :<></>
      }

      <div>
        <ReadErc20 currentAccount={currentAccount} />
      </div>

    </div>
  );
};

export default ConnectSmartContract;
