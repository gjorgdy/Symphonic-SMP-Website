import type {PageServerLoad} from './$types';
import {VideoService} from "$lib/services/videoService";
import type {ClientPlayer} from "$lib/models/player";
import {PlayerService} from "$lib/services/playerService";

export type IndexServerLoadProps = {
    players: Promise<ClientPlayer[]>,
    videos: Promise<Video[]>,
}

export const load: PageServerLoad = async () => {
    return {
        players: PlayerService.getInstance().getClientPlayers(),
        videos: VideoService.getInstance().getRecentVideos()
    };
};