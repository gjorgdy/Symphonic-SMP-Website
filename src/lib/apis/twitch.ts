import {env} from '$env/dynamic/private'
import type {Livestream} from "$lib/models/livestream";

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

type TwitchChannel = {
    broadcaster_id: string,
    broadcaster_login: string,
    broadcaster_name: string,
}

export class TwitchAPI {

    private static expiresAt: number = 0;
    private static token?: TwitchToken;

    private static async getToken(): Promise<TwitchToken> {
        if (this.token && this.expiresAt > Date.now()) {
            return this.token;
        }
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
        this.token = data;
        this.expiresAt = Date.now() + data.expires_in;
        return data;
    }

    public static async fetchChannels(channelIds: string[]): Promise<Map<String, String>> {
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

    public static async fetchLiveStreams(channelIds: string[]): Promise<Map<String, Livestream>> {
        const response = await fetch(`https://api.twitch.tv/helix/streams?${channelIds.map(id => `user_id=`+id).join('&')}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + (await this.getToken()).access_token,
                "Client-Id": env.TWITCH_CLIENT_ID
            }
        });
        const streams: TwitchStream[] = (await response.json()).data;
        if (streams == undefined) return new Map();
        const streamMap: Map<String, Livestream> = new Map();
        for (const stream of streams) {
            streamMap.set(stream.user_login, {
                url: "https://twitch.tv/" + stream.user_login,
                creator_url: "https://twitch.tv/" + stream.user_login,
                creator_name: stream.user_name,
                title: stream.title,
                thumbnail_url: stream.thumbnail_url.replace("{width}", "320").replace("{height}", "180"),
                viewcount: stream.viewer_count,
                started_at: new Date(stream.started_at),
            } as Livestream
            );
        }
        return streamMap;
    }

}