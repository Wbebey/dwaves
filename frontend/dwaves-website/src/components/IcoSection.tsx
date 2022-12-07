export const IcoSection = () => {
    return (
        <section className="container mx-auto flex flex-col justify-center h-auto ">
            <div className="w-full mt-80 lg:w-3/4">
                <div className="w-full">
                    <h1 className="text-9xl">
                        Tokens sale
                    </h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit
                        esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </div>
            </div>
            <div id="timer" className="w-full p-8 lg:w-3/4">
                <div className="grid grid-flow-col gap-5 text-center auto-cols-max mx-auto">
                    <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                        <span className="countdown font-mono text-9xl">
                            <span>14</span>
                        </span>
                        days
                    </div>
                    <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                        <span className="countdown font-mono text-9xl">
                            <span>14</span>
                        </span>
                        hours
                    </div>
                    <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                        <span className="countdown font-mono text-9xl">
                            <span>14</span>
                        </span>
                        min
                    </div>
                    <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                        <span className="countdown font-mono text-9xl">
                            <span>14</span>
                        </span>
                        sec
                    </div>
                </div>
                <div className=" flex flex-row nowrap p-8 justify-between ">
                    <button className="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg">Buy token</button>
                    <p className="w-4/5">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla officiis atque expedita similique alias quod! Vitae repudiandae autem beatae velit optio repellendus, consectetur unde delectus aspernatur blanditiis eos! Error, commodi.
                    </p>
                </div>
            </div>
            <div className="flex flex-row nowrap items-center">
                <div className="w-1/5">
                    <p className="text-xl">Lorem ipsum <span className="uppercase font-bold">1 eth = 1341 usd </span></p>
                    <p className="text-xl">Lorem ipsum <span className="uppercase font-bold"> 13 416 usd </span></p>
                </div>
                <div className="w-4/5">
                    <h1 className="text-5xl">Raised</h1>
                    <progress className="progress progress-primary w-full" value="50" max="100" />
                </div>
            </div>
            <div className="w-full mt-8">
                <div className="mt-8 none grid sm:grid-rows-1 lg:grid-cols-4">
                    <div id="side-left" className="block lg:col-span-2">
                        <div className="w-full ms:h-[500px] mm:h-[600px] ml:h-[700px] md:h-[800px] md:w-96 relative block md:mx-auto">
                            <img className="w-full h-full absolute z-20 top-0" src={`${import.meta.env.VITE_APP_URL}/iphone.png`} alt="" />
                            <div className="absolute bg-primary z-10 w-[calc(100%-20px)] h-[calc(100%-15px)] left-[10px] top-[5px] rounded-[12%]">
                                <img className="w-full h-full rounded-[10%] md:rounded-[50px]" src="http://via.placeholder.com/420x852" alt="" />
                            </div>
                        </div>
                    </div>
                    <div id="side-right" className="lg:flex lg:justify-center lg:col-span-2 ">
                        <div className="md:card-rounded w-full my-auto md:px-4 z-30">
                            <div className="md:card w-full bg-white-100 shadow-xl">
                                <div className="md:card-body">
                                    <h2 className="card-title mt-8 sm:mt-0 text-4xl">What do we do </h2>
                                    <p className="text-justify mt-8 sm:mt-0 text-xl ">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
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
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore
                                    magna aliqua. Tortor posuere ac ut consequat semper
                                    viverra. Faucibus scelerisque eleifend donec pretium.
                                    Nunc sed blandit libero volutpat sed.
                                </p>
                                <p className="self-end">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore
                                    magna aliqua. Tortor posuere ac ut consequat semper
                                    viverra. Faucibus scelerisque eleifend donec pretium.
                                    Nunc sed blandit libero volutpat sed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="side-right" className="lg:flex lg:justify-center lg:col-span-2 ">
                    <img src={`${import.meta.env.VITE_APP_URL}/env-dwaves.png`} alt="" className="w-1/2" />

                </div>
            </div>
        </section>
    )
}