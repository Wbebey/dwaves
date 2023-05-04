import '../Styles/ContentAlbum.scss'
import { AddCircle, Back, Heart, SearchNormal1 } from "iconsax-react"
import { Center } from '@mantine/core'

import datasongs from '../Musics/datasongs'
import { Link } from 'react-router-dom'

export const ContentAlbum = () => {
    return (
        <div style={{ paddingRight: '5px', borderRadius: '4px', marginLeft: '16px', background: 'white', width: '100%', height: '100%' }} className="content">
            <header style={{ padding: '7px', width: '100%', height: '10%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }} className="head">
                <Link to={'/'}>
                    <Back style={{ color: 'black', width: '32px', height: '32px' }} />
                </Link>
                <div className="divider divider-horizontal" />
                <div style={{ width: '90%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                    <img style={{ width: '55px', height: '55px' }} src={`${process.env.REACT_APP_URL}stamina1.jpg`} alt="" />
                    <h3 style={{fontWeight: 'bold', fontSize: '2.5em', marginLeft: '5px' }}>
                        Stamina
                    </h3>
                </div>
                <div className="avatar">
                    <div className="w-14 h-14 rounded-full">
                        <img src="https://placeimg.com/192/192/people" />
                    </div>
                </div>
            </header>
            <ul style={{ width: '100%', height: '60%' }}>
                {
                    datasongs.map((song, i) =>
                        <li style={{ marginTop: '10px', padding: '5px 0', width: '100%', height: '12%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                            <div className="avatar placeholder">
                                <div className="text-neutral-content rounded-full w-10">
                                    <span className="text-xl">0{i + 1}</span>
                                </div>
                            </div>
                            <div className="p-0 divider divider-horizontal" />
                            <div style={{ width: '85%', height: '100%' }}>
                                <h4 style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                                    {song.Title}
                                </h4>
                                <p>
                                    {song.Artist}
                                </p>
                            </div>
                            <div style={{ justifyContent: 'space-around', width: '10%', margin: '10px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                                <AddCircle style={{ width: '30px', height: '30px' }} />
                                <Heart style={{ width: '30px', height: '30px' }} />
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