import type {PageServerLoad} from './$types';
import {env} from '$env/dynamic/private';
import {error} from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    if (params.key !== env.DISC_CODE) error(404);
    return {
        url: env.SECRET_VIDEO_URL
    };
};