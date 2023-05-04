export type responseRequest = {
    response: string
    status: number
    visible: boolean
}

export type music = {
    src:string,
    name: string,
    listenings: number
}

export type artist = {
    artist : string,
    cover: string,
    createdAt: string,
    genre: string,
    id: number,
    musics: music[]
    name: string,
    subscribers: number,
    type: string
}