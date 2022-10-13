import { Center , Image } from '@mantine/core';
/* import { SpinnerCircular } from 'spinners-react'; */
import "../Styles/Loader.scss"

import logo from '../Images/logo.png'

export const Loader = () => {
    return (
        <Center id='contain-loader'>
            <div id='contain-loading-spin'>
                {/* <SpinnerCircular size={400} color={"#1E68FB"}/> */}
                <Image src={logo} id='logo' />
            </div>
        </Center>
    )
}