import { Previous, Next, Play, Pause, ArrowSwapHorizontal, ArrowRotateLeft } from 'iconsax-react';
import { useRef } from 'react'
import { Center } from '@mantine/core'

interface Props {
    audioElmt: any,
    isPlaying: boolean,
    setIsPlaying: any,
    currentSong: any,
    setCurrentSong: any,
    songs: any,
    setSongs: any,

}

export const PlayerReact: React.FC<Props> = ({ audioElmt, isPlaying, setIsPlaying, currentSong, setCurrentSong, songs, setSongs }) => {

    const PlayPause = () => {
        setIsPlaying(!isPlaying)
        audioElmt.current.play()
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
        audioElmt.current.currentTime = 0
    }

    const handleNext = () => {
        if (index === songs.length - 1) {
            setCurrentSong(songs[0])
            index = 0
        } else {
            setCurrentSong(songs[index + 1])
            index = index + 1
        }
        audioElmt.current.currentTime = 0
    }


    return (
        <Center style={{ height: window.innerHeight , overflowY: 'hidden' }}>
            <section className='circle-player'>
                <div style={{ width: '70%', height: '70%' , marginTop: '150px' }}>
                    <p>2:16</p>
                    <Center>
                        <div className="seekbar" onClick={checkWidth} ref={clickRef}>
                            <div className="time" style={{ width: `${currentSong.progress}%`, display: 'block' }} />
                        </div>
                    </Center>
                    <div className='info-song'>
                        <img className='cover-player' src={currentSong.Cover} alt={currentSong.Title} />
                        <div style={{ minWidth: '30%' }}>
                            <h2 style={{ margin: 0 }}>
                                {currentSong.Title}
                            </h2>
                            <p>Stamina SPKTR 2020</p>
                        </div>
                    </div>
                    <div className="player-nav">
                        <div className='contain-button'>
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
                    </div>
                </div>
            </section>
        </Center>

    )
}


