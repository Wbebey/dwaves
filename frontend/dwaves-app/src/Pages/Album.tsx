import "../Styles/Explorer.scss"

import { Sidebar } from '../Components/Sidebar'
import { ContentAlbum } from "../Components/ContentAlbum";

export const Album = () => {

    return (
        <section style={{ color: 'black', height: window.innerHeight }}>
            <section className="container-app">
                <div className="contain-explorer">
                    <Sidebar />
                    <ContentAlbum/>
                </div>
            </section>
        </section>
    )
}

