import type { LayoutServerLoad } from './$types';
import { getRegisteredDiscs, getRegisteredPlayerByNickname } from '$lib/data/registeredPlayers';
import type { PlayerDisplay } from '$lib/models/player';
import type { Livestream, Video } from '$lib/models/content';
import { PlayerService } from '$lib/services/playerService';
import {registeredPlayers} from "$lib/data/registeredPlayers";
import { LivestreamService } from '$lib/services/livestreamService';
import { VideoService } from '$lib/services/videoService';
import { type Cookies, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export type IndexServerLoadProps = {
	players: Promise<PlayerDisplay[]>;
	content: Promise<ContentCollection>;
};

export type ContentCollection = {
	livestreams: Livestream[];
	videos: Video[];
};

function handleCookies(cookies: Cookies, disc: string | null) {
	const discHistoryCookie = cookies.get('discs');
	const discHistory: string[] = discHistoryCookie?.split('-') ?? [];
	if (disc) discHistory.push(disc);
	if (discHistory.length > 0) {
		const l = discHistory.length;
		const discHistoryCookie = discHistory.slice(-5, l).join('-');
		cookies.set('discs', discHistoryCookie, { path: '/' });
		if (discHistory.length == 5 && discHistoryCookie === env.DISC_CODE) {
			cookies.delete('discs', { path: '/' });
			redirect(302, `/c/` + discHistoryCookie);
		}
	}
}

export const load: LayoutServerLoad = ({ url, cookies, params }) => {
	let discs: string[];
  let favicon;
  let selectedPlayer = params.disc
    ? registeredPlayers[params.disc]
    : null;
  let disc = params.disc
  let playerUrl = false;
	const panel = url.searchParams.get('p');

  if (params.disc != null && selectedPlayer == null) {
    const player = getRegisteredPlayerByNickname(params.disc)
    if (player) {
      disc = player.disc
      selectedPlayer = player
      playerUrl = true;
      // redirect(302, `/${player.disc!}`);
    } else {
      redirect(302, `/`);
    }
	}

	if (selectedPlayer) {
		favicon = disc;
		discs = Array.from({ length: 20 }, () => disc!);
	} else {
		discs = getRegisteredDiscs();
		favicon = discs[Math.floor(Math.random() * discs.length)];
	}

	handleCookies(cookies, params.disc ?? "cat");

	const logo = '/assets/logo_text.png';

	const livestreamsPromise = LivestreamService.getInstance().getLivestreams();
	const videosPromise = VideoService.getInstance().getRecentVideos();

	return {
		panel: panel,
    disc: disc,
		selectedPlayer: selectedPlayer,
		discs: discs,
    logo: logo,
		playerUrl: playerUrl,
		favicon: favicon,
		players: PlayerService.getInstance().getClientPlayers(),
		content: Promise.all([livestreamsPromise, videosPromise]).then(([livestreams, videos]) => ({
			livestreams,
			videos
		}))
	};
};
