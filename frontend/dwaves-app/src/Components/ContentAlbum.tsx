import '../Styles/ContentAlbum.scss'
import { AddCircle, Back, Heart} from "iconsax-react"

import datasongs from '../Musics/datasongs'
import { Link } from 'react-router-dom'

export const ContentAlbum = () => {
    return (
        <div  className="content-album">
            <header className="head">
                <Link to={'/'}>
                    <Back style={{ color: 'black', width: '32px', height: '32px' }} />
                </Link>
                <div className="divider divider-horizontal" />
                <div className='title'>
                    <img src={`${process.env.REACT_APP_URL}stamina1.jpg`} alt="" />
                    <h3>
                        Stamina
                    </h3>
                </div>
                <div className="avatar">
                    <div className="w-14 h-14 rounded-full">
                        <img src="https://placeimg.com/192/192/people" alt="" />
                    </div>
                </div>
            </header>
            <ul className='list-song'>
                {
                    datasongs.map((song, i) =>
                        <li key={song.Title} className='song-li'>
                            <div className="avatar placeholder">
                                <div className="text-neutral-content rounded-full w-10">
                                    <span className="text-xl">0{i + 1}</span>
                                </div>
                            </div>
                            <div className="p-0 divider divider-horizontal" />
                            <div className='song-li-info'>
                                <h4 style={{}}>
                                    {song.Title}
                                </h4>
                                <p>
                                    {song.Artist}
                                </p>
                            </div>
                            <div className='song-li-action'>
                                <AddCircle />
                                <Heart />
                                <p>
                                    2 : 30
                                </p>
                            </div>
                        </li>
                    )
                }
            </ul>
        </div>
    )
} 