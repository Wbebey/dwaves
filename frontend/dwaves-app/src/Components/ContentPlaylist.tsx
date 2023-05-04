import { Banner } from "./data/Banner"
import { List } from "./data/ListCard"
import { Suggestions } from "./data/Suggestions"

export const ContentPlaylist = () => {
    return (
        <div className="content">
            <div className="banner">
                <Banner />
            </div>
            <div className="container">
                <List />
                <Suggestions />
            </div>
        </div>
    )
}