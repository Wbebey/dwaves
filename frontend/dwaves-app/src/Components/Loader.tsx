import "../Styles/Loader.scss"

import logo from '../Images/logo.png'


export const Loader = () => {
    return (
        <div id='contain-loader'>
            <div id='contain-loading-spin'>
                {/* <SpinnerCircular size={400} color={"#1E68FB"}/> */}
                <img src={logo} id='logo' />
            </div>
        </div>
    )
}