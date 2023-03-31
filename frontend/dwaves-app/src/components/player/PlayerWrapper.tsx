import 'styles/player/PlayerWrapper.scss'

import { PlayerShader } from 'components/player'
import { Icon } from 'components/shared'

import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'

interface Props {
  audioElmt: React.RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  currentSong: any
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  songs: any
  setSongs: React.Dispatch<React.SetStateAction<any>>
  // Shader properties
  planeSubdivisions: number
}

export const PlayerWrapper: React.FC<Props> = ({
  audioElmt,
  isPlaying,
  setIsPlaying,
  currentSong,
  setCurrentSong,
  songs,
  setSongs,
  // Shader properties
  planeSubdivisions,
}) => {
  const clickRef = useRef<HTMLDivElement>(null)

  let playerStatus: 'playing' | 'paused' | 'inactive' = 'inactive'
  useEffect(() => {
    if (!currentSong) playerStatus = 'inactive'
    else playerStatus = isPlaying ? 'playing' : 'paused'
  }, [currentSong, isPlaying])

  let songIndex = songs?.musics.findIndex(
    (x: { Title: string }) => x.Title == currentSong.Title,
  )

  const togglePlayPlause = () => {
    setIsPlaying(!isPlaying)
    audioElmt.current!.play()
  }

  const updateProgressWidth = (e: any) => {
    if (!currentSong) return

    const width: number = clickRef.current?.clientWidth as number
    const offset = e.nativeEvent.offsetX

    const divprogress = (offset / width) * 100
    audioElmt.current!.currentTime = (divprogress / 100) * currentSong.length
  }

  const switchToPrevious = () => {
    if (songIndex === 0) {
      setCurrentSong(songs.musics[songs.musics.length - 1])
      songIndex = songs.musics.length - 1
    } else {
      setCurrentSong(songs.musics[songIndex - 1])
      songIndex = songIndex - 1
    }
    audioElmt.current!.currentTime = 0
  }

  const switchToNext = () => {
    if (songIndex === songs.musics.length - 1) {
      setCurrentSong(songs.musics[0])
      songIndex = 0
    } else {
      setCurrentSong(songs.musics[songIndex + 1])
      songIndex = songIndex + 1
    }
    audioElmt.current!.currentTime = 0
  }

  return (
    <div className="player-explorer-wrapper">
      {/* Because we love magic numbers */}
      <Canvas camera={{ position: [0.0, 0.0, 0.1], zoom: 1.3825 }}>
        <PlayerShader
          planeSubdivisions={planeSubdivisions}
          playerStatus={playerStatus}
        />
        <ambientLight intensity={1.0} />
      </Canvas>
      <div className="player-explorer-content">
        <div className="player-bar">
          <div className="widget-left">
            {songs && (
              <div className="flex row nowrap">
                <img src={songs.cover} alt={currentSong.name} />
                <p>
                  {songs.artist} - {currentSong.name}
                </p>
              </div>
            )}
          </div>

          <div className="widget-player">
            <Icon icon="random" />
            <Icon icon="previous" onClick={switchToPrevious} />
            {isPlaying ? (
              <Icon icon="pause" onClick={() => togglePlayPlause()} />
            ) : (
              <Icon icon="play" onClick={() => togglePlayPlause()} />
            )}
            <Icon icon="next" onClick={switchToNext} />
            <Icon icon="loop" />
          </div>
          <div className="widget-right">
            {songs && (
              <div className="flex row nowrap">
                <p>01:21 / 02:03</p>
                <Icon icon="dislike" />
                <Icon icon="close" />
              </div>
            )}
          </div>
        </div>
        <div>
          <div
            className="player-seekbar"
            onClick={updateProgressWidth}
            ref={clickRef}
          >
            <div
              className="time"
              style={{
                width: `${currentSong?.progress ?? 0}%`,
                display: 'block',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}