import axios from "axios";
import { Music } from "models";

export const playPause = (
  audio: React.RefObject<HTMLAudioElement>,
  playing: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (!audio.current) return
  setIsPlaying(!playing)
  audio.current!.play()
}
export const playRandomSong = (songs: Music[]): Music => {
  const max = songs.length
  return songs[Math.floor(Math.random() * max!)]
}

export const IncrementlisteningsMusic = async (currentSong : Music) => {
  await axios.post(
    `${import.meta.env.VITE_APP_BACK_URL}/musics/incrementListenings`,
    {
      "musicCID" : currentSong?.src?.split("/")[4],
      "listeningsValue": currentSong?.listenings! + 1
    },
    {
      withCredentials: true,
    }
  )
}