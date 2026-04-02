import {VideoService} from "$lib/services/videoService";
import type {Video, Livestream} from "$lib/models/content";
import {LivestreamService} from "$lib/services/livestreamService";
import {PlayerService} from "$lib/services/playerService";
import type {PlayerDisplay} from "$lib/models/player";

export type IndexServerLoadProps = {
    players: Promise<PlayerDisplay[]>,
    content: Promise<ContentCollection>
}

export type ContentCollection = {
    livestreams: Livestream[],
    videos: Video[]
}

export const load = (): IndexServerLoadProps => {
    const livestreamsPromise = LivestreamService.getInstance().getLivestreams();
    const videosPromise = VideoService.getInstance().getRecentVideos();

    return {
        players: PlayerService.getInstance().getClientPlayers(),
        content: Promise.all([livestreamsPromise, videosPromise]).then(
            ([livestreams, videos]) => ({ livestreams, videos })
        )
    };
};