import { useEffect, useRef } from 'react'
// @ts-ignore
import ModelViewer from '@metamask/logo'

export const Kitsune = () => {
  const elRef = useRef(null)
  let viewer: any = null

  useEffect(() => {
    viewer = ModelViewer({
      pxNotRatio: true,
      width: 200,
      height: 200,
      followMouse: true,
    })
    // @ts-ignore
    elRef?.current?.appendChild(viewer.container)
    elRef.current = viewer.container
    console.log(elRef?.current)
    return () => {
      viewer.stopAnimation()
    }
  }, [])

  return (
    <div>
      <div ref={elRef} />
    </div>
  )
}
