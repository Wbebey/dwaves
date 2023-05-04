
declare const window: Window &
    typeof globalThis & {
        ethereum: any
    }

export const ConnectMetamask = () => {

    const requestConnection = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
        }
    }

    return (
        <li>
            <div onClick={requestConnection} className="avatar mx-auto">
                <div className="w-8 rounded-full">
                    <img src={import.meta.env.VITE_APP_URL + 'metamask.png'} alt='' />
                </div>
            </div>
        </li>
    )
}
