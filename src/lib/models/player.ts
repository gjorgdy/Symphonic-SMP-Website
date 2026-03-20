export type Player = {
    minecraft?: Minecraft,
    twitch?: HandlePlatform,
    youtube?: IdPlatform | HandlePlatform
}

export type ClientPlayer = Player & {
    display_name: string,
    profile_picture: ProfilePicture,
    live?: Livestream
}

export type IdPlatform = {
    id: string,
    handle?: never,
}

export type HandlePlatform = {
    id?: never,
    handle: string
}

type ProfilePicture = {
    url: string
}

type Minecraft = {
    username: string,
}