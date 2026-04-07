<script lang="ts">
    import PlayerProfile from "$lib/components/index/playerProfile.svelte";
    import PlayerList from "$lib/components/index/playerList.svelte";
    import Content from "$lib/components/index/content.svelte";
    import Links from "$lib/components/index/links.svelte";
    import type {PlayerDisplay} from "$lib/models/player";
    import { readable } from 'svelte/store';
    import {twMerge} from "tailwind-merge";

    const { data } = $props();

    const activePanel = $derived.by(() => data.panel ?? "content");

    type ChangeEventHandler = (this:MediaQueryList, ev: MediaQueryListEvent) => any;

    const isDesktop = readable(false, (set) => {
        if (typeof window === 'undefined') return;
        const query = window.matchMedia('(min-width: 768px)');
        // Set the initial value
        set(query.matches);
        const handler: ChangeEventHandler = (e) => set(e.matches);
        query.addEventListener('change', handler);
        return () => query.removeEventListener('change', handler);
    });

    const selectedPlayer = $derived.by(async () =>
        (await data.players).find((p: PlayerDisplay) => p.disc === data.disc)
    )

    const index = $derived.by(() => $isDesktop && !data.panel);
</script>

<div class={twMerge("h-full not-md:pb-[2dvw] gap-4 md:overflow-hidden", index ? "md:grid md:grid-cols-[1fr_2fr] md:grid-rows-[auto_1fr]" : "")}>
    {#if index || activePanel === "links"}
        <Links/>
    {/if}

    {#if index || activePanel === "content"}
        <Content
                class="md:row-span-2"
                player={selectedPlayer}
                content={data.content}
        />
    {/if}

    {#if index || activePanel === "symphonists"}
        {#if data.disc == null}
            <PlayerList
                class="md:row-start-2"
                players={data.players}
            />
        {:else}
            <PlayerProfile
                class="md:row-start-2"
                selectedPlayer={selectedPlayer}
            />
        {/if}
    {/if}
</div>