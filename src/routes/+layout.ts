import type { LayoutLoad } from './$types';
import { getRegisteredDiscs } from "$lib/data/registeredPlayers";

export const load: LayoutLoad = ({url}) => {

	let discs: string[];
	let favicon;
	let disc = url.searchParams.get('disc');

	if (disc) {
		favicon = disc;
		discs = Array.from({ length: 40 }, () => disc);
	} else {
		discs = getRegisteredDiscs();
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