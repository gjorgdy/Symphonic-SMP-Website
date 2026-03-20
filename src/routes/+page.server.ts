import type {Video} from "$lib/models/video";
import {VideoService} from "$lib/services/videoService";
import type {Livestream} from "$lib/models/livestream";
import {LivestreamService} from "$lib/services/livestreamService";
import {PlayerService} from "$lib/services/playerService";
import type {PlayerDisplay} from "$lib/models/player";

export type IndexServerLoadProps = {
    players: Promise<PlayerDisplay[]>,
    content: Promise<Content>
}

export type Content = {
    livestreams: Livestream[],
    videos: Video[]
}

export const load = async (): Promise<IndexServerLoadProps> => {
    return {
        players: PlayerService.getInstance().getClientPlayers(),
        content: Promise.resolve({
            livestreams: await LivestreamService.getInstance().getLivestreams(),
            videos: await VideoService.getInstance().getRecentVideos()
        } as Content)
    };
}