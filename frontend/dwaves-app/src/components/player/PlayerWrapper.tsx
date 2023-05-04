import "styles/player/PlayerWrapper.scss";

import { PlayerShader, PlayerExplorer } from "components/player";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  audioElmt: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentSong: any;
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>;
  songs: any;
  setSongs: React.Dispatch<React.SetStateAction<any>>;
  // Shader properties
  planeSubdivisions: number;
}

export const PlayerWrapper: React.FC<Props> = ({
  audioElmt,
  isPlaying,
  setIsPlaying,
  currentSong,
  setCurrentSong,
  songs,
  setSongs,
  // Shader properties
  planeSubdivisions,
}) => {
  return (
    <div className="player-explorer-wrapper">
      {/* Because we love magic numbers */}
      <Canvas camera={{position: [0.0, 0.0, 0.1], zoom: 1.3825}}>
        <PlayerShader planeSubdivisions={planeSubdivisions}/>
        <ambientLight intensity={1.0} />
      </Canvas>
    </div>
  );
};
