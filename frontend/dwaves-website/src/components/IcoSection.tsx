import React, { useState, useEffect } from "react";
import { AlchemyProvider, BrowserProvider, ethers } from "ethers";

const alchemyApiKey = import.meta.env.VITE_APP_ALCHEMY_API_KEY;

import ContractICO from "../abi/ICO.json";
import ClosingTimeCounter from "./ClosingTimeCounter";
import ConnectWallet from "./ConnectWallet";
import MakeTheTransaction from "./MakeTheTransaction";
import RaisedProgress from "./RaisedProgress";
import { AnimateBulles } from "./AnimateBulles";

declare const window: Window &
  typeof globalThis & {
    ethereum: any;
  };

export const IcoSection = () => {
  const [wallet, setWallet] = useState<string>("");
  const [balance, setBalance] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [chainName, setChainName] = useState<string | undefined>();

  const [openingTime, setOpeningTime] = useState(null);
  const [closingTime, setClosingTime] = useState(null);
  const [rate, setRate] = useState<number>();
  const [remainingTokens, setRemainingTokens] = useState(null);
  const [cap, setCap] = useState(null);

  const fetchContractInfo = async () => {
    const provider = new AlchemyProvider("goerli", alchemyApiKey);
    const contract = new ethers.Contract(
      ContractICO.address,
      ContractICO.abi,
      provider
    );
    const openingTime = await contract.openingTime();
    const closingTime = await contract.closingTime();
    const rate = await contract.RATE();
    const remainingTokens = await contract.remainingTokens();
    const icoCap = await contract.cap();
    setOpeningTime(openingTime);
    setClosingTime(closingTime.toString());
    setRate(Number(rate))
    setRemainingTokens(remainingTokens.toString());
    setCap(icoCap);
  };

  useEffect(() => {
    fetchContractInfo();
  }, []);

  useEffect(() => {
    if (wallet) {
      const provider = new BrowserProvider(window.ethereum);
      provider.getBalance(wallet).then((result: any) => {
        setBalance(ethers.formatEther(result));
      });
      provider.getNetwork().then((result: any) => {
        console.log(result);
        setChainId(result.chainId);
        setChainName(result.name);
      });
    }
  }, [wallet]);

  return (
    <section className="container mx-auto flex flex-col justify-center h-auto ">
      {/*<AnimateBulles/>*/}
      <div className="w-full mt-80">
        <div className="w-full">
          <h1 className="text-9xl mb-11">ICO of Dwaves 😎</h1>
          <p className="text-justify">
            Dwaves is a revolutionary decentralized music streaming platform
            that uses web3 technology to empower artists and ensure they receive
            fair compensation for their work. By leveraging the transparency and
            security of the blockchain, Dwaves is able to provide a unique,
            decentralized platform that benefits both creators and fans. <br />
            <br /> At Dwaves, we believe that music is an art form that deserves
            to be valued and appreciated. That's why we've built a platform that
            connects artists directly with their fans, removing intermediaries
            and ensuring that artists are paid fairly for their creations. With
            Dwaves, fans can discover new music and support their favorite
            artists, while artists can focus on creating great music and
            building a loyal following. <br />
            <br />
            Our platform is built on the Ethereum blockchain, which ensures that
            all transactions are transparent and secure. We use smart contracts
            to automate payments and distribute royalties, so that artists can
            focus on what they do best - making music. <br />
            <br />
            We believe that the future of music is decentralized, and we're
            excited to be at the forefront of this movement. Join us on our
            mission to build a better music industry for everyone. Whether
            you're an artist or a fan, Dwaves has something for you !
          </p>
        </div>
        <h2 className="text-7xl mt-20">Buy Vibes Now ! 🤑</h2>
      </div>
      <div id="timer" className="w-full">
        <ClosingTimeCounter closingTime={closingTime} />
      </div>

      <ul className="steps w-full mb-14">
        <li className="step step-primary">Login with Metamask</li>
        <li className="step step-primary">Choose the number of Ethers to change</li>
        <li className="step step-primary">Confirm Transaction</li>
        <li className="step step-primary">Discover the power of Dwaves</li>
      </ul>

      <div>
        <MakeTheTransaction
          wallet={wallet}
          setWallet={setWallet}
          balance={balance}
          chainName={chainName}
          chainId={chainId}
          rate={rate}
        />
      </div>
      <div>
        <RaisedProgress />
      </div>
    </section>
  );
};
