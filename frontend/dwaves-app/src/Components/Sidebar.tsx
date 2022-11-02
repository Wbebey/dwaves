import { AddCircle, Home2, MusicFilter, Setting2 } from "iconsax-react"
import { Link } from "react-router-dom"
import datasongs from '../Musics/datasongs'

export const Sidebar = () => {
    return (
        <aside className="sidebar">
            <ul style={{ height: '100%' }} className="menu bg-white p-2">
                <li>
                    <Link  to={""} className="py-0">
                        <div className="avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://placeimg.com/192/192/people" />
                            </div>
                        </div>
                        <p>
                            Item
                        </p>
                    </Link>
                </li>
                <div className="divider m-0" />
                <li>
                    <Link  to={"/"}>
                        <Home2 className="w-10 h-10" />
                        <p>
                            Item
                        </p>
                    </Link>
                </li>
                <li>
                    <a>
                        <MusicFilter className="w-10 h-10" />
                        <p>
                            Item
                        </p>
                    </a>
                </li>
                <li>
                    <Link  to={"/download"}>
                        <AddCircle className="w-10 h-10" />
                        <p>
                            Item
                        </p>
                    </Link>
                </li>
                <div className="divider m-0" />
                {datasongs.map(song =>
                    <li>
                        <Link to={"/album"}>
                            <div className="avatar">
                                <div className="w-10 rounded">
                                    <img src={process.env.REACT_APP_URL + 'stamina1.jpg'} />
                                </div>
                            </div>
                            <p>
                                Item
                            </p>
                        </Link>
                    </li>
                )}
                <li style={{position: 'absolute', bottom: '4%'}}>
                    <a>
                        <Setting2 className="w-10 h-10" />
                    </a>
                </li>
            </ul>

        </aside>
    )
}