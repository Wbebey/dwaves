import "styles/Explorer.scss";
import { ContentAlbum } from "components";

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
}

export const Album:React.FC<Props> = ({setCurrentSong, setSongs}) => {
  return <ContentAlbum setCurrentSong={setCurrentSong} setSongs={setSongs} />;
};
