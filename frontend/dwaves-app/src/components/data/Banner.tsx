import "styles/data/Banner.scss";

const playlists: { title: string }[] = [
  { title: "Playlist 1" },
  { title: "Playlist 2" },
  { title: "Playlist 3" },
  { title: "Playlist 4" },
];

export const Banner = () => {
  return (
    <section className="contain-banner">
      <div
        className="background-image"
        style={{
          backgroundImage: `url('/playlist1.png')`,
        }}
      />
      <div className="background-blur" />
      <div className="content-playlist">
        <div className="left">
          <h1>Title Playlist</h1>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officia voluptate nisi, nihil repudiandae porro consequuntur,
            necessitatibus officiis mollitia, voluptatem libero quasi qui cum
            fugit enim optio facilis! Quaerat, odio.
          </p>
        </div>
        <div className="right">
          <img
            alt=""
            className="img one"
            src="/stamina1.jpg"
          />
          <img
            alt=""
            className="img two"
            src="/stamina2.jpg"
          />
          <img
            alt=""
            className="img three"
            src="/stamina3.jpg"
          />
        </div>
      </div>
      <div className="banner-pagination">
        {playlists.map((playlist) => (
          <div
            key={playlist.title}
            style={{ width: `${100 / playlists.length}%` }}
            className="step"
          />
        ))}
      </div>
    </section>
  );
};
