import {env} from '$env/dynamic/private'
import type {Livestream, VOD} from "$lib/models/content";
import {TimeUtils} from "$lib/utils/timeUtils";

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

    static formatDuration(isoDuration: string) {
        return TimeUtils.formatDuration(isoDuration, /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    }

    private expiresAt: number = 0;
    private token?: TwitchToken;
    private tokenPromise?: Promise<TwitchToken>;

    private static _instance: TwitchAPI;

    private constructor() {}

    public static async getInstance(): Promise<TwitchAPI> {
        if (!TwitchAPI._instance) {
            TwitchAPI._instance = new TwitchAPI();
            await TwitchAPI._instance.getToken();
        }
        return TwitchAPI._instance;
    }

    private async getToken(): Promise<TwitchToken> {
        if (this.token && this.expiresAt > Date.now()) {
            return this.token;
        }
        if (this.tokenPromise) {
            return this.tokenPromise;
        }

        this.tokenPromise = this.fetchToken();

        try {
            return await this.tokenPromise;
        } finally {
            this.tokenPromise = undefined;
        }
    }

    private async fetchToken(): Promise<TwitchToken> {
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

        const token = (await response.json()) as TwitchToken;
        this.token = token;
        this.expiresAt = Date.now() + (token.expires_in * 1000) - 5000;
        return token;
    }

    public async fetchChannels(channelIds: string[]): Promise<Map<String, String>> {
        const url = `https://api.twitch.tv/helix/channels?${channelIds.map(id  => `broadcaster_id=`+id).join('&')}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + (await this.getToken()).access_token,
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

    public async fetchLiveStreams(channelIds: string[]): Promise<Livestream[]> {
        const response = await fetch(`https://api.twitch.tv/helix/streams?${channelIds.map(id => `user_id=`+id).join('&')}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + (await this.getToken()).access_token,
                "Client-Id": env.TWITCH_CLIENT_ID
            }
        });
        const streams: TwitchStream[] = (await response.json()).data;
        return streams.map((stream): Livestream => {
            return {
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
                symphonic: stream.title?.toLowerCase().includes("symphonic") ?? false,
                type: "livestream"
            }
        }).toSorted((a, b) => b.started_at.getTime() - a.started_at.getTime());
    }

    public async fetchVods(channelId: string): Promise<VOD[]> {
        const response = await fetch(`https://api.twitch.tv/helix/videos?type=archive&user_id=${channelId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + (await this.getToken()).access_token,
                "Client-Id": env.TWITCH_CLIENT_ID
            }
        });
        const vods: TwitchVod[] = (await response.json()).data;
        if (vods == undefined) return [];
        return vods.filter(video => video.view_count > 0).map(vod => {
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
                duration: TwitchAPI.formatDuration(vod.duration),
                symphonic: vod.title?.toLowerCase().includes("symphonic") ?? false,
                views: vod.view_count,
                type: "vod"
            } as VOD;
        });
    }

}