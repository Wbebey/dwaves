import "styles/Player.scss";
import { AnimateBulles, PlayerReact } from "components";

import { useEffect, useRef, useState } from "react";

import datasong from "songs/datasongs";
import logoDeep from "images/logo-deep.png";

export const Player = () => {
  // TODO : removed the fake data
  const [songs, setSongs] = useState(datasong);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(datasong.musics[0]);

  const audioElmt = useRef<HTMLAudioElement>(null) ?? someOtherData();

  useEffect(() => {
    if (isPlaying) {
      audioElmt.current?.play();
    } else {
      audioElmt.current?.pause();
    }
  }, [audioElmt, isPlaying]);

  const onPlaying = () => {
    const duration: number = audioElmt.current?.duration as number;
    const ct: number = audioElmt.current?.currentTime as number;

    setCurrentSong({
      ...currentSong,
      progress: (ct / duration) * 100,
      length: duration,
    });
  };

  return (
    <section
      className="contain-player-bg"
      style={{
        width: "100vw",
        height: window.innerHeight,
        overflowY: "hidden",
      }}
    >
      <img className="logo-player" src={logoDeep} alt="" />
      <div className="blur-effect">
        <audio src={currentSong.src} ref={audioElmt} onTimeUpdate={onPlaying} />
        <PlayerReact
          audioElmt={audioElmt}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          songs={songs}
          setSongs={setSongs}
        />
        <AnimateBulles />
      </div>
    </section>
  );
};

function someOtherData(): import("react").RefObject<HTMLAudioElement> {
  throw new Error("Function not implemented.");
}
