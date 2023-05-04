import { AddCircle, Home2, MusicFilter, Setting2 } from "iconsax-react"


export const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul className="menu bg-white p-2">
                <li>
                    <a className="py-0">
                        <div className="avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://placeimg.com/192/192/people" />
                            </div>
                        </div>
                        <p>
                            Item
                        </p>
                    </a>
                </li>
                <div className="divider m-0" />
                <li>
                    <a>
                        <Home2 className="w-10 h-10" />
                        <p>
                            Item
                        </p>
                    </a>
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
                    <a>
                        <AddCircle className="w-10 h-10" />
                        <p>
                            Item
                        </p>
                    </a>
                </li>
                <div className="divider m-0" />
                <li>
                    <a>
                        <div className="avatar">
                            <div className="w-10 rounded">
                                <img src={process.env.REACT_APP_URL + 'stamina1.jpg'}/>
                            </div>
                        </div>
                        <p>
                            Item
                        </p>
                    </a>
                </li>
                <li>
                    <a>
                        <div className="avatar">
                            <div className="w-10 rounded">
                                <img src={process.env.REACT_APP_URL + 'stamina1.jpg'}/>
                            </div>
                        </div>
                        <p>
                            Item
                        </p>
                    </a>
                </li>
                <li>
                    <a>
                        <div className="avatar">
                            <div className="w-10 rounded">
                                <img src={process.env.REACT_APP_URL + 'stamina1.jpg'}/>
                            </div>
                        </div>
                        <p>
                            Item
                        </p>
                    </a>
                </li>
                <li>
                    <a>
                        <div className="avatar">
                            <div className="w-10 rounded">
                                <img src={process.env.REACT_APP_URL + 'stamina1.jpg'}/>
                            </div>
                        </div>
                        <p>
                            Item
                        </p>
                    </a>
                </li>
                <li>
                    <a>
                        <div className="avatar">
                            <div className="w-10 rounded">
                                <img src={process.env.REACT_APP_URL + 'stamina1.jpg'}/>
                            </div>
                        </div>
                        <p>
                            Item
                        </p>
                    </a>
                </li>
                <li>
                    <a>
                        <div className="avatar">
                            <div className="w-10 rounded">
{/*                                 <img src={process.env.REACT_APP_URL + 'stamina1.jpg'}/>*/}                            
                            </div>
                        </div>
                        <p>
                            Item
                        </p>
                    </a>
                </li>
                <div className="divider m-0" />
                <li>
                    <a>
                        <Setting2 className="w-10 h-10" />
                        <p>
                            Item
                        </p>
                    </a>
                </li>
            </ul>
        </div>
    )
}