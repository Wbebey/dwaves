import axios from 'axios'
import React, { useEffect } from 'react'

type PropsMetamask = {
  wallet: string
  requestConnectionMetamask: () => Promise<void>
}
export const ConnectMetamask = ({
  wallet,
  requestConnectionMetamask,
}: PropsMetamask) => {
  const RequestAdress = async (data: any) => {
    const request = await axios.put(
      `${import.meta.env.VITE_APP_BACK_URL}/users/me/addWallet`,
      data,
      { withCredentials: true },
    )
  }

  useEffect(() => {
    if (wallet) {
      const data = { address: wallet[0] }
      RequestAdress(data)
    }
  }, [wallet])

  return (
    <li>
      <div onClick={requestConnectionMetamask} className="avatar mx-auto">
        <div className="w-8 rounded-full">
          {wallet ? (
            <img src="/metamask-b&w.png" alt="" />
          ) : (
            <img src="/metamask-color.png" alt="" />
          )}
        </div>
      </div>
    </li>
  )
}
