import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({url }) => {

	let discs = [
		"13", "cat", "blocks", "chirp", "far", "mall", "mellohi",
		"stal", "strad", "ward", "11", "pigstep", "otherside",
		"5", "relic", "creator", "creator_music_box", "precipice", "tears", "lava chicken"
	];

	let favicon;
	let disc = url.searchParams.get('disc');
	if (disc) {
		favicon = disc;
		discs = Array.from({ length: 2 * discs.length }, () => disc);
	} else {
		favicon = discs[Math.floor(Math.random() * discs.length)];
		discs = discs.concat(discs);
	}

	const logo = "/assets/logo_text.png";

    return {
		disc: disc,
		discs: discs,
		logo: logo,
		favicon: favicon
	};
};