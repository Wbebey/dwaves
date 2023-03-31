import 'styles/player/PlayerWrapper.scss'

import { PlayerShader } from 'components/player'
import { Icon } from 'components/shared'
import { AlbumDetail, Music } from 'models'
import { playPause } from 'songs/listenMusic'

import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'

interface Props {
  audioElmt: React.RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  currentSong: Music
  setCurrentSong: React.Dispatch<React.SetStateAction<Music | undefined>>
  songs: any
  setSongs: React.Dispatch<React.SetStateAction<Music[] | undefined>>
  artist: AlbumDetail | undefined
  setRepeat: React.Dispatch<React.SetStateAction<boolean>>
  repeat: boolean
  setRandom: React.Dispatch<React.SetStateAction<boolean>>
  random: boolean
  playRandomSong: (songs: Music[]) => Music
  likedMusics: string[]
  likeOrDislikeMusic: (music: string) => void
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
  artist,
  setRepeat,
  repeat,
  setRandom,
  random,
  playRandomSong,
  likedMusics,
  likeOrDislikeMusic,
  // Shader properties
  planeSubdivisions,
}) => {
  const clickRef = useRef<HTMLDivElement>(null)

  const foundCidMusic = (musicUrl: string) => {
    const musicCIDArray = musicUrl.split('/')
    return musicCIDArray[musicCIDArray.length - 1]
  }

  const isLikedMusics = (music: string) => {
    const musicCID = foundCidMusic(music)
    return likedMusics.includes(musicCID)
  }

  let songIndex = songs?.musics.findIndex(
    (x: { name: string }) => x.name == currentSong.name,
  )
  let playerStatus: 'playing' | 'paused' | 'inactive' = 'inactive'

  useEffect(() => {
    if (!currentSong) playerStatus = 'inactive'
    else playerStatus = isPlaying ? 'playing' : 'paused'
  }, [currentSong, isPlaying])

  const updateProgressWidth = (e: any) => {
    if (!currentSong) return

    const width: number = clickRef.current?.clientWidth as number
    const offset = e.nativeEvent.offsetX

    const divprogress = (offset / width) * 100
    audioElmt.current!.currentTime = (divprogress / 100) * currentSong.length
  }

  const switchToPrevious = () => {
    if (!songs) return

    if (songIndex === 0) {
      setCurrentSong(songs.musics[songs.musics.length - 1])
      songIndex = songs.musics.length - 1
    } else {
      setCurrentSong(songs.musics[songIndex - 1])
      songIndex = songIndex - 1
    }
    audioElmt.current!.currentTime = 0

    setTimeout(() => {
      playPause(audioElmt, false, setIsPlaying)
    }, 1000)
  }

  const switchToNext = () => {
    if (!songs) return

    if (songIndex === songs.musics.length - 1) {
      setCurrentSong(songs.musics[0])
      songIndex = 0
    } else {
      setCurrentSong(songs.musics[songIndex + 1])
      songIndex = songIndex + 1
    }
    audioElmt.current!.currentTime = 0

    setTimeout(() => {
      playPause(audioElmt, false, setIsPlaying)
    }, 1000)
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
            {artist && (
              <div className="flex row nowrap">
                <img src={artist.cover} alt={currentSong.name} />
                <p>
                  {artist.artist} - {currentSong.name}
                </p>
              </div>
            )}
          </div>

          <div className="widget-player">
            <Icon
              icon="random"
              color={random ? `blue` : '#191a24'}
              onClick={() => {
                setRandom(!random)
              }}
            />
            <Icon icon="previous" onClick={switchToPrevious} />
            {isPlaying ? (
              <Icon
                icon="pause"
                onClick={() => playPause(audioElmt, isPlaying, setIsPlaying)}
              />
            ) : (
              <Icon
                icon="play"
                onClick={() => playPause(audioElmt, isPlaying, setIsPlaying)}
              />
            )}
            <Icon icon="next" onClick={switchToNext} />
            <Icon
              icon="loop"
              color={repeat ? `blue` : '#191a24'}
              onClick={() => {
                setRepeat(!repeat)
              }}
            />
          </div>

          <div className="widget-right">
            {songs && (
              <div className="flex row nowrap">
                <p>01:21 / 02:03</p>
                <button
                  className="pb-6"
                  onClick={() => likeOrDislikeMusic(currentSong.src!)}
                >
                  <Icon
                    icon="like"
                    color={isLikedMusics(currentSong.src!) ? 'red' : 'black'}
                    variant={
                      isLikedMusics(currentSong.src!) ? 'Bold' : 'Linear'
                    }
                  />
                </button>
                <div className="pt-1.5 pr-5">
                  <Icon icon="close" />
                </div>
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
