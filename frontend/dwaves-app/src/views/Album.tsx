import "styles/Explorer.scss";
import { ContentAlbum } from "components";

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
  audioElmt: React.RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
}

export const Album: React.FC<Props> = ({
  setCurrentSong,
  setSongs,
  audioElmt,
  isPlaying,
  setIsPlaying, }) => {
  return <ContentAlbum
    setCurrentSong={setCurrentSong}
    setSongs={setSongs}
    audioElmt={audioElmt}
    isPlaying={isPlaying}
    setIsPlaying={setIsPlaying}
  />;
};
