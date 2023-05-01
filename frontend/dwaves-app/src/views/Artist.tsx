import React from 'react'
import {useParams} from "react-router-dom";

export const Artist = () => {

  const { id } = useParams()
  return (
    <div
      className="contain-download"
      style={{ width: '100%', height: '100%', background: 'white' }}
    >
      Artist ID - {id}
    </div>
  )
}
