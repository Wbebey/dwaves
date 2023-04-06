import vertexShader from 'shaders/playerVertex.glsl'
import fragmentShader from 'shaders/playerFragment.glsl'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  planeSubdivisions: number
  playerStatus: 'playing' | 'paused' | 'inactive'
}

export const PlayerShader: React.FC<Props> = ({
  planeSubdivisions,
  playerStatus,
}) => {
  const AMPLITUDES = {
    playing: 0.012,
    paused: 0.007,
    inactive: 0.0,
  }
  // 192 corresponds to the player component height
  // -> see PlayerWrapper.scss
  const subdivs = Math.max(planeSubdivisions, 20)
  const ratio = 185 / window.innerWidth

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
      // @ts-ignore
      meshRef.current.material.uniforms.uAmplitude.value,
      amplitude,
      0.05,
    )
    
    // @ts-ignore
    meshRef.current.material.uniforms.uTime.value =
      state.clock.elapsedTime / 4.0
    // @ts-ignore
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
