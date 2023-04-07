import React, { useState } from 'react'
import { SwitchTab, UserPlaylists } from '../components'

interface Props {
  wallet: string
  requestConnectionMetamask: () => Promise<void>
}

export const Marketplace: React.FC<Props> = ({
  wallet,
  requestConnectionMetamask,
}) => {
  const [showForm, setShowForm] = useState('Overview')

  return (
    <div
      className="contain-download"
      style={{ width: '100%', height: '100%', background: 'white' }}
    >
      {wallet === '' ? (
        <div className={'h-[97%] pt-[30px] pl-[20px]'}>
          <div className="w-full h-[90%] overflow-scroll flex flex-col items-center">
            <p className="text-xl mt-5">
              To access the Dwaves marketplace, please log in to your MetaMask
              account
            </p>
            <p className="text-xl my-5">Click on the Fox !</p>
            <div className="cursor-pointer" onClick={requestConnectionMetamask}>
              <img src="/metamask-color.png" alt="" width={100} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <SwitchTab
            values={['Upcoming concerts', 'Create a concert']}
            showForm={showForm}
            setShowForm={setShowForm}
          />
          <div className={'h-[97%] pt-[30px] pl-[20px]'}>
            <div className={`w-full h-[90%] overflow-scroll`}>{wallet}</div>
          </div>
        </>
      )}
    </div>
  )
}
