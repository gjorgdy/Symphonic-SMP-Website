import type {UUID} from "node:crypto";

export type Player = {
    nickname: string,
    minecraft_uuid?: UUID,
    twitch_user_id?: string,
    youtube_user_id?: string,
}

export type PlayerDisplay = Player & {
    minecraft_name: string,
    disc: string,
    profile_picture_url?: string,
    twitch_url?: string,
}