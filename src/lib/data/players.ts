import type {ClientPlayer, Player} from "$lib/models/player";

export const players: Player[] = [
    {
        minecraft: {
            username: "nd?"
        },
        youtube: {
            handle: "itsnd20"
        }
    },
    {
        minecraft: {
            username: "mypigisawesome"
        },
        youtube: {
            id: "UCcVXBFM1JNvmCDai6ggbx1w"
        }
    },
    {
        minecraft: {
            username: "Mang0Sorbet"
        },
        youtube: {
            id: "UCkOmLeTO15bd62b0lGpotPw"
        },
        twitch: {
            handle: "mang0sorbet"
        }
    }
]

export function getClientPlayers(): ClientPlayer[] {
    return players.map(
        player => {
            return {
                display_name: player.minecraft?.username ?? "unknown",
                live: player.minecraft?.username == "Mang0Sorbet" ? {
                  url: ""
                } : null,
                ...player
            } as ClientPlayer
        }
    );
}