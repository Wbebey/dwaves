import { MostPopularSong } from "models";

interface Props {
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
    mostPopularSong: MostPopularSong[]
    artistId?: number
}

function convertDateToYearUTC(dateStr: Date) {
    const date = new Date(dateStr);
    const year = date.getUTCFullYear();
    return year.toString();
}

export const ArtistPopularSong: React.FC<Props> = ({ setCurrentSong, setSongs, mostPopularSong, artistId }) => {
    return (
        <div>
            <div>
                <h1 className={'text-4xl pl-[5px] font-bold mb-5'}>{artistId ? 'Top Songs' : 'My Popular Song'}</h1>
                {
                    mostPopularSong.map((song, index) => (
                        <div key={song.name}>
                            <div key={index} className={'flex flex-row mb-5 cursor-pointerno hover:bg-teal-300'}
                                onClick={e => {
                                    // setCurrentSong(song)
                                    // setSongs(mostPopularSong)
                                }}>
                                <div className={'text-2xl align-baseline flex self-center pl-2 w-24'}>{index + 1}</div>
                                <div className={'flex justify-between  items-center w-full'}>
                                    <div className={'w-12 pt-2 pb-2'}>
                                        <img src={song?.albumCover} alt="" />
                                    </div>
                                    <div>
                                        <div className={'text-center'}>{song.name}</div>
                                        <div>{song.albumName}</div>
                                    </div>
                                    <div className={'pr-[50px]'}>
                                        <div className={'text-end'}>{song.listenings} listenings</div>
                                        <div className={'text-end'}>{convertDateToYearUTC(song.albumDate)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}