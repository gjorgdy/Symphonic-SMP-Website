import type {PlayerDisplay} from "$lib/models/player";
import {registeredPlayers} from "$lib/data/registeredPlayers";

const TWITCH_CACHE_DURATION = 60 * 1000; // 1 minute in ms

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

    public async fetch() {
        this.players = Object.entries(registeredPlayers).map(([disc, player]) => {
            return {
                displayName: player.nickname,
                disc: disc,
                profile_picture_url: "/assets/discs/" + disc + ".png",
                ...player
            } as PlayerDisplay;
        })
        this.players.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    public async getClientPlayers(): Promise<PlayerDisplay[]> {
        if (this.players.length === 0 || (Date.now() - this.lastFetch) < TWITCH_CACHE_DURATION) {
            await this.fetch();
        }
        return this.players;
    }

}