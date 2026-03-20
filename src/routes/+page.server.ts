import type {Video} from "$lib/models/video";
import {VideoService} from "$lib/services/videoService";
import type {Livestream} from "$lib/models/livestream";
import {LivestreamService} from "$lib/services/livestreamService";
import type {ClientPlayer} from "$lib/models/player";
import {PlayerService} from "$lib/services/playerService";

export type IndexServerLoadProps = {
    players: Promise<ClientPlayer[]>,
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