
declare const window: Window &
typeof globalThis & {
  ethereum: any
}

export const ConnectMetamask = () => {

    const requestConnection = async () => {

        console.log('Requesting an account')

        if (window.ethereum) {
            console.log("detected")
            
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                })
                console.log(accounts)
            } catch(error) {
                console.log('Error connecting...')
            }

        } else {
            console.log("MetaMask don't detected")
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
