import "../Styles/Explorer.scss"
import { HeartSlash, Previous, Next, Play, Pause, ArrowSwapHorizontal, ArrowRotateLeft, CloseSquare } from 'iconsax-react';

import { Sidebar } from '../Components/Sidebar'

export const Explorer = () => {
    return (
        <section style={{ color: 'black', height: window.innerHeight }}>
            <div id="contain-top-player" className="flex flex-col nowrap">
                <div className="player-bar">
                    <div id="contain-left-bar" className="flex row nowrap">
                        <img src={process.env.REACT_APP_URL + "stamina1.jpg"} alt="Dinos - Stamina" />
                        <p>Dinos - Dyptique</p>
                    </div>
                    <div id='nav-widget-player' className="flex row nowrap">
                        <ArrowSwapHorizontal />
                        <Previous />
                        <Play />
                        <Pause style={{ display: 'none' }} />
                        <Next />
                        <ArrowRotateLeft />
                    </div>
                    <div id="contain-right-bar" className="flex row nowrap">
                        <p>01:21 / 02:03</p>  <HeartSlash />  <CloseSquare />
                    </div>
                </div>
                <div>
                    <div className="seekbar" /* onClick={checkWidth} ref={clickRef} */>
                        <div className="time" /* style={{ width: `${currentSong.progress}%`, display: 'block' }} */ />
                    </div>
                </div>
            </div>
            <section className="container-app">
                <div className="contain-explorer">
                    <Sidebar />
                    <div className="content">
                        <div className="banner">
                            Banner
                        </div>
                        <div className="body">
                            Body
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}