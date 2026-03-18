import type {PageServerLoad} from './$types';
import { GOOGLE_KEY } from '$env/static/private';
import { YouTube } from "$lib/apis/youtube";

export const load: PageServerLoad = async () => {

    const channelIds = [
        "UCkOmLeTO15bd62b0lGpotPw", // mang0
        "UCcVXBFM1JNvmCDai6ggbx1w"  // pig
    ]

    const channels = await YouTube.fetchChannelDetails(GOOGLE_KEY, channelIds, ["@itsnd20"]);
    const latestVideos = await YouTube.fetchLatestVideos(GOOGLE_KEY, channels.map(channel => channel.id), true);
    const videoStats = await YouTube.fetchVideoDetails(GOOGLE_KEY, latestVideos.map(item => item.id.videoId));

    const videos: Video[] = []
    for (const data of videoStats) {
        console.log(data.snippet.thumbnails)
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

    const players: Player[] = [
        {
          name: "nd",
          minecraft_name: "nd?",
          youtube: "https://www.youtube.com/@itsnd20"
        },
        {
            name: "Mang0Sorbet",
            minecraft_name: "Mang0Sorbet",
            twitch: "https://www.twitch.tv/mang0sorbet",
            youtube: "https://www.youtube.com/channel/UCkOmLeTO15bd62b0lGpotPw",
            live: "youtube"
        },
        {
            name: "Potato",
            minecraft_name: "potato_aim_seven",
            twitch: "https://www.twitch.tv/potato_aim_seven",
            youtube: "",
            live: "twitch"
        },
        {
            name: "spaarmot",
            minecraft_name: "spaarmot"
        }
    ]

    for (let i: number = 0; i < 20; i++) {
        players.push(
            {
                name: "test",
                minecraft_name: "mc_test"
            }
        );
    }

    return {
        players: players,
        videos: videos
    };
};