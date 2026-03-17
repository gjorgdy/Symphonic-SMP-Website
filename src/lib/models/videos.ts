type Video = {
    name: string,
    creator: Creator,
    thumbnail: Thumbnail,
    url: string,
    timestamp: number,
    views: number,
    likes: number,
    comments: number,
}

type Thumbnail = {
    url: string,
}

type Creator = {
    name: string,
    url: string
}