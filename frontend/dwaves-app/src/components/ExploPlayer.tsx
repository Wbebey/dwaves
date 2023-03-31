import "styles/Explorer.scss";
import { Icon } from "components/shared";
import styles from "styles/global/styles.module.scss";

import React, {useEffect, useRef, useState} from "react";
import { PlayPause, PlayRandomSong } from "songs/listenMusic";
import { AlbumDetail, Music } from "models";
import axios from "axios";

interface Props {
  audioElmt: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentSong: Music;
  setCurrentSong: React.Dispatch<React.SetStateAction<Music | undefined>>;
  songs: any;
  setSongs: React.Dispatch<React.SetStateAction<Music[] | undefined>>;
  artist: AlbumDetail | undefined
  setRepeat: React.Dispatch<React.SetStateAction<boolean>>;
  repeat: boolean;
  setRandom: React.Dispatch<React.SetStateAction<boolean>>;
  random: boolean;
  PlayRandomSong: (songs: Music[]) => Music;
  likedMusics: string[];
  likeOrDislikeMusic: (music: string)=> void
}

export const ExploPlayer: React.FC<Props> = ({
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
  PlayRandomSong,
  likedMusics,
  likeOrDislikeMusic
}) => {

  const foundCidMusic = (musicUrl: string) => {
    const musicCIDArray = musicUrl.split("/")
    return musicCIDArray[musicCIDArray.length - 1]
  }

  const isLikedMusics = (music: string) => {
    const musicCID = foundCidMusic(music)
    return likedMusics.includes(musicCID);
  }

  let index = songs.findIndex(
    (x: { name: string }) => x.name == currentSong.name
  );

  const clickRef = useRef<HTMLDivElement>(null);

  const checkWidth = (e: any) => {
    let _width: number = clickRef.current?.clientWidth as number;
    const offset = e.nativeEvent.offsetX;

    const divprogress = (offset / _width) * 100;
    audioElmt.current!.currentTime = (divprogress / 100) * currentSong.length;
  };

  const handlePrevious = () => {
    if (index === 0) {
      setCurrentSong(songs[songs.length - 1]);
      index = songs.length - 1;
    } else {
      setCurrentSong(songs[index - 1]);
      index = index - 1;
    }
    audioElmt.current!.currentTime = 0;
    setTimeout(() => {
      PlayPause(audioElmt, false, setIsPlaying)
    }, 1000)
  };

  const handleNext = () => {
    if (random) {
      setCurrentSong(PlayRandomSong(songs));
    } else {
      if (index === songs.length - 1) {
        setCurrentSong(songs[0]);
        index = 0;
      } else {
        setCurrentSong(songs[index + 1]);
        index = index + 1;
      }
    }
    audioElmt.current!.currentTime = 0;
    setTimeout(() => {
      PlayPause(audioElmt, false, setIsPlaying)
    }, 1000)
  };

  return (
    <div id="contain-top-player">
      <div className="player-bar">
        {
          artist &&
          <div id="contain-left-bar" className="flex row nowrap">
            <img src={artist.cover} alt={currentSong.name} />
            <p>{artist.artist} - {currentSong.name}</p>
          </div>
        }
        <div id="nav-widget-player" className="flex row nowrap">
          <Icon
            icon="random"
            color={random ? `blue` : '#191a24'}
            onClick={() => {
              setRandom(!random)
            }}
          />
          <Icon icon="previous" onClick={handlePrevious} />
          {isPlaying ? (
            <Icon icon="pause" onClick={() => PlayPause(audioElmt, isPlaying, setIsPlaying)} />
          ) : (
            <Icon icon="play" onClick={() => PlayPause(audioElmt, isPlaying, setIsPlaying)} />
          )}
          <Icon icon="next" onClick={handleNext} />
          <Icon
            icon="loop"
            color={repeat ? `blue` : '#191a24'}
            onClick={() => {
              setRepeat(!repeat)
            }} />
        </div>
        {
          songs &&
          <div id="contain-right-bar" className="flex row nowrap items-center">
            <p>01:21 / 02:03</p>
            <button onClick={() => likeOrDislikeMusic(currentSong.src!)}>
              <Icon icon="like" color={isLikedMusics(currentSong.src!) ? "red" : "black"}
                    variant={isLikedMusics(currentSong.src!) ? "Bold" : "Linear"}/>
            </button>
            <div>
                <Icon icon="close" />
            </div>
          </div>
        }
      </div>
      <div>
        {
          songs &&
          <div className="seekbar" onClick={checkWidth} ref={clickRef}>
            <div
              className="time"
              style={{ width: `${currentSong.progress}%`, display: "block" }}
            />
          </div>
        }
      </div>
    </div>
  );
};
