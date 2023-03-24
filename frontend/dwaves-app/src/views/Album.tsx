import "styles/Explorer.scss";
import { ContentAlbum } from "components";
import { AlbumDetail } from "models";

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
  audioElmt: React.RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  setArtist : React.Dispatch<React.SetStateAction<AlbumDetail|undefined>>;
}

export const Album: React.FC<Props> = ({
  setCurrentSong,
  setSongs,
  audioElmt,
  isPlaying,
  setIsPlaying,
  setArtist }) => {
  return <ContentAlbum
    setCurrentSong={setCurrentSong}
    setSongs={setSongs}
    audioElmt={audioElmt}
    isPlaying={isPlaying}
    setIsPlaying={setIsPlaying}
    setArtist={setArtist}
  />;
};
