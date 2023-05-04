import React, { useState } from 'react'
import {
  AlbumForm,
  CreateConcert,
  CreatePlaylist,
  Kitsune,
  SingleForm,
  SwitchTab,
  UserPlaylists,
} from '../components'

interface Props {
  wallet: string
  requestConnectionMetamask: () => Promise<void>
}

export const Marketplace: React.FC<Props> = ({
  wallet,
  requestConnectionMetamask,
}) => {
  const [showTickets, setShowTickets] = useState('Upcoming concerts')

  return (
    <div
      className="contain-download"
      style={{ width: '100%', height: '100%', background: 'white' }}
    >
      {wallet === '' ? (
        <div className={'h-[97%] pt-[30px] pl-[20px]'}>
          <div className="w-full h-[90%] overflow-scroll flex flex-col items-center">
            <p className="text-xl mt-5 mx-40 text-center">
              Ready to explore the exciting offerings on Dwaves marketplace?
              Simply log in to your MetaMask account to get started
            </p>
            <p className="text-xl my-10">Click on the Fox !</p>
            <div className="cursor-pointer" onClick={requestConnectionMetamask}>
              <Kitsune />
            </div>
          </div>
        </div>
      ) : (
        <>
          <SwitchTab
            values={['Upcoming concerts', 'Create a concert']}
            showForm={showTickets}
            setShowForm={setShowTickets}
          />
          <div className={'h-[97%] pt-[30px]'}>
            {showTickets === 'Upcoming concerts' ? (
              <div>HEY HEY</div>
            ) : (
              <CreateConcert />
            )}{' '}
          </div>
        </>
      )}
    </div>
  )
}
