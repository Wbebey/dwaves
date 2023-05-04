import "styles/player/PlayerShader.scss";
// import { PlayerExplorer } from "components/player";

import vertexShader from "shaders/playerVertex.glsl";
import fragmentShader from "shaders/playerFragment.glsl";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  planeSubdivisions: number;
}

export const PlayerShader: React.FC<Props> = ({
  planeSubdivisions,
  ...props
}) => {
  // 192 corresponds to the player component height
  // -> see PlayerWrapper.scss
  const subdivs = Math.max(planeSubdivisions, 4);
  const ratio = 192 / window.innerWidth;

  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame(
    (state) =>
      (materialRef.current.uniforms.uTime.value = state.clock.elapsedTime / 4.0)
  );

  return (
    <mesh {...props} ref={meshRef}>
      <planeGeometry
        args={[1.0, ratio, subdivs * Math.round(1.0 / ratio), subdivs]}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0.0 }, uIsPaused: { value: false } }}
      />
    </mesh>
  );
};
