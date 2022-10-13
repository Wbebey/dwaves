import "../Styles/Player.scss"
import logoDeep from '../Images/logo-deep.png'
import {AnimateBulles} from "../Components/AnimationBulles"
import {NavPlayerReact} from "../Components/NavPlayerReact";
import { useEffect, useRef, useState } from "react";

import datasong from '../Musics/datasongs.json'

export const Player = () => {

    const [songs, setSongs]= useState(datasong)
    const [isPlaying , setIsPlaying] = useState(false)
    const [currentSong, setCurrentSong]= useState(datasong[0])

    const audioElmt= useRef<HTMLAudioElement>(null) ?? someOtherData()

    useEffect(() => {
        
        if (isPlaying) {
            audioElmt.current?.play()
        }
        else {
            audioElmt.current?.pause()
        }
    },[isPlaying])

    const onPlaying = () => {

        const duration: number = audioElmt.current?.duration as number
        const ct: number = audioElmt.current?.currentTime as number

        setCurrentSong({...currentSong, "progress": ct / duration * 100 , "length": duration })

    }

    const clickRef= useRef<HTMLDivElement>(null)

    const checkWidth = (e: any) => {
        let _width:number = clickRef.current?.clientWidth as number;
        const offset = e.nativeEvent.offsetX 

        const divprogress = offset / _width * 100
        audioElmt.current!.currentTime = divprogress / 100 * currentSong.length
    }

    const backTenSecondBefore = () => {
        audioElmt.current!.currentTime = audioElmt.current!.currentTime - 10
    }

    const goTenSecondLater = () => {
        audioElmt.current!.currentTime = audioElmt.current!.currentTime + 10
    }

    return (
        <section className="contain-player-bg" >
            <img className="logo-player" src={logoDeep} alt="" />
            <div className="blur-effect">
                <div className="contain-cover">
                    <img src={currentSong.Cover} alt="stamina" style={{ width: "100%" }} />
                    <div className="seekbar" onClick={checkWidth} ref={clickRef}>
                        <div className="time" style={{width: `${currentSong.progress}%` , display: 'block'}} />
                    </div>
                </div>
                <audio src={currentSong.Src} ref={audioElmt} onTimeUpdate={onPlaying}/>
                <NavPlayerReact 
                    audioElmt={audioElmt}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    currentSong={currentSong}
                    setCurrentSong={setCurrentSong}
                    songs={songs}
                    setSongs={setSongs}
                    goTenSecondLater={goTenSecondLater}
                    backTenSecondBefore={backTenSecondBefore}
                />
                <AnimateBulles />
            </div>
            
        </section>
    )
}

function someOtherData(): import("react").RefObject<HTMLAudioElement> {
    throw new Error("Function not implemented.");
}
