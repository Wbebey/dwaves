import "../Styles/Explorer.scss"

import { Sidebar } from '../Components/Sidebar'
import { Input } from '../Components/Download'



export const Download = () => {


    return (
        <section style={{ color: 'black', height: '65%' }}>
            <section className="container-app">
                <div className="contain-explorer">
                    <Sidebar />
                    <Input />
                </div>
            </section>
        </section>
    )
}