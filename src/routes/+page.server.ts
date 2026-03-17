import type {PageServerLoad} from './$types';

export const load: PageServerLoad = async () => {

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

    const videos: Video[] = [
        {
            name: "test video",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            creator: {
                name: "creator",
                url: ""
            },
            thumbnail: {
                url: "https://i.ytimg.com/vi/C0WM1HmJrWQ/mqdefault.jpg"
            },
            views: 0,
            likes: 0,
            comments: 0,
            timestamp: 0
        }
    ]

    for (let i: number = 0; i < 20; i++) {
        videos.push(
            videos[0]
        );
    }

    return {
        players: players,
        videos: videos
    };
};