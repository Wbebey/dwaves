import 'styles/player/PlayerWrapper.scss'

import { PlayerShader } from 'components/player'
import { Icon } from 'components/shared'
import { AlbumDetail, Music } from 'models'
import { playPause } from 'songs/listenMusic'

import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

interface Props {
  audioElmt: React.RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  currentSong: Music | undefined
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
  const [playerStatus, setPlayerStatus] = useState<
    'playing' | 'paused' | 'inactive'
  >('inactive')
  const clickRef = useRef<HTMLDivElement>(null)

  const foundCidMusic = (musicUrl: string) => {
    const musicCIDArray = musicUrl.split('/')
    return musicCIDArray[musicCIDArray.length - 1]
  }

  const isLikedMusics = (music: string) => {
    const musicCID = foundCidMusic(music)
    return likedMusics.includes(musicCID)
  }

  let songIndex = songs?.findIndex(
    (x: { name: string }) => x.name == currentSong?.name,
  )

  const calculationProgressTime = (currentTime: number) => {
    const minutes = currentTime ? Math.floor(currentTime / 60) : 0
    const seconds = currentTime ? Math.floor(currentTime % 60) : 0
    return `${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`
  }

  useEffect(() => {
    if (!currentSong) setPlayerStatus('inactive')
    else setPlayerStatus(isPlaying ? 'playing' : 'paused')
  }, [currentSong, isPlaying])

  const updateProgressWidth = (e: any) => {
    if (!currentSong || !audioElmt.current) return

    const width: number = clickRef.current?.clientWidth as number
    const offset = e.nativeEvent.offsetX

    const divprogress = (offset / width) * width
    audioElmt.current.currentTime =
      (divprogress / width) * (currentSong.length ?? 0)
  }

  const switchToPrevious = () => {
    if (!songs) return

    if (songIndex === 0) {
      setCurrentSong(songs[songs.length - 1])
      songIndex = songs.length - 1
    } else {
      setCurrentSong(songs[songIndex - 1])
      songIndex = songIndex - 1
    }
    audioElmt.current!.currentTime = 0

    setTimeout(() => {
      playPause(audioElmt, false, setIsPlaying)
    }, 1000)
  }

  const switchToNext = () => {
    if (!songs) return

    if (songIndex === songs.length - 1) {
      setCurrentSong(songs[0])
      songIndex = 0
    } else {
      setCurrentSong(songs[songIndex + 1])
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
      <Canvas
        orthographic
      >
        <PlayerShader
          planeSubdivisions={planeSubdivisions}
          playerStatus={playerStatus}
        />
        <ambientLight intensity={1.0} />
      </Canvas>
      <div className="player-explorer-content ds-text-body-l">
        <div className="player-bar">
          <div className="widget-left">
            {artist && (
              <div className="widget-left-content">
                <img src={currentSong?.albumCover ? currentSong.albumCover : artist.cover} alt={currentSong!.name} />
                <p>
                  {artist?.artist} - {currentSong?.name}
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
              <div className="widget-right-content">
                <p>
                  {calculationProgressTime(currentSong!.currentTime)} /{' '}
                  {currentSong?.duration}
                </p>
                <button onClick={() => likeOrDislikeMusic(currentSong?.src!)}>
                  <Icon
                    icon="like"
                    color={isLikedMusics(currentSong?.src!) ? 'red' : 'black'}
                    variant={
                      isLikedMusics(currentSong?.src!) ? 'Bold' : 'Linear'
                    }
                  />
                </button>
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
