export class TimeUtils {

    static getRelativeTimeAgo(date?: Date): string {
        if (!date) return '-';
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        const time = date.getTime();
        const now = new Date().getTime();
        const diffInSeconds = (time - now) / 1000;

        const absDiff = Math.abs(diffInSeconds);
        if (absDiff < 60) {
            return rtf.format(Math.round(diffInSeconds), 'second');
        } else if (absDiff < 3600) {
            return rtf.format(Math.round(diffInSeconds / 60), 'minute');
        } else if (absDiff < 86400) {
            return rtf.format(Math.round(diffInSeconds / 1800) / 2, 'hour');
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

    static getRelativeTime(date?: Date): string {
        if (!date) return '-';

        const time = date.getTime();
        const now = new Date().getTime();
        const diffInSeconds = (time - now) / 1000;

        const absDiff = Math.abs(diffInSeconds);

        let value: number;
        let unit: string;

        if (absDiff < 60) {
            value = Math.round(absDiff);
            unit = 'second';
        } else if (absDiff < 3600) {
            value = Math.round(absDiff / 60);
            unit = 'minute';
        } else if (absDiff < 86400) {
            value = Math.round(absDiff / 1800) / 2;
            unit = 'hour';
        } else if (absDiff < 2592000) {
            // Approx 30 days
            value = Math.round(absDiff / 86400);
            unit = 'day';
        } else if (absDiff < 31536000) {
            // Approx 365 days
            value = Math.round(absDiff / 2592000);
            unit = 'month';
        } else {
            value = Math.round(absDiff / 31536000);
            unit = 'year';
        }

        return `${value} ${unit}${value === 1 ? '' : 's'}`;
    }

    static formatDuration(isoDuration: string, timestampRegex: RegExp) {
        const match = isoDuration.match(timestampRegex);
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

}