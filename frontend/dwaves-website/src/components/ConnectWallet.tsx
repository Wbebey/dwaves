import React from "react";

const ConnectWallet = ({
  wallet,
  requestConnection,
}: {
  wallet: string;
  requestConnection: any;
}) => {
  return (
    <div className="card w-1/2 bg-base-100 shadow-xl mx-7">
      <div className="card-body">
        <h2 className="card-title text-3xl">Log in first 🦊!</h2>
        <p>
          Connecting your Metamask wallet is necessary to buy VIBES tokens as it
          allows for a secure and seamless transaction on the Ethereum
          blockchain
        </p>
        <div className="card-actions justify-end pt-3">
          {!wallet ? (
            <button
              onClick={requestConnection}
              className="btn btn-primary w-64 btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            >
              Log in with 🦊
            </button>
          ) : (
            <p>You are connected with this address : {wallet}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
