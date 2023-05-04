import { Music } from "models";

export const PlayPause = (audio: React.RefObject<HTMLAudioElement>, playing: boolean, setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsPlaying(!playing);
  audio.current!.play();
};
export const PlayRandomSong = (songs: Music[]): Music => {
  const max = songs.length
  return songs[Math.floor(Math.random() * max!)]
}