import { Music } from 'models'

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
