import { Howl } from 'howler'
import "../Styles/Player.scss"

import songCover from '../Images/stamina.jpg'
import logoDeep from '../Images/logo-deep.png'

import logoPlay from '../Icons/Shape.svg'
import likePlay from '../Icons/Like.svg'
import commentPlay from '../Icons/Comment.svg'
import arrowPlay from '../Icons/Arrow.svg'
import addPlay from '../Icons/Add.svg'
import timePlay from '../Icons/Time.svg'
import listPlay from '../Icons/List.svg'
import { useEffect, useState } from 'react'

const dataSong = {
    Artist: "Dinos",
    likes: 190, //156 468
    UsersLiked: [
        { Name: "", Avatar: "http://via.placeholder.com/360x360" }
    ],
    Src: "http://localhost:3000/audiotest.mp3",
    outDate: "",

}

const dwavesBubble = <div className="bulle" />
const userBubble = <div className="bulle-user"><img className="avatar-bulles" src="http://via.placeholder.com/360x360" alt="placeholder" /></div>


export const Player = () => {
    const [userBubbles, setUserBubbles] = useState<JSX.Element[]>([])
    const [dwavesBubbles, setDwavesBubbles] = useState<JSX.Element[]>([])

    useEffect(() => {
        initBubbles(dataSong.likes)
    }, [])

    useEffect(() => {
        if (userBubbles.length > 0) {
            const userBubblesHTML = Array.from(document.getElementsByClassName('bulle-user') as HTMLCollectionOf<HTMLElement>)
            userBubblesHTML.forEach((bubble, i) => styleBubble(bubble, i))
        }
    }, [userBubbles])
    useEffect(() => {
        if (dwavesBubbles.length > 0) {
            const dwavesBubblesHTML = Array.from(document.getElementsByClassName('bulle') as HTMLCollectionOf<HTMLElement>)
            dwavesBubblesHTML.forEach((bubble, i) => styleBubble(bubble, i))
        }
    }, [dwavesBubbles])

    const initBubbles = (likes: number) => {
        let bubbleCount = 0
        if (likes >= 1_000_000) {
            bubbleCount = 20
        } else if (likes >= 100_000) {
            bubbleCount = 15
        } else if (likes >= 10_000) {
            bubbleCount = 10
        } else if (likes >= 1_000) {
            bubbleCount = 5
        } else if (likes >= 100) {
            bubbleCount = 3
        } else if (likes >= 10) {
            bubbleCount = 1
        }

        const userBubbles = Array(bubbleCount).fill(userBubble)
        const dwavesBubbles = Array(bubbleCount).fill(dwavesBubble)

        setUserBubbles(userBubbles)
        setDwavesBubbles(dwavesBubbles)
    }

    const styleBubble = (bubble: HTMLElement, i: number) => {
        const maxHeight = 100
        const minHeight = 2
        const posHeight = 2
        const posWidth = 1

        console.log({ bubble })

        bubble.style.bottom = posHeight + '%'
        bubble.style.right = posWidth + '%'

        bubble.style.height = (Math.random() * (maxHeight - minHeight) + minHeight) + "px"
        bubble.style.width = bubble.style.height

        if (i % 2 != 0) {
            bubble.animate([
                // étapes/keyframes
                { transform: 'translateY(0px)' },
                { transform: 'translateY(-800px)' }
            ], {
                // temporisation
                duration: 10000,
                iterations: Infinity
            });
        } else {
            setInterval(() => {
                bubble.animate([
                    // étapes/keyframes
                    { transform: 'translateY(0px)' },
                    { transform: 'translateY(-800px)' }
                ], {
                    // temporisation
                    duration: 10000,
                    iterations: Infinity
                })
            }, 1000)
        }
    }


    //  const createBubbles = (likes: number) => {
    //      var countStr: string = likes.toString()
    //      var countPerSecond: number

    //      switch (countStr.length) {
    //          case 6:
    //              countPerSecond = 20
    //              /* console.log('LA CENTAINE DE MILLIERS DE likes  POTO')*/
    //              bulleUser = Array.from({ length: Math.trunc(countPerSecond / 2) }, (v: any, k: any) => bullesDwaves)
    //              bullesDwaves = Array.from({ length: countPerSecond }, (v: any, k: any) => userBubble)

    //              break;
    //          case 5:
    //              countPerSecond = 15
    //              /* console.log('LA DIZAINE DE MILLIERS DE likes POTO') */
    //              bulleUser = Array.from({ length: Math.trunc(countPerSecond / 2) }, (v: any, k: any) => bullesDwaves)
    //              bullesDwaves = Array.from({ length: countPerSecond }, (v: any, k: any) => userBubble)
    //              break;
    //          case 4:
    //              countPerSecond = 10
    //              /* console.log('LE MILLIER DE likes POTO') */
    //              bulleUser = Array.from({ length: Math.trunc(countPerSecond / 2) }, (v: any, k: any) => bullesDwaves)
    //              bullesDwaves = Array.from({ length: countPerSecond }, (v: any, k: any) => userBubble)
    //              break;
    //          case 3:
    //              countPerSecond = 5

    //              /* console.log('LA CENTAINE DE likes POTO') */
    //              bulleUser = Array.from({ length: Math.trunc(countPerSecond / 2) }, (v: any, k: any) => bullesDwaves)
    //              bullesDwaves = Array.from({ length: countPerSecond }, (v: any, k: any) => userBubble)
    //              break;
    //          case 2:
    //              countPerSecond = 3
    //              /* console.log('LA DIZAINE DE likes POTO') */
    //              bulleUser = Array.from({ length: Math.trunc(countPerSecond / 2) }, (v: any, k: any) => bullesDwaves)
    //              bullesDwaves = Array.from({ length: countPerSecond }, (v: any, k: any) => userBubble)
    //              break;
    //          case 1:
    //              countPerSecond = 1
    //              /* console.log('LA DIZAINE DE likes POTO') */
    //              bulleUser = Array.from({ length: Math.trunc(countPerSecond / 2) }, (v: any, k: any) => bullesDwaves)
    //              bullesDwaves = Array.from({ length: countPerSecond }, (v: any, k: any) => userBubble)
    //              break;
    //          default:
    //              break;
    //      }
    //      return { bulleUser, bullesDwaves }

    // }


    const callMySound = (src: string) => {
        const sound = new Howl({
            src,
            html5: true,
        })
        sound.play();
        console.log(sound)
        setTimeout(() => {
            sound.stop()
        }, 16000)
    }

    // useEffect(() => {
    //     var elementBulles: any = createBubbles(dataSong.likes)
    //     console.log(test)
    //     var elementBulles:any = Array.from(document.getElementsByClassName('bulle') as HTMLCollectionOf<HTMLElement>)
    //     var maxHeight = 100
    //     var minHeight = 2

    //     var maxWidth = 30
    //     var minWidth = 2

    //     var posHeight: number = 2
    //     var posWidth: number = 1

    //     console.log({ bulles: document.getElementsByClassName('bulle') })
    //     console.log({ elementBulles })


    //     elementBulles.map((item: any, i: number) => {
    //         item.style.bottom = posHeight + '%'
    //         item.style.right = posWidth + '%'

    //         item.style.height = (Math.random() * (maxHeight - minHeight) + minHeight) + "px"
    //         item.style.width = item.style.height

    //         posWidth = posWidth + 5

    //         if (i % 2 != 0) {
    //             item.animate([
    //                 // étapes/keyframes
    //                 { transform: 'translateY(0px)' },
    //                 { transform: 'translateY(-800px)' }
    //             ], {
    //                 // temporisation
    //                 duration: 10000,
    //                 iterations: Infinity
    //             });
    //         } else {
    //             setInterval(() => {
    //                 item.animate([
    //                     // étapes/keyframes
    //                     { transform: 'translateY(0px)' },
    //                     { transform: 'translateY(-800px)' }
    //                 ], {
    //                     // temporisation
    //                     duration: 10000,
    //                     iterations: Infinity
    //                 })
    //             }, 1000)
    //         }

    //     })
    // }, [])


    return (
        <section className="contain-player-bg" >
            <img className="logo-player" src={logoDeep} alt="" />
            <div className="blur-effect">
                <div className="contain-cover">
                    <img src={songCover} alt="stamina" style={{ width: "100%" }} />
                </div>
                <div className="player-nav">
                    <div className="comment-button-contain">
                        <img className="player-button" src={commentPlay} style={{ marginTop: "5px" }} />
                    </div>
                    <div className="like-button-contain">
                        <img className="player-button" src={likePlay} style={{ marginTop: "5px" }} />
                    </div>
                    <div className="arrow-left-button-contain">
                        <img className="player-button" src={arrowPlay} style={{ transform: "rotate(180deg)" }} />
                    </div>
                    <div className="back-button-contain">
                        <img className="player-button" src={timePlay} style={{ marginTop: "10px" }} />
                    </div>
                    <div className="play-button-contain">
                        <img onClick={() => callMySound(dataSong.Src)} className="player-button" src={logoPlay} />
                    </div>
                    <div className="back-button-contain">
                        <img className="player-button" src={timePlay} style={{ marginTop: "10px", transform: "rotate(180deg)" }} />
                    </div>
                    <div className="arrow-right-button-contain">
                        <img className="player-button" src={arrowPlay} />
                    </div>
                    <div className="add-button-contain">
                        <img className="player-button" src={addPlay} style={{ marginTop: "5px" }} />
                    </div>
                    <div className="list-button-contain">
                        <img className="player-button" src={listPlay} style={{ marginTop: "5px" }} />
                    </div>
                </div>

                <div className="bulles-contain">
                    {userBubbles}
                    {dwavesBubbles}
                </div>
            </div>
            {/* <div >click me to play</div> */}
        </section>
    )
}