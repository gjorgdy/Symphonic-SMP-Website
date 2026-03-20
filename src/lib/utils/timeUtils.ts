export class TimeUtils {

    static getRelativeTime(date?: Date): string {
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

}