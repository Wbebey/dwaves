export const PlayPause = ( audio: React.RefObject<HTMLAudioElement> , playing:boolean , setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsPlaying(!playing);
    audio.current!.play();
  };
