import {type VideoListResponse, YouTubeAPI} from "$lib/apis/youtube";
import {getRegisteredPlayers} from "$lib/data/registeredPlayers";
import type {Video} from "$lib/models/video";

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
        console.log("Fetching video data...");

        let promisedVideos = getRegisteredPlayers()
            .filter(player => player.youtube_user_id !== undefined)
            .map(async (player) =>
        {
            return (await YouTubeAPI.fetchLatestVideos(player.youtube_user_id!))
                .filter(video => video.contentDetails.duration !== "P0D")
                .map(data => {
                return {
                    name: data.snippet.title,
                    url: "https://www.youtube.com/watch?v=" + data.id,
                    creator: {
                        name: data.snippet.channelTitle,
                        url: "https://www.youtube.com/channel/" + data.snippet.channelId
                    },
                    thumbnail: {
                        url: data.snippet.thumbnails.maxres?.url ?? data.snippet.thumbnails.high?.url ?? ""
                    },
                    duration: YouTubeAPI.formatDuration(data.contentDetails.duration),
                    views: data.statistics.viewCount,
                    likes: data.statistics.likeCount,
                    comments: data.statistics.commentCount,
                    timestamp: new Date(data.snippet.publishedAt),
                    live: data.snippet.liveBroadcastContent != "none" || data.liveStreamingDetails !== undefined,
                    symphonic: data.snippet.title.toLowerCase().includes('symphonic')
                        || data.snippet.description.toLowerCase().includes('symphonic'),
                    short: YouTubeAPI.isShort(data.contentDetails.duration)
                } as Video
            })
        });

        let videos = (await Promise.all(promisedVideos))
            .flat().sort((a, b) => {
                return (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            });

        if (videos.length > 0) {
            this.recentVideos = videos;
            this.lastFetch = Date.now();
        }
    }

    public async getRecentVideos(): Promise<Video[]> {
        try {
            if (this.recentVideos.length === 0 || Date.now() - this.lastFetch > CACHE_DURATION) {
                await this.fetch();
            }
        } catch (e) {
            console.error(`Error fetching video data: ${e}`);
        }
        return this.recentVideos;
    }

}