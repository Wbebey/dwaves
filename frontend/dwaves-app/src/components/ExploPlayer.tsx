import "styles/Explorer.scss";
import { Icon } from "components/shared";

import { useEffect, useRef } from "react";

interface Props {
  audioElmt: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentSong: any;
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>;
  songs: any;
  setSongs: React.Dispatch<React.SetStateAction<any>>;
}

export const ExploPlayer: React.FC<Props> = ({
  audioElmt,
  isPlaying,
  setIsPlaying,
  currentSong,
  setCurrentSong,
  songs,
  setSongs,
}) => {
  const PlayPause = () => {
    setIsPlaying(!isPlaying);
    audioElmt.current!.play();
  };

  let index = songs.musics.findIndex(
    (x: { Title: string }) => x.Title == currentSong.Title
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
      setCurrentSong(songs.musics[songs.musics.length - 1]);
      index = songs.musics.length - 1;
    } else {
      setCurrentSong(songs.musics[index - 1]);
      index = index - 1;
    }
    audioElmt.current!.currentTime = 0;
  };

  const handleNext = () => {
    if (index === songs.musics.length - 1) {
      setCurrentSong(songs.musics[0]);
      index = 0;
    } else {
      setCurrentSong(songs.musics[index + 1]);
      index = index + 1;
    }
    audioElmt.current!.currentTime = 0;
  };

  useEffect(() => {
    console.log(songs)
  }, [songs])

  return (
    <div id="contain-top-player">
      <div className="player-bar">
        {
          songs &&
          <div id="contain-left-bar" className="flex row nowrap">
            <img src={songs.cover} alt={currentSong.name} />
            <p>{songs.artist} - {currentSong.name}</p>
          </div>
        }
        <div id="nav-widget-player" className="flex row nowrap">
          <Icon icon="random" />
          <Icon icon="previous" onClick={handlePrevious} />
          {isPlaying ? (
            <Icon icon="pause" onClick={() => PlayPause()} />
          ) : (
            <Icon icon="play" onClick={() => PlayPause()} />
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
