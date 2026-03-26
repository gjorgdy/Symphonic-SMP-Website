import {env} from '$env/dynamic/private'
import type {Livestream, VOD} from "$lib/models/content";

type TwitchToken = {
    access_token: string;
    expires_in: number;
    token_type: "bearer";
}

type TwitchStream = {
    id: string,
    user_id: string,
    user_login: string,
    user_name: string,
    game_id: string,
    game_name: string,
    type: string,
    title: string,
    tags: string[],
    viewer_count: number,
    started_at: number,
    language: string,
    thumbnail_url: string,
    tag_ids: string[],
    is_mature: boolean
}

type TwitchVod = {
    id: string,
    stream_id: string,
    user_id: string,
    user_login: string,
    user_name: string,
    title: string,
    description: string,
    published_at: number,
    thumbnail_url: string,
    view_count: number,
    duration: string,
    type: string
}

type TwitchChannel = {
    broadcaster_id: string,
    broadcaster_login: string,
    broadcaster_name: string,
}

export class TwitchAPI {

    private static expiresAt: number = 0;
    private static token?: TwitchToken;

    public static async init() {
        const _ = await this.getToken();
    }

    private static async getToken(): Promise<TwitchToken> {
        if (TwitchAPI.token && TwitchAPI.expiresAt > Date.now()) {
            return TwitchAPI.token;
        }
        TwitchAPI.expiresAt = Date.now() + (5000);
        console.log("Fetching Twitch token...");
        const response = await fetch("https://id.twitch.tv/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: env.TWITCH_CLIENT_ID,
                client_secret: env.TWITCH_SECRET,
                grant_type: "client_credentials",
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to get Twitch token: ${response.status} ${response.statusText}`);
        }
        const data = await response.json() as TwitchToken;
        TwitchAPI.token = data;
        TwitchAPI.expiresAt = Date.now() + data.expires_in;
        return data;
    }

    public static async fetchChannels(channelIds: string[]): Promise<Map<String, String>> {
        const url = `https://api.twitch.tv/helix/channels?${channelIds.map(id  => `broadcaster_id=`+id).join('&')}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + (await TwitchAPI.getToken()).access_token,
                "Client-Id": env.TWITCH_CLIENT_ID
            }
        });
        if (!response.ok) {
            console.error(`Failed to fetch Twitch channels: ${response.status} ${response.statusText}`);
            return new Map<String, String>();
        }
        const channels: TwitchChannel[] = (await response.json()).data;
        if (channels == undefined) return new Map();
        const channelMap: Map<String, String> = new Map();
        for (const channel of channels) {
            channelMap.set(channel.broadcaster_id, channel.broadcaster_login);
        }
        return channelMap;
    }

    public static async fetchLiveStreams(channelIds: string[]): Promise<Map<String, Livestream>> {
        const response = await fetch(`https://api.twitch.tv/helix/streams?${channelIds.map(id => `user_id=`+id).join('&')}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + (await TwitchAPI.getToken()).access_token,
                "Client-Id": env.TWITCH_CLIENT_ID
            }
        });
        const streams: TwitchStream[] = (await response.json()).data;
        if (streams == undefined) return new Map();
        const streamMap: Map<String, Livestream> = new Map();
        for (const stream of streams) {
            streamMap.set(stream.user_login, {
                title: stream.title,
                thumbnail_url: stream.thumbnail_url.replace("{width}", "320").replace("{height}", "180"),
                url: "https://twitch.tv/" + stream.user_login,
                creator: {
                    name: stream.user_name,
                    url: "https://twitch.tv/" + stream.user_login,
                    twitch_user_id: stream.user_id,
                },
                viewers: stream.viewer_count,
                started_at: new Date(stream.started_at),
                symphonic: stream.title?.toLowerCase().includes("symphonic")
            } as Livestream
            );
        }
        return streamMap;
    }

    public static async fetchVods(channelId: string): Promise<VOD[]> {
        const response = await fetch(`https://api.twitch.tv/helix/videos?user_id=${channelId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + (await TwitchAPI.getToken()).access_token,
                "Client-Id": env.TWITCH_CLIENT_ID
            }
        });
        const vods: TwitchVod[] = (await response.json()).data;
        if (vods == undefined) return [];
        return vods.map(vod => {
            return {
                title: vod.title,
                thumbnail_url: vod.thumbnail_url.replace("%{width}", "320").replace("%{height}", "180"),
                url: "https://twitch.tv/" + vod.user_login,
                creator: {
                    name: vod.user_name,
                    url: "https://twitch.tv/" + vod.user_login,
                    twitch_user_id: vod.user_id,
                },
                published_at: new Date(vod.published_at),
                duration: vod.duration,
                symphonic: vod.title?.toLowerCase().includes("symphonic"),
                views: vod.view_count,
                type: "vod"
            } as VOD;
        });
    }

}