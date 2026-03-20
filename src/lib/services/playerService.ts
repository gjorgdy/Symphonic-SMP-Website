import type { ClientPlayer } from "$lib/models/player";
import { registeredPlayers } from "$lib/data/registeredPlayers";
import { TwitchAPI } from "$lib/apis/twitch";

const TWITCH_CACHE_DURATION = 60 * 1000; // 1 minute in ms

export class PlayerService {

    private lastTwitchFetch: number = 0;
    private players: ClientPlayer[] = []

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

    public async fetchTwitch(): Promise<void> {
        console.log("Fetching player data...");

        const streams = await TwitchAPI.fetchLiveStreams(registeredPlayers
            .filter(p => p.twitch)
            .map(p => p.twitch!.handle))
        this.players = registeredPlayers.map(
            player => {
                return {
                    display_name: player.minecraft?.username ?? "unknown",
                    live: streams.get(player.twitch?.handle ?? "") ?? undefined,
                    ...player
                } as ClientPlayer
            }
        );
        this.lastTwitchFetch = Date.now();
    }

    public async getClientPlayers(): Promise<ClientPlayer[]> {
        if (this.players.length === 0 || (Date.now() - this.lastTwitchFetch) < TWITCH_CACHE_DURATION) {
            await this.fetchTwitch();
        }
        if (this.players.length === 0) {
            throw new Error("Could not fetch players");
        }
        return this.players;
    }

}