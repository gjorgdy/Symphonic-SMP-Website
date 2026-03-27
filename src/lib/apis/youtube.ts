import {env} from '$env/dynamic/private';
import type {Short, Video, VOD} from "$lib/models/content";
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
        thumbnails: Record<string, {url: string, width: number, height: number}>,
        channelTitle: string,
        liveBroadcastContent: "live" | "none" | "upcoming",
        publishTime: string
    },
    contentDetails: {
        duration: string,
        relatedPlaylists: object
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
        videoPublishedAt: string
    },
}

export class YouTubeAPI {

    static formatDuration(isoDuration: string) {
        return TimeUtils.formatDuration(isoDuration, /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    }

    private static isShort(videoResponse: VideoListResponse) {
        const match = videoResponse.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '00:00:00';

        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        const width = videoResponse.snippet.thumbnails.medium?.width ?? 1;
        const height = videoResponse.snippet.thumbnails.medium?.height ?? 1;
        // if (hours == 0 && minutes <= 3) {
        //     console.log(videoResponse.snippet.title + " : " + videoResponse.contentDetails.relatedPlaylists);
        // }
        return hours == 0 && minutes <= 3 && (width / height) <= 0.5625;
    }

    static async fetchLatestVideos(channelId: string): Promise<Video[]> {
        const videoIds = await YouTubeAPI.fetchVideoIds(channelId.replace('UC', 'UU'));
        if (videoIds.length == 0) return [];
        const shortIds = await YouTubeAPI.fetchVideoIds(channelId.replace('UC', 'UUSH'));
        try {
            const videoDetails = await YouTubeAPI.fetchVideoDetails(videoIds);
            return videoDetails
                .filter(video => video.contentDetails.duration !== "P0D")
                .map(video => {
                    if (shortIds.includes(video.id)) {
                        return YouTubeAPI.toShortObject(video);
                    }
                    return video.snippet.liveBroadcastContent != "none" || video.liveStreamingDetails !== undefined
                        ? YouTubeAPI.toVodObject(video)
                        : YouTubeAPI.toLongFormVideoObject(video);
                });
        } catch (error) {
            throw new Error(error + " | channel id : " + channelId);
        }
    }

    private static async fetchVideoIds(playlistId: string): Promise<string[]> {
        let url = `https://youtube.googleapis.com/youtube/v3/playlistItems?key=${env.GOOGLE_KEY}&part=contentDetails&maxResults=25&playlistId=${playlistId}`;
        const response = await fetch(url);
        if (response.status === 404) return [];
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return (data.items as YoutubePlaylistItem[]).map(item => item.contentDetails.videoId);
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

    private static toShortObject(data: VideoListResponse): Short {
        return YouTubeAPI.toVideoObject(data, "short") as Short;
    }

    private static toVodObject(data: VideoListResponse): VOD {
        return YouTubeAPI.toVideoObject(data, "vod") as VOD;
    }

    private static toLongFormVideoObject(data: VideoListResponse): Video {
        return YouTubeAPI.toVideoObject(data, "video")
    }

    private static toVideoObject(data: VideoListResponse, type: "vod" | "short" | "video"): Video {
        return {
            title: data.snippet.title,
            url: "https://www.youtube.com/watch?v=" + data.id,
            creator: {
                name: data.snippet.channelTitle,
                youtube_user_id: data.snippet.channelId,
                url: "https://www.youtube.com/channel/" + data.snippet.channelId
            },
            thumbnail_url: data.snippet.thumbnails.medium?.url ?? data.snippet.thumbnails.maxres?.url ?? "",
            duration: YouTubeAPI.formatDuration(data.contentDetails.duration),
            views: data.statistics.viewCount,
            likes: data.statistics.likeCount,
            comments: data.statistics.commentCount,
            published_at: new Date(data.snippet.publishedAt),
            symphonic: data.snippet.title.toLowerCase().includes('symphonic')
                || data.snippet.description.toLowerCase().includes('symphonic'),
            type: type,
        } as Video
    }
}