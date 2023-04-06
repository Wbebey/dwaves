import React from "react";

const RaisedProgress = () => {
  return (
    <>
      <div className="w-full flex items-center justify-between text-justify py-11">
        <progress
          className="progress progress-primary mr-10 w-10/12"
          // value={remainingTokens!}
          // max={cap!}
          value={70}
          max={100}
        />
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
              <p className="text-xl mb-2">Join the Movement: See Our Progress</p>
            Check out our progress bar to see how close we are to reaching our
            Vibes fundraising goal !
          </div>
        </div>
      </div>
    </>
  );
};

export default RaisedProgress;
