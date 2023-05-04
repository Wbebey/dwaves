import React from 'react'
import { UserPlaylists } from '../components'

interface Props {
  wallet: string
}

export const Marketplace: React.FC<Props> = ({ wallet }) => {
  return (
    <div
      className="contain-download"
      style={{ width: '100%', height: '100%', background: 'white' }}
    >
      <div className={'h-[97%] pt-[30px] pl-[20px]'}>
        <div className={`w-full h-[90%] overflow-scroll`}>{wallet}</div>
      </div>
    </div>
  )
}
