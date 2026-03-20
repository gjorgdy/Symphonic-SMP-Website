import { TwitchAPI } from "$lib/apis/twitch";
import type {Livestream} from "$lib/models/livestream";
import {PlayerService} from "$lib/services/playerService";
import {getRegisteredPlayers} from "$lib/data/registeredPlayers";

const TWITCH_CACHE_DURATION = 60 * 1000; // 1 minute in ms

export class LivestreamService {

    private lastTwitchFetch: number = 0;
    private twitchStreams: Map<String, Livestream> = new Map();

    private static instance: LivestreamService;

    private constructor() {
        // Private constructor to prevent direct instantiation
        console.log("LivestreamService initialized");
    }

    public static getInstance(): LivestreamService {
        if (!LivestreamService.instance) {
            LivestreamService.instance = new LivestreamService();
        }
        return LivestreamService.instance;
    }

    public async fetchTwitch(): Promise<void> {
        this.twitchStreams = await TwitchAPI.fetchLiveStreams(
            getRegisteredPlayers()
                .filter(p => p.twitch_user_id != null)
                .map(p => p.twitch_user_id!)
        )
        console.log(this.twitchStreams);
        this.lastTwitchFetch = Date.now();
    }

    public async getLivestreams(): Promise<Livestream[]> {
        if ((Date.now() - this.lastTwitchFetch) > TWITCH_CACHE_DURATION) {
            await this.fetchTwitch();
        }
        return [...this.twitchStreams.values()];
    }

}