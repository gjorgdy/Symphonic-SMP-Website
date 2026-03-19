import type { ClientPlayer } from "$lib/models/player";
import { getClientPlayers, registeredPlayers } from "$lib/data/registeredPlayers";

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in ms

export class PlayerService {

    private lastFetch: number = 0;
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

    public async fetch(): Promise<void> {
        if (registeredPlayers.length > 0) {
            this.players = getClientPlayers();
            this.lastFetch = Date.now();
        }
    }

    public async getClientPlayers(): Promise<ClientPlayer[]> {
        if (this.players.length === 0 || Date.now() - this.lastFetch < CACHE_DURATION) {
            await this.fetch();
        }
        if (this.players.length === 0) {
            throw new Error("Could not fetch players");
        }
        return this.players;
    }

}