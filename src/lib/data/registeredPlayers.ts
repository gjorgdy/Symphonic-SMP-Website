import type { Player } from "$lib/models/player";

export const registeredPlayers: Record<string, Player> = {
    "relic": {
        nickname: "Mango",
        minecraft_uuid: "76cdf038-192c-40b6-9bda-1ebd2cf2b76e",
        youtube_user_id: "UCkOmLeTO15bd62b0lGpotPw",
        twitch_user_id: "1009008037",
    },
    "mall": {
        nickname: "Queen",
        twitch_user_id: "533754051",
    },
    "pigstep": {
        nickname: "Pig(step)",
        youtube_user_id: "UCcVXBFM1JNvmCDai6ggbx1w",
    },
    "11": {
        nickname: "nd",
        youtube_user_id: "UCiq_HhVKx3RZdhT1MCDyMWg",
    },
    "wait": {
        nickname: "Vek",
        youtube_user_id: "UCbRx4MmSYesmkOdS2GPC1Iw",
        twitch_user_id: "776781616",
    }
}

export function getRegisteredPlayers(): Player[] {
    return Object.values(registeredPlayers);
}