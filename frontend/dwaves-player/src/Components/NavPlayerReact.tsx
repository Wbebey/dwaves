import likePlay from '../Icons/Like.svg'
import commentPlay from '../Icons/Comment.svg'
import arrowPlay from '../Icons/Arrow.svg'
import addPlay from '../Icons/Add.svg'
import timePlay from '../Icons/Time.svg'
import listPlay from '../Icons/List.svg'
import logoPlay from '../Icons/Shape.svg'

interface Props {
    audioElmt:any,
    isPlaying:boolean,
    setIsPlaying:any,
    currentSong:any,
    setCurrentSong:any,
    songs: any,
    setSongs:any,
    goTenSecondLater: any,
    backTenSecondBefore: any
}

export const NavPlayerReact:React.FC<Props> = ({audioElmt , isPlaying, setIsPlaying, currentSong, setCurrentSong, songs, setSongs, goTenSecondLater, backTenSecondBefore}) => {

        const PlayPause = () => {
            setIsPlaying(!isPlaying)
            audioElmt.current.play()
        }
        
        let index = songs.findIndex((x: { Title: string })=> x.Title == currentSong.Title)

        const handlePrevious = () => {
            if (index == 0) {
                setCurrentSong(songs[songs.length - 1])
                index = songs.length - 1
            } else {
                setCurrentSong(songs[index - 1])
                index = index - 1
            }
            audioElmt.current.currentTime = 0
        }

        const handleNext = () => {
            if (index == songs.length - 1) {
                setCurrentSong(songs[0])
                index = 0
            } else {
                setCurrentSong(songs[index + 1])
                index = index + 1
            }
            audioElmt.current.currentTime = 0
        }

    return (
        <section>

            <div className="player-nav">
                <div className="comment-button-contain">
                    <img alt="" className="player-button" src={commentPlay} style={{ marginTop: "5px" }} />
                </div>
                <div className="like-button-contain">
                    <img alt="" className="player-button" src={likePlay} style={{ marginTop: "5px" }} />
                </div>
                <div className="arrow-left-button-contain">
                    <img alt="" onClick={handlePrevious} className="player-button" src={arrowPlay} style={{ transform: "rotate(180deg)" }} />
                </div>
                <div className="back-button-contain">
                    <img alt="" onClick={backTenSecondBefore} className="player-button" src={timePlay} style={{ marginTop: "10px" }} />
                </div>
                <div className="play-button-contain">
                { isPlaying ? <img alt=""  onClick={() => PlayPause()} className="player-button" src={commentPlay}/> 
                    : <img alt="" onClick={() => PlayPause()}  className="player-button" src={logoPlay} />}
                </div>
                <div className="back-button-contain">
                    <img alt="" onClick={goTenSecondLater} className="player-button" src={timePlay} style={{ marginTop: "10px", transform: "rotate(180deg)" }} />
                </div>
                <div className="arrow-right-button-contain">
                    <img alt="" onClick={handleNext} className="player-button" src={arrowPlay} />
                </div>
                <div className="add-button-contain">
                    <img alt="" className="player-button" src={addPlay} style={{ marginTop: "5px" }} />
                </div>
                <div className="list-button-contain">
                    <img alt="" className="player-button" src={listPlay} style={{ marginTop: "5px" }} />
                </div>
            </div>
        </section>
    )
}


