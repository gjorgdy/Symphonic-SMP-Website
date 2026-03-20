import type {Video} from "$lib/models/video";

export type Settings = {
    onlySymphonic: boolean,
    livestreams: boolean,
    shorts: boolean,
}

export class ContentUtils {

    static filterVideos(videos: Video[], settings: Settings): Video[] {
        if (settings.onlySymphonic) {
            videos = videos.filter(video => video.symphonic);
        }
        if (!settings.livestreams) {
            videos = videos.filter(video => !video.live);
        }
        if (!settings.shorts) {
            videos = videos.filter(video => !video.short);
        }
        return videos;
    }

}