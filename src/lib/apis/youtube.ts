import {env} from '$env/dynamic/private';
import type {Livestream} from "$lib/models/livestream";

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
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '00:00:00';

        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        const seconds = parseInt(match[3] || '0', 10);

        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        if (hours > 0) {
            return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        } else {
            return `${paddedMinutes}:${paddedSeconds}`;
        }
    }

    static isShort(isoDuration: string) {
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '00:00:00';

        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        return hours == 0 && minutes == 0;
    }

    static async fetchLivestreams(): Promise<Livestream[]> {

        return [];
    }

    static async fetchLatestVideos(channelId: string): Promise<VideoListResponse[]> {
        let url = `https://youtube.googleapis.com/youtube/v3/playlistItems?key=${env.GOOGLE_KEY}&part=contentDetails&maxResults=25&playlistId=${channelId.replace('UC', 'UU')}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        const playlistItems = data.items as YoutubePlaylistItem[];
        return await this.fetchVideoDetails(playlistItems.map(item => item.contentDetails.videoId));
    }

    private static async fetchVideoDetails(videoIds: string[]): Promise<VideoListResponse[]> {
        // console.log(videoIds);
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${env.GOOGLE_KEY}&id=${videoIds.join(",")}&part=id,snippet,statistics,contentDetails,liveStreamingDetails&maxResults=25`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return (await response.json()).items as VideoListResponse[];
    }
}