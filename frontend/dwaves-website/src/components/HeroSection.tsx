import logo from '../assets/logo-dwaves.png'


export const HeroSection = () => {
    return (
            <a href={import.meta.env.VITE_APP_DWAVESAPP_URL}>
                <img src={logo} alt="" />
            </a>
    )
}