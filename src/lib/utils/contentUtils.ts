import {getRegisteredPlayer} from "$lib/data/registeredPlayers";
import {isLongFormVideo, isShort, isVOD, type Livestream, type Video} from "$lib/models/content";

export const DEFAULT_FILTERS: Filters = {
    livestreams: true,
    videos: true,
    shorts: false,
    vods: false,
    notSymphonic: false
};

export type Filters = {
    notSymphonic: boolean,
    livestreams: boolean,
    videos: boolean,
    vods: boolean,
    shorts: boolean,
}

export class ContentUtils {

    static filterVideos(videos: Video[], settings: Filters, disc: string|null = null): Video[] {
        if (disc != null) {
            const player = getRegisteredPlayer(disc);
            videos = videos.filter(video =>
                (video.creator.youtube_user_id !== undefined && video.creator.youtube_user_id === player?.youtube_user_id)
                || (video.creator.twitch_user_id !== undefined && video.creator.twitch_user_id === player?.twitch_user_id)
            )
        }
        if (!settings.notSymphonic) {
            videos = videos.filter(video => video.symphonic);
        }
        if (!settings.vods) {
            videos = videos.filter(video => !isVOD(video));
        }
        if (!settings.shorts) {
            videos = videos.filter(video => !isShort(video));
        }
        if (!settings.videos) {
            videos = videos.filter(video => !isLongFormVideo(video));
        }
        return videos;
    }

    static filterLivestreams(streams: Livestream[], settings: Filters, disc: string|null = null): Livestream[] {
        if (!settings.livestreams) return [];
        if (!settings.notSymphonic) {
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