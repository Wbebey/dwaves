export type responseRequest = {
  response: string;
  status: number;
  visible: boolean;
};

export type Music = {
  src: string | undefined;
  name: string;
  listenings: number;
  duration: string;
  progress: number;
  length: number;
};

export type Test = {
  src: string | undefined;
  name: string;
  listenings: number;
  duration: string
  artist?: string;
  albumName?: string
  albumCover?: string
};

export type AlbumDetail = {
  id: number;
  type: string;
  name: string;
  createdAt: Date;
  genre: string;
  artist: string;
  subscribers: number;
  cover: string;
  musics: Test[];
};

export type Playlists = {
  coverCID: string
  createdAt: string
  creatorId: number
  id: number
  likes: number
  musics:Test[]
  name: string
  updatedAt: string
  description:string
};

export type FormattedEvents = {
  id: number
  name: string
  date: string
  place: string
  genre: string
  artist: string
  price: number
  availableTickets: number
  ticketIdToBuy: ''
}[];

export type MostPopularSong = {
  name: string
  type: string
  listenings: number
  src: string
  artist: string
  genre: string
  albumName: string
  albumCover: string
  albumDate: Date
}
