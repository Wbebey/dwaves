import { Banner, List, Suggestions } from "components/data";

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
  );
};
