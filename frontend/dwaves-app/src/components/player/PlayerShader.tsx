import vertexShader from 'shaders/playerVertex.glsl'
import fragmentShader from 'shaders/playerFragment.glsl'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  planeSubdivisions: number
  playerStatus: 'playing' | 'paused' | 'inactive'
}

const AMPLITUDES = {
  playing: 0.006,
  paused: 0.002,
  inactive: 0.0,
}

export const PlayerShader: React.FC<Props> = ({
  planeSubdivisions,
  playerStatus,
}) => {
  // 192 corresponds to the player component height
  // -> see PlayerWrapper.scss
  const subdivs = Math.max(planeSubdivisions, 4)
  const ratio = 192 / window.innerWidth

  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uAmplitude: { value: AMPLITUDES[playerStatus] },
    }),
    [],
  )

  useFrame((state) => {
    let amplitude = AMPLITUDES[playerStatus]
    amplitude = THREE.MathUtils.lerp(
      meshRef.current.material.uniforms.uAmplitude.value,
      amplitude,
      0.05,
    )

    // Please, please, please ignore the TS warning here
    meshRef.current.material.uniforms.uTime.value =
      state.clock.elapsedTime / 4.0
    meshRef.current.material.uniforms.uAmplitude.value =
      amplitude
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry
        args={[1.0, ratio, subdivs * Math.round(1.0 / ratio), subdivs]}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
