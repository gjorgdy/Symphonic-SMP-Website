import {getRegisteredPlayer} from "$lib/data/registeredPlayers";
import {isShort, isVOD, type Livestream, type Video} from "$lib/models/content";

export type Settings = {
    onlySymphonic: boolean,
    livestreams: boolean,
    vods: boolean,
    shorts: boolean,
}

export class ContentUtils {

    static filterVideos(videos: Video[], settings: Settings, disc: string|null = null): Video[] {
        if (disc != null) {
            const player = getRegisteredPlayer(disc);
            videos = videos.filter(video => {
                return video.creator.youtube_user_id === player?.youtube_user_id
            })
        }
        if (settings.onlySymphonic) {
            videos = videos.filter(video => video.symphonic);
        }
        if (!settings.vods) {
            videos = videos.filter(video => !isVOD(video));
        }
        if (!settings.shorts) {
            videos = videos.filter(video => !isShort(video));
        }
        return videos;
    }

    static filterLivestreams(streams: Livestream[], settings: Settings, disc: string|null = null): Livestream[] {
        if (!settings.livestreams) return [];
        if (settings.onlySymphonic) {
            streams = streams.filter(s => s.symphonic);
        }
        if (disc != null) {
            const player = getRegisteredPlayer(disc);
            streams = streams.filter(stream => {
                return  stream.creator.twitch_user_id === player?.twitch_user_id
            })
        }
        return streams;
    }

}