import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {

	let discs = [
		"13", "cat", "blocks", "chirp", "far", "mall", "mellohi",
		"stal", "strad", "ward", "11", "pigstep", "otherside",
		"5", "relic", "creator", "creator (music box)", "precipice", "tears", "lava chicken"
	];
	discs = discs.concat(discs);

	const logo = "/assets/logo_text.png";

    return {
		discs: discs,
		logo: logo
	};
};