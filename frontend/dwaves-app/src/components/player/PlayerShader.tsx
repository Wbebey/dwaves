import vertexShader from 'shaders/playerVertex.glsl'
import fragmentShader from 'shaders/playerFragment.glsl'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
    playing: 0.06,
    paused: 0.03,
    inactive: 0.0,
  }

  // Subdivisions are only linked to the level of detail in the animation
  // not the strength/amplitude
  const subdivs = Math.max(planeSubdivisions, 4)

  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uAmplitude: { value: AMPLITUDES[playerStatus] },
    }),
    [],
  )

  const viewport = useThree((state) => state.viewport)

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
    meshRef.current.material.uniforms.uAmplitude.value = amplitude
  })

  const ratio = viewport.width / viewport.height
  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1.0, 1.0, subdivs * ratio, subdivs]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
