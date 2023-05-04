import React, { useEffect, useState } from "react";

const ClosingTimeCounter = ({ closingTime }: any) => {
  const [closingTimeCounterValue, setClosingTimeCounterValue] = useState({
    days: 0,
    hours: 0,
    minutes: "00",
    seconds: "00",
  });

  const updateTimeCounterValue = (diffInSeconds: number) => {
    const days = Math.floor(diffInSeconds / (24 * 60 * 60));
    const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
    const seconds = diffInSeconds % 60;

    setClosingTimeCounterValue({
      days,
      hours,
      minutes: minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 }),
      seconds: seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 }),
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date(Number(closingTime) * 1000);
      const now = new Date();
      const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
      if (diffInSeconds < 0) {
        clearInterval(intervalId);
        setClosingTimeCounterValue({
          days: 0,
          hours: 0,
          minutes: "00",
          seconds: "00",
        });
      } else {
        updateTimeCounterValue(diffInSeconds);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [closingTime]);

  return (
    <div className="w-full flex items-center justify-between text-justify py-11">
      <div className="card bg-base-100 shadow-2xl">
        <p className="card-body">
          If you want to invest in the future of music and support the
          development of decentralized music streaming platforms, now is the
          time to buy VIBES. The ICO will end at the closing time displayed on
          this page, so make sure to buy your VIBES before then!
        </p>
      </div>
      <div className="grid grid-flow-col gap-5 pl-8 text-center auto-cols-max mx-auto">
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-9xl">
            {closingTimeCounterValue.days}
          </span>
          days
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-9xl">
            {closingTimeCounterValue.hours}
          </span>
          hours
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-9xl">
            {closingTimeCounterValue.minutes}
          </span>
          min
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-9xl">
            {closingTimeCounterValue.seconds}
          </span>
          sec
        </div>
      </div>
    </div>
  );
};

export default ClosingTimeCounter;
