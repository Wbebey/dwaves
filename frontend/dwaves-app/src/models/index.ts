export type responseRequest = {
  response: string
  status: number
  visible: boolean
}

export type Music = {
  src: string | undefined;
  name: string;
  listenings: number;
  duration: string;
  progress: number;
  currentTime: number;
  length: number;
  albumCover?: string
  artist? : string
};

export type Test = {
  src: string | undefined;
  name: string;
  listenings: number;
  duration: string
  progress: number
  currentTime: number
  length: number
}

export type MusicDetail = {
  src: string | undefined
  name: string
  listenings: number
  duration: string
  artist?: string
  albumName?: string
  albumCover?: string
}

export type Album = {
  id: number
  type: string
  name: string
  createdAt: Date
  genre: string
  artist: string
  subscribers: number
  cover: string
  musics: string[]
}

export type AlbumDetail = Omit<Album, 'musics'> & {
  musics: MusicDetail[]
}

export type Playlists = {
  coverCID: string
  createdAt: string
  creatorId: number
  id: number
  likes: number
  musics: MusicDetail[]
  name: string
  updatedAt: string
  description: string
}

export type FormattedEvents = {
  id: number
  name: string
  date: string
  place: string
  genre: string
  artist: string
  price: number
  availableTickets: number
  ticketIdToBuy: string
}[]

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

export type User = {
  id: number
  address: string
  username: string
  email: string
  avatar: string
  myLikedMusics: string[]
  createdAt: string
  updatedAt: string
}

export type CurrentUser = User & {
  playlists: Playlists[]
  albums: Album[]
  monthlyListenings: number[]
  likedAlbums: Album[]
  likedPlaylists: Playlists[]
  likedArtists: User[]
  subscribers: User[]
}
