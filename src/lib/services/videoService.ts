import type {HandlePlatform, IdPlatform} from "$lib/models/player";
import {type VideoSearchResult, YouTube} from "$lib/apis/youtube";
import { players } from "$lib/data/players";
import { GOOGLE_KEY } from '$env/static/private';

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

    public async fetch(): Promise<void> {
        const youtubeChannels: (HandlePlatform | IdPlatform)[] = players.filter(p => p.youtube).map(p => p.youtube!);

        let latestVideos: VideoSearchResult[] = []
        for (const channel of youtubeChannels) {
            const id = channel?.id ?? await YouTube.fetchChannelId(GOOGLE_KEY, channel.handle!);
            if (id == undefined) continue;
            latestVideos = latestVideos.concat(await YouTube.fetchLatestVideos(GOOGLE_KEY, id, true));
        }
        const videoStats = await YouTube.fetchVideoDetails(GOOGLE_KEY, latestVideos.map(item => item.id.videoId));

        this.recentVideos = [];
        for (const data of videoStats) {
            try {
                this.recentVideos.push({
                    name: data.snippet.title,
                    url: "https://www.youtube.com/watch?v=" + data.id,
                    creator: {
                        name: data.snippet.channelTitle,
                        url: "https://www.youtube.com/channel/" + data.snippet.channelId
                    },
                    thumbnail: {
                        url: data.snippet.thumbnails.maxres?.url ?? data.snippet.thumbnails.high?.url ?? ""
                    },
                    duration: YouTube.formatDuration(data.contentDetails.duration),
                    views: data.statistics.viewCount,
                    likes: data.statistics.likeCount,
                    comments: data.statistics.commentCount,
                    timestamp: data.snippet.publishedAt
                })
            } catch (e) {
                console.error(`Error processing video data: ${e}`);
                console.error(data);
            }
        }

        this.lastFetch = Date.now();
    }

    public async getRecentVideos(): Promise<Video[]> {
        if (this.recentVideos.length === 0 || Date.now() - this.lastFetch < CACHE_DURATION) {
            await this.fetch();
        }
        return this.recentVideos;
    }

}