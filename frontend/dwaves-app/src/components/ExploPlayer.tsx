import "styles/Explorer.scss";
import { Icon } from "components/shared";

import { useRef } from "react";
import { PlayPause } from "songs/listenMusic";
import { AlbumDetail, Music } from "models";

interface Props {
  audioElmt: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentSong: Music;
  setCurrentSong: React.Dispatch<React.SetStateAction<Music|undefined>>;
  songs: any;
  setSongs: React.Dispatch<React.SetStateAction<Music[]|undefined>>;
  artist : AlbumDetail|undefined
}

export const ExploPlayer: React.FC<Props> = ({
  audioElmt,
  isPlaying,
  setIsPlaying,
  currentSong,
  setCurrentSong,
  songs,
  setSongs,
  artist
}) => {

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
    setTimeout(()=>{
      PlayPause(audioElmt, false, setIsPlaying)
    }, 1000)
  };

  const handleNext = () => {
    if (index === songs.length - 1) {
      setCurrentSong(songs[0]);
      index = 0;
    } else {
      console.log(songs[index + 1], index);
      setCurrentSong(songs[index + 1]);
      index = index + 1;
    }
    audioElmt.current!.currentTime = 0;
    setTimeout(()=>{
      PlayPause(audioElmt, false, setIsPlaying)
    },1000)
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
          <Icon icon="random" />
          <Icon icon="previous" onClick={handlePrevious} />
          {isPlaying ? (
            <Icon icon="pause" onClick={() => PlayPause(audioElmt , isPlaying, setIsPlaying)} />
          ) : (
            <Icon icon="play" onClick={() => PlayPause(audioElmt , isPlaying, setIsPlaying)} />
          )}
          <Icon icon="next" onClick={handleNext} />
          <Icon icon="loop" />
        </div>
        {
          songs &&
          <div id="contain-right-bar" className="flex row nowrap">
            <p>01:21 / 02:03</p>
            <Icon icon="dislike" />
            <Icon icon="close" />
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
