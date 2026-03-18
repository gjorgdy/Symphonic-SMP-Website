
export type ResponseVideo = {
    kind: string,
    etag: string,
    id: string,
    statistics: {
        viewCount: number,
        likeCount: number,
        favoriteCount: number,
        commentCount: number,
    }
    snippet: {
        publishedAt: string,
        channelId: string,
        title: string,
        description: string,
        thumbnails: {
            maxres: {
                url: string,
            }
        },
        channelTitle: string,
        liveBroadcastContent: string,
        publishTime: string
    },
    contentDetails: {
        duration: string,
    }
}

export type VideoSearchResult = {
    kind: string,
    etag: string,
    id: {
        kind: string,
        videoId: string
    }
}

export type Channel = {
    kind: "youtube#channel",
    etag: string,
    id: string,
    snippet: {
        title: string,
        description: string,
        customUrl: string,
        publishedAt: string,
        thumbnails: Record<string, {
            url: string,
            width: number,
            height: number,
        }>,
        defaultLanguage: string,
        localized: {
            title: string,
            description: string,
        },
        country: string,
    },
    contentDetails: {
        relatedPlaylists: {
            likes: string,
            favorites: string,
            uploads: string,
        },
    },
    statistics: {
        viewCount: string,
        // YouTube may round this value to three significant figures.
        subscriberCount: string,
        hiddenSubscriberCount: boolean,
        videoCount: string,
    },
    topicDetails: {
        topicIds: string[],
        topicCategories: string[],
    },
    status: {
        privacyStatus: string,
        isLinked: boolean,
        longUploadsStatus: string,
        madeForKids: boolean,
        selfDeclaredMadeForKids: boolean,
    },
    brandingSettings: {
        channel: {
            title: string,
            description: string,
            keywords: string,
            trackingAnalyticsAccountId: string,
            unsubscribedTrailer: string,
            defaultLanguage: string,
            country: string,
        },
        watch: {
            textColor: string,
            backgroundColor: string,
            featuredPlaylistId: string,
        },
    },
    auditDetails: {
        overallGoodStanding: boolean,
        communityGuidelinesGoodStanding: boolean,
        copyrightStrikesGoodStanding: boolean,
        contentIdClaimsGoodStanding: boolean,
    },
    contentOwnerDetails: {
        contentOwner: string,
        timeLinked: string,
    },
    localizations: Record<string, {
        title: string,
        description: string,
    }>,
}

export class YouTube {

    static channelUrlFromId(id: string): string {
        return `https://www.youtube.com/channel/${id}`;
    }

    static channelUrlFromHandle(handle: string): string {
        return `https://www.youtube.com/@${handle.replace(/^@/, '')}`;
    }

    static formatDuration(isoDuration: string) {
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '00:00:00';

        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        const seconds = parseInt(match[3] || '0', 10);

        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        if (hours > 0) {
            return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        } else {
            return `${paddedMinutes}:${paddedSeconds}`;
        }
    }

    static getRelativeTime(dateString: string): string {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        const time = new Date(dateString).getTime();
        const now = new Date().getTime();
        const diffInSeconds = (time - now) / 1000;

        const absDiff = Math.abs(diffInSeconds);
        if (absDiff < 60) {
            return rtf.format(Math.round(diffInSeconds), 'second');
        } else if (absDiff < 3600) {
            return rtf.format(Math.round(diffInSeconds / 60), 'minute');
        } else if (absDiff < 86400) {
            return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
        } else if (absDiff < 2592000) {
            // Approx 30 days
            return rtf.format(Math.round(diffInSeconds / 86400), 'day');
        } else if (absDiff < 31536000) {
            // Approx 365 days
            return rtf.format(Math.round(diffInSeconds / 2592000), 'month');
        } else {
            return rtf.format(Math.round(diffInSeconds / 31536000), 'year');
        }
    }

    static async fetchChannelId(key: string, handle: string): Promise<string | undefined> {
        const url = `https://www.googleapis.com/youtube/v3/channels?key=${key}&forHandle=${handle}&part=snippet`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error(await response.json());
            // return [];
        }
        const data = await response.json();
        return (data.items as Channel[]).map(c => c.id).find(id => id !== undefined) || undefined;
    }

    static async fetchLatestVideos(key: string, channelId: string, filter: boolean = false): Promise<VideoSearchResult[]> {
        let url = `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${channelId}&part=id&order=date&maxResults=10&type=video`;
        if (filter) {
            url += `&q=symphonic`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            console.error(await response.json());
            return [];
        }
        const data = await response.json();
        return data.items as VideoSearchResult[];
    }

    static async fetchVideoDetails(key: string, videoIds: string[]): Promise<ResponseVideo[]> {
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${key}&id=${videoIds.join(",")}&part=id,snippet,statistics,contentDetails`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error(await response.json());
            return [];
        }
        let videos = (await response.json()).items as ResponseVideo[];
        videos = [...videos].sort((a, b) => {
            return (new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime());
        });
        return videos;
    }
}