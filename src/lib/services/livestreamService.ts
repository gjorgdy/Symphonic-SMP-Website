import { TwitchAPI } from "$lib/apis/twitch";
import type {Livestream} from "$lib/models/content";
import {getRegisteredPlayers} from "$lib/data/registeredPlayers";

const TWITCH_CACHE_DURATION = 60 * 1000; // 1 minute in ms

export class LivestreamService {

    private lastTwitchFetch: number = 0;
    private twitchStreams: Livestream[] = [];

    private static instance: LivestreamService;

    private constructor() {
        // Private constructor to prevent direct instantiation
        console.log("[INF] LivestreamService initialized");
    }

    public static getInstance(): LivestreamService {
        if (!LivestreamService.instance) {
            LivestreamService.instance = new LivestreamService();
        }
        return LivestreamService.instance;
    }

    public async fetchTwitch(): Promise<void> {
        const twitchApi = await TwitchAPI.getInstance();
        this.twitchStreams = await twitchApi.fetchLiveStreams(
            getRegisteredPlayers()
                .filter(p => p.twitch_user_id != null)
                .map(p => p.twitch_user_id!)
        )
        this.lastTwitchFetch = Date.now();
    }

    public async getLivestreams(): Promise<Livestream[]> {
        if ((Date.now() - this.lastTwitchFetch) > TWITCH_CACHE_DURATION) {
            await this.fetchTwitch();
        }
        return this.twitchStreams;
    }

}