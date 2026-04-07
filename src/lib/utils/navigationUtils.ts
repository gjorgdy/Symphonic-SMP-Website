import {goto} from "$app/navigation";
import {page} from "$app/state";

export type Panel = "symphonists" | "content" | "links";

export async function setDisc(disc?: string): Promise<void> {
    const url = new URL(page.url);
    if (disc) {
        url.searchParams.set('disc', disc);
    } else {
        url.searchParams.delete('disc');
    }
    await goto(url.pathname + url.search);
}

export async function setPanel(panel: Panel): Promise<void> {
    const url = new URL(page.url);
    if (panel) {
        url.searchParams.set('p', panel);
    } else {
        url.searchParams.delete('p');
    }
    await goto(url.pathname + url.search);
}