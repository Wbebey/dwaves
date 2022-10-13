import "../Styles/Player.scss"
import { useEffect, useState } from 'react'

const dataSong = {
    Artist: "Dinos",
    likes: 190, //156 468
    UsersLiked: [
        { Name: "", Avatar: "https://via.placeholder.com/360x360" }
    ],
    Src: "http://localhost:3000/audiotest.mp3",
    outDate: "",

}

const dwavesBubble = <div className="bulle" />
const userBubble = <div  className="bulle-user"><img className="avatar-bulles" src="https://via.placeholder.com/360x360" alt="placeholder" /></div>


export const AnimateBulles = () => {
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
        
        const y = i + i

        if (bubble.className == 'bulle-user') {
            bubble.style.right = i * 10 + '%'
        } else {
            bubble.style.left = i * 10 + '%'
        }
        
        bubble.style.bottom = posHeight + '%'

        bubble.style.height = (Math.random() * (maxHeight - minHeight) + minHeight) + "px"
        bubble.style.width = bubble.style.height

            bubble.animate([
                // étapes/keyframes
                { transform: 'translateY(0px)' },
                { transform: 'translateY(-900px)' }
            ], {
                // temporisation
                duration: 10000,
                iterations: Infinity ,
                delay: y * 1000,
            });
    }

    return (
        <div className="bulles-contain">
            {userBubbles}
            {dwavesBubbles}
        </div>
    )
}