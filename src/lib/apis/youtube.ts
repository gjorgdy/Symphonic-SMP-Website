import {env} from '$env/dynamic/private';
import type {Video} from "$lib/models/content";
import {TimeUtils} from "$lib/utils/timeUtils";

export type VideoListResponse = {
    kind: "youtube#videoListResponse",
    etag: string,
    id: string,
    statistics: {
        viewCount: number,
        likeCount: number,
        favoriteCount: number,
        commentCount: number,
    }
    snippet: {
        publishedAt: string,
        channelId: string,
        title: string,
        description: string,
        thumbnails: Record<string, {url: string}>,
        channelTitle: string,
        liveBroadcastContent: "live" | "none" | "upcoming",
        publishTime: string
    },
    contentDetails: {
        duration: string,
    },
    liveStreamingDetails?: {
        actualStartTime: string,
        actualEndTime?: string,
        scheduledStartTime: string,
        scheduledEndTime?: string
    }
}

export type YoutubePlaylistItem = {
    kind: "youtube#playlistItem",
    etag: string,
    id: string,
    contentDetails: {
        videoId: string,
        note: string,
        videoPublishedAt: string,
    },
}

export class YouTubeAPI {

    static formatDuration(isoDuration: string) {
        return TimeUtils.formatDuration(isoDuration, /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    }

    private static getVideoType(data: VideoListResponse): string {
        if (data.snippet.liveBroadcastContent != "none" || data.liveStreamingDetails !== undefined) {
            return "vod";
        }
        if (YouTubeAPI.isShort(data.contentDetails.duration)) {
            return "short";
        }
        return "video";
    }

    private static isShort(isoDuration: string) {
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '00:00:00';

        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        return hours == 0 && minutes == 0;
    }

    static async fetchLatestVideos(channelId: string): Promise<Video[]> {
        let url = `https://youtube.googleapis.com/youtube/v3/playlistItems?key=${env.GOOGLE_KEY}&part=contentDetails&maxResults=25&playlistId=${channelId.replace('UC', 'UU')}`;
        const response = await fetch(url);
        if (response.status === 404) return [];
        if (!response.ok) {
            throw new Error(response.statusText + " | channel id : " + channelId);
        }
        const data = await response.json();
        const playlistItems = data.items as YoutubePlaylistItem[];
        const playlistItemIds = playlistItems.map(item => item.contentDetails.videoId);
        try {
            const videoDetails = await YouTubeAPI.fetchVideoDetails(playlistItemIds);
            return videoDetails
                .filter(video => video.contentDetails.duration !== "P0D")
                .map(YouTubeAPI.toVideoObject);
        } catch (error) {
            throw new Error(error + " | channel id : " + channelId);
        }
    }

    private static async fetchVideoDetails(videoIds: string[]): Promise<VideoListResponse[]> {
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${env.GOOGLE_KEY}&id=${videoIds.join(",")}&part=id,snippet,statistics,contentDetails,liveStreamingDetails&maxResults=25`;
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Failed to fetch video details: ${response.status} ${response.statusText} | video ids : ${videoIds.join(",")}`);
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data.items as VideoListResponse[];
    }

    private static toVideoObject(data: VideoListResponse): Video {
        return {
            title: data.snippet.title,
            url: "https://www.youtube.com/watch?v=" + data.id,
            creator: {
                name: data.snippet.channelTitle,
                youtube_user_id: data.snippet.channelId,
                url: "https://www.youtube.com/channel/" + data.snippet.channelId
            },
            thumbnail_url: data.snippet.thumbnails.maxres?.url ?? data.snippet.thumbnails.high?.url ?? "",
            duration: YouTubeAPI.formatDuration(data.contentDetails.duration),
            views: data.statistics.viewCount,
            likes: data.statistics.likeCount,
            comments: data.statistics.commentCount,
            published_at: new Date(data.snippet.publishedAt),
            type: YouTubeAPI.getVideoType(data),
            symphonic: data.snippet.title.toLowerCase().includes('symphonic')
                || data.snippet.description.toLowerCase().includes('symphonic')
        } as Video
    }
}