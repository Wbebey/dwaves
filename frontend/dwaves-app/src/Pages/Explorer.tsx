import "../Styles/Explorer.scss"

import { Sidebar } from '../Components/Sidebar'
import { ContentPlaylist } from '../Components/ContentPlaylist'



export const Explorer = () => {


    return (
        <section style={{ color: 'black', height: '65%' }}>
            <section className="container-app">
                <div className="contain-explorer">
                    <Sidebar />
                    <ContentPlaylist />
                </div>
            </section>
        </section>
    )
}



