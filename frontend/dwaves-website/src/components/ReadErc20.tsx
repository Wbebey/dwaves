import React, { useEffect, useState } from "react";
import {BrowserProvider, ethers, TransactionReceipt, TransactionResponse} from "ethers";
import ContractICO from "../abi/ICO.json";

declare let window: any;

const ReadErc20 = ({ currentAccount }: any) => {
  const [remainingTokens, setRemainingTokens] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  const fetchRemainingTokens = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      ContractICO.address,
      ContractICO.abi,
      provider
    );

    const remainingTokens = await contract.remainingTokens();
    setRemainingTokens(remainingTokens);
  };

  useEffect(() => {
    fetchRemainingTokens();
  }, []);

  async function transfer() {
    if(!window.ethereum) return
    const provider = new BrowserProvider(window.ethereum)
    console.log(provider.getBlockNumber())
    const signer = await provider.getSigner()
    // console.log(signer)
    const erc20 = new ethers.Contract(ContractICO.address, ContractICO.abi, signer)


    const res = await erc20.buyTokens(currentAccount, { value: ethers.parseEther('0.1') });
    
    await res.wait();

    console.log(res)
  }

    // erc20
    //   .buyTokens({currentAccount, value: ethers.parseEther("100")})
    //   .then((tr: TransactionResponse) => {
    //     console.log(`TransactionResponse TX hash: ${tr.hash}`);
    //     // @ts-ignore
    //     tr.wait().then((receipt: TransactionReceipt) => {
    //       console.log("transfer receipt", receipt);
    //     });
    //   })
    //   .catch((e: Error) => console.log(e));
  return (
    <div>
      <p>
        <b>ERC20 Contract</b>: {currentAccount}
      </p>
      <p>
        <b>ERC20 RemainingTokens</b>: {remainingTokens.toString()}
      </p>
      <button onClick={transfer}>CLICK TO TRANSFER</button>
    </div>
  );
};

export default ReadErc20;
