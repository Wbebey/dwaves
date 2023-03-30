import "styles/Explorer.scss";
import { ContentAlbum } from "components";
import {AlbumDetail, responseRequest} from "models";
import React from "react";

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
  audioElmt: React.RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  setArtist : React.Dispatch<React.SetStateAction<AlbumDetail|undefined>>
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Album: React.FC<Props> = ({
  setCurrentSong,
  setSongs,
  audioElmt,
  isPlaying,
  setIsPlaying,
  setArtist,
  setAlert
}) => {
  return <ContentAlbum
    setCurrentSong={setCurrentSong}
    setSongs={setSongs}
    audioElmt={audioElmt}
    isPlaying={isPlaying}
    setIsPlaying={setIsPlaying}
    setArtist={setArtist}
    setAlert={setAlert}

  />;
};
