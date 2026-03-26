import type {PlayerDisplay} from "$lib/models/player";
import {getRegisteredPlayers, registeredPlayers} from "$lib/data/registeredPlayers";
import {MinecraftAPI} from "$lib/apis/minecraft";
import {TwitchAPI} from "$lib/apis/twitch";

const PLAYER_CACHE_DURATION = 60 * 60 * 1000; // 60 minutes in ms

export class PlayerService {

    private lastFetch: number = 0;
    private players: PlayerDisplay[] = []

    private static instance: PlayerService;

    private constructor() {
        // Private constructor to prevent direct instantiation
        console.log("PlayerService initialized");
    }

    public static getInstance(): PlayerService {
        if (!PlayerService.instance) {
            PlayerService.instance = new PlayerService();
        }
        return PlayerService.instance;
    }

    public async fetch(): Promise<PlayerDisplay[]> {
        console.log("Fetching player data...");

        const twitchIds = getRegisteredPlayers()
            .filter(p => p.twitch_user_id !== undefined)
            .map(p => p.twitch_user_id!) as string[];
        await TwitchAPI.init();
        const twitchNames = await TwitchAPI.fetchChannels(twitchIds);

        const promisedPlayers = Object.entries(registeredPlayers).map(async ([disc, player]) => {
            return {
                minecraft_name: player.minecraft_uuid !== undefined ? await MinecraftAPI.fetchName(player.minecraft_uuid) : "",
                disc: disc,
                profile_picture_url: "/assets/discs/" + disc + ".png",
                twitch_url: player.twitch_user_id ? "https://twitch.tv/" + twitchNames.get(player.twitch_user_id) : undefined,
                ...player
            } as PlayerDisplay;
        })
        this.players = await Promise.all(promisedPlayers);
        this.players.sort((a, b) => a.nickname.localeCompare(b.nickname));
        return this.players;
    }

    public async getClientPlayers(): Promise<PlayerDisplay[]> {
        if (this.players.length === 0 || (Date.now() - this.lastFetch) < PLAYER_CACHE_DURATION) {
            await this.fetch();
        }
        return this.players;
    }

}