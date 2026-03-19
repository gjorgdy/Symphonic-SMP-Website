import type {PageServerLoad} from './$types';
import {getClientPlayers} from "$lib/data/players";
import {VideoService} from "$lib/services/videoService";
import type {ClientPlayer} from "$lib/models/player";

export type IndexServerLoadProps = {
    players: ClientPlayer[],
    videos: Promise<Video[]>,
}

export const load: PageServerLoad = async () => {
    return {
        players: getClientPlayers(),
        videos: VideoService.getInstance().getRecentVideos()
    };
};