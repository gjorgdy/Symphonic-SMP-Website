export type Livestream = Content & {
    started_at: Date,
    viewers: number,
    type: "livestream",
}

export function isLivestream(content?: Content): content is Livestream {
    return content?.type === "livestream";
}

export type VOD = Video & {
    type: "vod";
}

export function isVOD(content?: Content): content is VOD {
    return content?.type === "vod";
}

export type Short = Video & {
    type: "short";
}

export function isShort(content?: Content): content is Short {
    return content?.type === "short";
}

export type Video = Content & {
    published_at: Date,
    duration: string,
    views: number,
    likes?: number,
    comments?: number,
    type: "vod" | "short" | "video",
}

export function isVideo(content?: Content): content is Video {
    return content?.type === "video" || isShort(content) || isVOD(content);
}

export type Content = {
    title: string,
    url: string,
    thumbnail_url: string,
    creator: Creator,
    symphonic: boolean
    type: "vod" | "short" | "video" | "livestream",
}

type Creator = {
    name: string,
    url: string,
    youtube_user_id?: string,
    twitch_user_id?: string
}