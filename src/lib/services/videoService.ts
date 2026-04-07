import {YouTubeAPI} from "$lib/apis/youtube";
import {getRegisteredPlayers} from "$lib/data/registeredPlayers";
import type {Video} from "$lib/models/content";
import {TwitchAPI} from "$lib/apis/twitch";

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in ms

export class VideoService {

    private lastFetch: number = 0;
    private recentVideos: Video[] = []

    private static instance: VideoService;

    private constructor() {
        // Private constructor to prevent direct instantiation
        console.log("VideoService initialized");
    }

    public static getInstance(): VideoService {
        if (!VideoService.instance) {
            VideoService.instance = new VideoService();
        }
        return VideoService.instance;
    }

    public async fetch(): Promise<Video[]> {
        console.log("Fetching video data...");

        let promisedVideos = getRegisteredPlayers()
            .filter(player => player.youtube_user_id !== undefined)
            .map(player => player.youtube_user_id!)
            .map(YouTubeAPI.fetchLatestVideos);

        const twitchApi = await TwitchAPI.getInstance();
        let promisedVods = getRegisteredPlayers()
            .filter(player => player.twitch_user_id !== undefined)
            .map(player => player.twitch_user_id!)
            .map(id => twitchApi.fetchVods(id));

        let videos = (await Promise.all(promisedVideos.concat(promisedVods)))
            .flat().sort((a, b) => {
                return (new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
            });

        if (videos.length > 0) {
            this.recentVideos = videos;
            this.lastFetch = Date.now();
        }

        return this.recentVideos;
    }

    public async getRecentVideos(): Promise<Video[]> {
        try {
            if (this.recentVideos.length === 0 || Date.now() - this.lastFetch > CACHE_DURATION) {
                return this.fetch();
            }
        } catch (e) {
            console.error(`Error fetching video data: ${e}`);
        }
        return this.recentVideos;
    }

}