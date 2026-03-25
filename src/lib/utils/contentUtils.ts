import type {Video} from "$lib/models/video";
import {getRegisteredPlayer} from "$lib/data/registeredPlayers";
import type {Livestream} from "$lib/models/livestream";

export type Settings = {
    onlySymphonic: boolean,
    livestreams: boolean,
    shorts: boolean,
}

export class ContentUtils {

    static filterVideos(videos: Video[], settings: Settings, disc: string|null = null): Video[] {
        if (disc != null) {
            const player = getRegisteredPlayer(disc);
            videos = videos.filter(video => {
                return  video.creator.youtube_user_id === player?.youtube_user_id
            })
        }
        if (settings.onlySymphonic) {
            videos = videos.filter(video => video.symphonic);
        }
        if (!settings.livestreams) {
            videos = videos.filter(video => !video.live);
        }
        if (!settings.shorts) {
            videos = videos.filter(video => !video.short);
        }
        return videos;
    }

    static filterLivestreams(streams: Livestream[], settings: Settings, disc: string|null = null): Livestream[] {
        if (!settings.livestreams) return [];
        if (settings.onlySymphonic) {
            streams = streams.filter(stream => stream.title?.toLowerCase().includes("symphonic"));
        }
        if (disc != null) {
            const player = getRegisteredPlayer(disc);
            streams = streams.filter(stream => {
                return  stream.creator_twitch_user_id === player?.twitch_user_id
            })
        }
        return streams;
    }

}