import "styles/player/PlayerShader.scss";
// import { PlayerExplorer } from "components/player";

const vertexShader = require("shaders/playerVertex.glsl");
const fragmentShader = require("shaders/playerFragment.glsl");

import * as THREE from "three";
// import glsl from "glslify"; // ! remove module

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

export const PlayerShader: React.FC<Props> = ({
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
  const scene = new THREE.Scene();

  // 192 corresponds to the player component height
  // -> see PlayerShader.scss
  const subdivs = Math.max(planeSubdivisions, 2);
  const ratio = 192 / window.innerWidth;
  const plane = new THREE.PlaneGeometry(
    1.0,
    ratio,
    subdivs * Math.round(1.0 / ratio),
    subdivs
  );
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
    },
    wireframe: true,
  });

  const mesh = new THREE.Mesh(plane, material);
  scene.add(mesh);

  return (
    <div className="player-explorer-wrapper">
      {/* <PlayerExplorer
        audioElmt={audioElmt}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        songs={songs}
        setSongs={setSongs}
      /> */}
    </div>
  );
};
