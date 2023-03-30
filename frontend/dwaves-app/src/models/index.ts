export type responseRequest = {
    response: string
    status: number
    visible: boolean
}

export type Music = {
    src: string|undefined
    name: string
    listenings: number
    progress: number
    length:number
}

export type Test = {
    src: string|undefined
    name: string
    listenings: number
}

export type AlbumDetail = {
    id: number
    type: string
    name: string
    createdAt: Date
    genre: string
    artist: string
    subscribers: number
    cover: string
    musics: Test[]
}

export type Playlists = {
    id: number
    name: string
}[]