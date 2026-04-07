import type {UUID} from "node:crypto";

type MinecraftPlayer = {
    name: string,
    id: UUID,
}

export class MinecraftAPI {

    public static async fetchName(minecraftUUID: UUID): Promise<string> {
        console.log("[VER] Fetching Minecraft name for " + minecraftUUID);

        const response = await fetch(
            `https://api.minecraftservices.com/minecraft/profile/lookup/${minecraftUUID}`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const player = await response.json() as MinecraftPlayer;
        return player.name;
    }

}