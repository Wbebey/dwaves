import '../../Styles/Data Display/Suggestions.scss'
import datasongs from '../../Musics/datasongs'

export const Suggestions = () => {
    return (
        <div className="aside">
            <h3>Pour vous</h3>
            <div className="divider divider-vertical" />
            <div className="overflow-x">
                {
                    datasongs.map(song =>
                        <div className="card-aside">
                            <img src={song.Cover} alt={song.Cover} />
                            <div className="text">
                                <h4>{song.Title}</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur</p>
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}