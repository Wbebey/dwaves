import 'styles/player/PlayerShader.scss'
// import { PlayerExplorer } from "components/player";

import vertexShader from 'shaders/playerVertex.glsl'
import fragmentShader from 'shaders/playerFragment.glsl'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  planeSubdivisions: number
  playerStatus: 'active' | 'paused' | 'inactive'
}

const AMPLITUDES = {
  active: 0.005,
  paused: 0.0005,
  inactive: 0.0,
}

export const PlayerShader: React.FC<Props> = ({
  planeSubdivisions,
  playerStatus,
  ...props
}) => {
  // 192 corresponds to the player component height
  // -> see PlayerWrapper.scss
  const subdivs = Math.max(planeSubdivisions, 4)
  const ratio = 192 / window.innerWidth
  let amplitude = 0.005

  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state) => {
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime / 4.0
    materialRef.current.uniforms.uAmplitude.value = AMPLITUDES[playerStatus]
  })

  return (
    <mesh {...props} ref={meshRef}>
      <planeGeometry
        args={[1.0, ratio, subdivs * Math.round(1.0 / ratio), subdivs]}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0.0 }, uAmplitude: { value: 0.0 } }}
      />
    </mesh>
  )
}
