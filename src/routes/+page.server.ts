import type {PageServerLoad} from './$types';
import { GOOGLE_KEY } from '$env/static/private';
import {type VideoSearchResult, YouTube} from "$lib/apis/youtube";
import {getClientPlayers, players} from "$lib/data/players";
import type {HandlePlatform, IdPlatform} from "$lib/models/player";

export const load: PageServerLoad = async () => {

    const youtubeChannels: (HandlePlatform | IdPlatform)[] = players.filter(p => p.youtube).map(p => p.youtube!);

    let latestVideos: VideoSearchResult[] = []
    for (const channel of youtubeChannels) {
        const id = channel?.id ?? await YouTube.fetchChannelId(GOOGLE_KEY, channel.handle!);
        if (id == undefined) continue;
        latestVideos = latestVideos.concat(await YouTube.fetchLatestVideos(GOOGLE_KEY, id, true));
    }
    const videoStats = await YouTube.fetchVideoDetails(GOOGLE_KEY, latestVideos.map(item => item.id.videoId));

    const videos: Video[] = []
    for (const data of videoStats) {
        try {
            videos.push({
                name: data.snippet.title,
                url: "https://www.youtube.com/watch?v=" + data.id,
                creator: {
                    name: data.snippet.channelTitle,
                    url: "https://www.youtube.com/channel/" + data.snippet.channelId
                },
                thumbnail: {
                    url: data.snippet.thumbnails.maxres.url
                },
                duration: YouTube.formatDuration(data.contentDetails.duration),
                views: data.statistics.viewCount,
                likes: data.statistics.likeCount,
                comments: data.statistics.commentCount,
                timestamp: data.snippet.publishedAt
            })
        } catch (e) {
            console.error(`Error processing video data: ${e}`);
        }
    }

    return {
        players: getClientPlayers(),
        videos: videos
    };
};