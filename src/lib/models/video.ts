export type Video = {
    name: string,
    creator: Creator,
    thumbnail: Thumbnail,
    url: string,
    duration: string,
    timestamp: Date,
    views: number,
    likes: number,
    comments: number,
    live: boolean,
    symphonic: boolean,
    short: boolean,
}

type Thumbnail = {
    url: string,
}

type Creator = {
    name: string,
    url: string
}