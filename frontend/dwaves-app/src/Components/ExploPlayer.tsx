import "../Styles/Explorer.scss"
import { ArrowSwapHorizontal, Previous, Play, Pause, Next, ArrowRotateLeft, HeartSlash, CloseSquare } from "iconsax-react"
import { useRef } from "react"

interface Props {
    audioElmt: React.RefObject<HTMLAudioElement>,
    isPlaying: boolean,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    currentSong: any,
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>,
    songs: any,
    setSongs: React.Dispatch<React.SetStateAction<any>>,
}

export const ExploPlayer: React.FC<Props> = ({ audioElmt, isPlaying, setIsPlaying, currentSong, setCurrentSong, songs, setSongs }) => {

    const PlayPause = () => {
        setIsPlaying(!isPlaying)
        audioElmt.current!.play()
    }

    let index = songs.findIndex((x: { Title: string }) => x.Title == currentSong.Title)

    const clickRef = useRef<HTMLDivElement>(null)

    const checkWidth = (e: any) => {
        let _width: number = clickRef.current?.clientWidth as number;
        const offset = e.nativeEvent.offsetX

        const divprogress = offset / _width * 100
        audioElmt.current!.currentTime = divprogress / 100 * currentSong.length
    }

    const handlePrevious = () => {
        if (index === 0) {
            setCurrentSong(songs[songs.length - 1])
            index = songs.length - 1
        } else {
            setCurrentSong(songs[index - 1])
            index = index - 1
        }
        audioElmt.current!.currentTime = 0
    }

    const handleNext = () => {
        if (index === songs.length - 1) {
            setCurrentSong(songs[0])
            index = 0
        } else {
            setCurrentSong(songs[index + 1])
            index = index + 1
        }
        audioElmt.current!.currentTime = 0
    }

    return (
        <div id="contain-top-player">
            <div className="player-bar">
                <div id="contain-left-bar" className="flex row nowrap">
                    <img src={currentSong.Cover} alt={currentSong.Title} />
                    <p>Dinos - {currentSong.Title}</p>
                </div>
                <div id='nav-widget-player' className="flex row nowrap">
                    <ArrowSwapHorizontal />
                    <Previous onClick={handlePrevious} />
                    {isPlaying ?
                        <Pause onClick={() => PlayPause()} />
                        :
                        <Play onClick={() => PlayPause()} />
                    }
                    <Next onClick={handleNext} />
                    <ArrowRotateLeft />
                </div>
                <div id="contain-right-bar" className="flex row nowrap">
                    <p>01:21 / 02:03</p>
                    <HeartSlash />
                    <CloseSquare />
                </div>
            </div>
            <div>
                <div className="seekbar" onClick={checkWidth} ref={clickRef}>
                    <div className="time" style={{ width: `${currentSong.progress}%`, display: 'block' }} />
                </div>
            </div>
        </div>
    )
}