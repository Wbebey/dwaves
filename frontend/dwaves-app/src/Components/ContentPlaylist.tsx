import { Banner } from "./Data Display/Banner"
import { List } from "./Data Display/ListCard"
import { Suggestions } from "./Data Display/Suggestions"

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