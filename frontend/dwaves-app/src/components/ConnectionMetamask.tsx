import axios from "axios"
import { useEffect, useState } from "react"

declare const window: Window &
    typeof globalThis & {
        ethereum: any
    }

export const ConnectMetamask = () => {

    const [wallet, setWallet] = useState()

    const requestConnection = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
            setWallet(accounts)
        }
    }

    const RequestAdress = async (data:any) => {
        const request = await axios.put(`${import.meta.env.VITE_APP_BACK_URL}/users/me/addWallet`, data, { withCredentials: true })
    }

    useEffect(() => {
        if (wallet) {
            console.log('connected')
            console.log(wallet)
            const data = { address: wallet[0] }
            RequestAdress(data)
        }
    }, [wallet])

    return (
        <li>
            <div onClick={requestConnection} className="avatar mx-auto">
                <div className="w-8 rounded-full">
                    {
                        wallet ?
                            <img src="/metamask-b&w.png" alt='' />
                            :
                            <img src="/metamask-color.png" alt='' />
                    }

                </div>
            </div>
        </li>
    )
}
