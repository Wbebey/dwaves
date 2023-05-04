import React, { useState, useEffect } from "react";
import { AlchemyProvider, ethers } from "ethers";

import ContractICO from "../abi/ICO.json";
import ClosingTimeCounter from "./ClosingTimeCounter";
import ConnectWallet from "./ConnectWallet";

declare const window: Window &
  typeof globalThis & {
    ethereum: any;
  };

export const IcoSection = () => {
  const alchemyApiKey = import.meta.env.VITE_APP_ALCHEMY_API_KEY;

  const [wallet, setWallet] = useState<string>("");
  const [closingTime, setClosingTime] = useState(null);
  const [remainingTokens, setRemainingTokens] = useState(null);

  const fetchOpeningTime = async () => {
    const provider = new AlchemyProvider("goerli", alchemyApiKey);
    const contract = new ethers.Contract(
      ContractICO.address,
      ContractICO.abi,
      provider
    );
    //const openingTime = await contract.openingTime();
    //console.log(openingTime)
    const closingTime = await contract.closingTime();
    const remainingTokens = await contract.remainingTokens();
    const icoCap = await contract.cap();
    console.log(icoCap);
    console.log(remainingTokens);
    setClosingTime(closingTime.toString());
    setRemainingTokens(remainingTokens.toString());
  };

  useEffect(() => {
    fetchOpeningTime();
  }, []);

  const requestConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(accounts);
    }
  };

  const buyTokens = async () => {
    try {
      const provider = new AlchemyProvider("goerli", alchemyApiKey);


      // Signer
      // const signer = new ethers.Wallet(alchemyApiKey, provider)


      const contract = new ethers.Contract(
        ContractICO.address,
        ContractICO.abi,
        provider
      );
      // console.log(provider.getBalance(wallet))

      console.log(wallet, {value: ethers.parseEther('100')})

      const res = await contract.buyTokens(wallet, {value: ethers.parseEther('100')});
      await res.wait();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="container mx-auto flex flex-col justify-center h-auto ">
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
        <h2 className="text-7xl mt-20">BUY VIBES NOW !</h2>
      </div>
      <div id="timer" className="w-full">
        <ClosingTimeCounter closingTime={closingTime} />
        <div className="w-full flex flex-row justify-around">
          <ConnectWallet
            wallet={wallet}
            requestConnection={requestConnection}
          />
          <div className="card w-1/2 bg-base-100 shadow-xl mx-7">
            <div className="card-body">
              <h2 className="card-title text-3xl">Buy VIBES 🤑!</h2>
              <p>
                Now is the time to invest in the future of music and support
                this innovative platform by purchasing VIBE tokens during the
                ICO
              </p>
              <div className="card-actions justify-end pt-3">
                <button
                  onClick={buyTokens}
                  className="btn btn-primary w-64 btn-xs sm:btn-sm md:btn-md lg:btn-lg"
                >
                  buy !!!!
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-row nowrap p-8 justify-between ">
          <button className="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg">
            Buy token
          </button>
        </div>
      </div>
      <div className="flex flex-row nowrap items-center">
        <div className="w-1/5">
          <p className="text-xl">
            Lorem ipsum{" "}
            <span className="uppercase font-bold">1 eth = 1341 usd </span>
          </p>
          <p className="text-xl">
            Lorem ipsum{" "}
            <span className="uppercase font-bold"> 13 416 usd </span>
          </p>
        </div>
        <div className="w-4/5">
          <h1 className="text-5xl">Raised</h1>
          <progress
            className="progress progress-primary w-full"
            value="50"
            max="100"
          />
        </div>
      </div>
      <div className="w-full mt-8">
        <div className="mt-8 none grid sm:grid-rows-1 lg:grid-cols-4">
          <div id="side-left" className="block lg:col-span-2">
            <div className="w-full ms:h-[500px] mm:h-[600px] ml:h-[700px] md:h-[800px] md:w-96 relative block md:mx-auto">
              <img
                className="w-full h-full absolute z-20 top-0"
                src={`./../../public/iphone.png`}
                alt=""
              />
              <div className="absolute bg-primary z-10 w-[calc(100%-20px)] h-[calc(100%-15px)] left-[10px] top-[5px] rounded-[12%]">
                <img
                  className="w-full h-full rounded-[10%] md:rounded-[50px]"
                  src="http://via.placeholder.com/420x852"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div
            id="side-right"
            className="lg:flex lg:justify-center lg:col-span-2 "
          >
            <div className="md:card-rounded w-full my-auto md:px-4 z-30">
              <div className="md:card w-full bg-white-100 shadow-xl">
                <div className="md:card-body">
                  <h2 className="card-title mt-8 sm:mt-0 text-4xl">
                    What do we do{" "}
                  </h2>
                  <p className="text-justify mt-8 sm:mt-0 text-xl ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 none grid sm:grid-rows-1 lg:grid-cols-4 p-4">
        <div id="side-left" className="block lg:col-span-2">
          <h2 className="text-5xl text-center">How to participate</h2>
          <div className="flex flex-row justify-between nowrap h-full">
            <ul className="steps steps-vertical">
              <li className="step step-primary">Register</li>
              <li className="step ">Choose plan</li>
            </ul>
            <div className="w-4/5 my-auto h-4/5 ">
              <div className="grid grid-rows-2 h-full">
                <p className="self-start">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Tortor posuere ac ut consequat semper viverra. Faucibus
                  scelerisque eleifend donec pretium. Nunc sed blandit libero
                  volutpat sed.
                </p>
                <p className="self-end">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Tortor posuere ac ut consequat semper viverra. Faucibus
                  scelerisque eleifend donec pretium. Nunc sed blandit libero
                  volutpat sed.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="side-right"
          className="lg:flex lg:justify-center lg:col-span-2 "
        >
          <img src={`./../../public/env-dwaves.png`} alt="" className="w-1/2" />
        </div>
      </div>
    </section>
  );
};
