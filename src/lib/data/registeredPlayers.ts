import type { Player } from "$lib/models/player";

export const registeredPlayers: Record<string, Player> = {
    // 1
    "relic": {
        nickname: "Mango",
        minecraft_uuid: "76cdf038-192c-40b6-9bda-1ebd2cf2b76e",
        youtube_user_id: "UCkOmLeTO15bd62b0lGpotPw",
        twitch_user_id: "1009008037",
    },
    // 2
    "mall": {
        nickname: "Queen",
        minecraft_uuid: "8c874e47-e28f-4f2a-ad61-1e0d7287c8d6",
        youtube_user_id: "UCvjzRBIJhQrPvMoCZnrVqTQ",
        twitch_user_id: "533754051",
    },
    // 3
    "pigstep": {
        nickname: "Pig(step)",
        minecraft_uuid: "c574ca17-ed27-4cb6-a7fa-841b47dc1fa7",
        youtube_user_id: "UCcVXBFM1JNvmCDai6ggbx1w",
        twitch_user_id: "430489413",
    },
    // 4
    "11": {
        nickname: "nd",
        minecraft_uuid: "56593600-6d32-414d-b8b8-4f1bc63eb897",
        youtube_user_id: "UCiq_HhVKx3RZdhT1MCDyMWg",
    },
    // 5
    "wait": {
        nickname: "Vek",
        minecraft_uuid: "ee429c37-9b90-48b8-b5bf-39aca575215a",
        youtube_user_id: "UCbRx4MmSYesmkOdS2GPC1Iw",
        twitch_user_id: "776781616",
    },
    // 6
    "blocks": {
        nickname: "spaarmot",
        minecraft_uuid: "1cbc7aa6-0943-4917-afbc-fb208354fdcc",
        youtube_user_id: "UCYMsMDZDL5KaiGlzZH4J3FA",
        twitch_user_id: "1283217012",
    },
    // 7
    "stal": {
        nickname: "𝐃xrk",
        minecraft_uuid: "44da6542-b7da-4767-ab32-7257b626f5f9",
        youtube_user_id: "UCU9DFNevHqYH1QeMKJ0Ageg",
        twitch_user_id: "435265126"
    },
    // 8
    "tears": {
        nickname: "MiaTwintania",
        minecraft_uuid: "718a897e-b7b0-409a-8928-8bcd84939d42",
        youtube_user_id: "UCc4lgK1OebFVzP4YvcW_zIg",
        twitch_user_id: "1392643894",
    },
    // 9
    "cat": {
        nickname: "Obed C.",
        minecraft_uuid: "dafef28c-01eb-4f05-afe2-77bf52ad43e1",
        youtube_user_id: "UC9WBQuqPduEp5Ej4-8Dcekg",
    },
    // 10
    "ward": {
        nickname: "Potato",
        minecraft_uuid: "7856b64c-33fc-457c-8867-16c59520c568",
        youtube_user_id: "UCw6vWcA439XsqLKwyKk_QAw",
        twitch_user_id: "240000414",
    },
    // 11
    "13": {
        nickname: "Novaphain",
        minecraft_uuid: "b6bb5fe9-fc9c-40ff-a35b-45bead1c1b0b",
        youtube_user_id: "UCvrRc--0d_KKyO0Qtl7OuFg",
        twitch_user_id: "824430416",
    },
    // 12
    "far": {
        nickname: "Brezey",
        minecraft_uuid: "6b6d874e-ac65-406f-a102-ae53f62a955e",
        youtube_user_id: "UCm4KwMaLE6ghE049Er6p_Wg",
    },
    // 13
    "strad": {
        nickname: "Bypass",
        minecraft_uuid: "075f1a03-b38c-40f4-af50-f163bd3cf07f",
        youtube_user_id: "UCxw5Qw2K1TO_0yVU72AYybw",
        twitch_user_id: "222201152",
    },
    // 14
    "creator": {
        nickname: "Creepycrawlykeeper",
        minecraft_uuid: "c1ffa8e7-4c32-4129-9614-45c3d68a2499",
        youtube_user_id: "UCmjsZbCwmhyLN9HYT57K-gQ",
    },
    // 15
    "mellohi": {
        nickname: "Laynii Bugg",
        minecraft_uuid: "ca4441ab-176b-4a83-a2f0-2902f795a7dc",
        youtube_user_id: "UCVwS0uWcjTmiDrftGOmxPZw",
    },
    // 16
    "chirp": {
        nickname: "LightningBug",
        minecraft_uuid: "645fef66-80eb-4fb6-b37e-6ae4d02c5126",
        youtube_user_id: "UChZU2rR1XaQmcttuj1iWwXg",
    },
    // 17
    "otherside": {
        nickname: "Luminacato",
        minecraft_uuid: "59e02951-b0da-4cbd-a5a1-79a15467cf60",
        youtube_user_id: "UCj655KbAoUJ9QW9QlVhwxZg",
        twitch_user_id: "1418258452",
    },
    // 18
    "5": {
        nickname: "SkyButter",
        minecraft_uuid: "ec14aae8-e955-44da-ae5a-202b264613bc",
        youtube_user_id: "UCyMbvrIlPfXEE1nSt0YcECQ",
        twitch_user_id: "838789208",
    },
    // 19
    "creator_music_box": {
        nickname: "Whimzy",
        minecraft_uuid: "afbc60d8-5238-4dd4-87e3-86212e5a572f",
        youtube_user_id: "UClplO1SnXir3cJ6gqgx4DnA",
        twitch_user_id: "1230168736",
    },
    // // 20
    // "lava chicken": {
    //     nickname: "Chicken",
    // },
    // 21
    "precipice": {
        nickname: "Sky",
        minecraft_uuid: "0ae2a0d9-2e5a-4139-bfa2-b12978e90fa2",
        youtube_user_id: "UC8D7amKVwviDtMPYjficUUA",
        twitch_user_id: "646087429",
    }
}

export function getRegisteredPlayers(): Player[] {
    return Object.values(registeredPlayers);
}