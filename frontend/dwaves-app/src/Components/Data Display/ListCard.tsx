import '../../Styles/Data Display/List.scss'
import { Back, SearchNormal1 } from "iconsax-react"

import playlists from '../../Musics/playlist'
import { Link } from 'react-router-dom'

export const List = () => {
    return (
        <section className="contain-list-view">
            <header className="head">
                <div style={{ width: '60%' }} className="relative z-0">
                    <input type="text" id="floating_standard" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="floating_standard" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Floating standard</label>
                </div>
                <SearchNormal1 style={{ width: '32px', height: '32px', margin: '5px' }} />
                <div className="divider divider-horizontal" />
                <p>titre</p>
                <p>listes</p>
                <p>artiste</p>
            </header>
            <div className='content-playlist'>
                <div className='body'>
                    {/* modify flex with action button */}
                    {playlists.map(playlist =>
                        <div key={playlist.title} className="row">
                            <h2>
                                {playlist.title}
                            </h2>
                            <div className="overflow-x">
                                <div  className="contain-card">
                                    {playlist.musics.map(music =>
                                        <Link key={music.Title} to={'/album'} className="card">
                                            <img src={music.Cover} alt="" />
                                            <h3>
                                                {music.Title}
                                            </h3>
                                            <p>
                                                {music.Artist}
                                            </p>
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="divider divider-vertical" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}