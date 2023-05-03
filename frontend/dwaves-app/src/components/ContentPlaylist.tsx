import { Banner, List, Suggestions } from 'components/data'

export const ContentPlaylist = () => {
  return (
    <div className="content">
      <div className="banner">
        <Banner />
      </div>
      <div className="container-playlist">
        <List />
        {/* <Suggestions /> */}
      </div>
    </div>
  )
}
