<script lang="ts">
    import PlayerProfile from "$lib/components/index/playerProfile.svelte";
    import PlayerList from "$lib/components/index/playerList.svelte";
    import Content from "$lib/components/index/content.svelte";
    import Links from "$lib/components/index/links.svelte";
    import type {PlayerDisplay} from "$lib/models/player";
    import {registeredPlayers} from "$lib/data/registeredPlayers";
    import { readable } from 'svelte/store';
    import {twMerge} from "tailwind-merge";

    const { data, params } = $props();

    const activePanel = $derived.by(() => data.panel ?? "content");

    type ChangeEventHandler = (this:MediaQueryList, ev: MediaQueryListEvent) => void;

    const isDesktop = readable(false, (set) => {
        if (typeof window === 'undefined') return;
        const query = window.matchMedia('(min-width: 768px)');
        // Set the initial value
        set(query.matches);
        const handler: ChangeEventHandler = (e) => set(e.matches);
        query.addEventListener('change', handler);
        return () => query.removeEventListener('change', handler);
    });

    const selectedPlayerDisplay = $derived.by(async () =>{
      const disc = data.disc;
      const players = await data.players;
      return players.find((p: PlayerDisplay) => p.disc === disc);
    })

    const index = $derived.by(() => $isDesktop && !data.panel);
	const title = $derived.by(() =>
		"Symphonic SMP" + (data.selectedPlayer ? (" | " + data.selectedPlayer.nickname) : "")
	);

	const playerImage = $derived.by(() => data.selectedPlayer ? `https://mc-heads.net/avatar/${data.selectedPlayer.minecraft_uuid}` : data.favicon);
	const discImage = $derived.by(() => "/assets/discs/" + (params.disc ?? data.favicon) + ".webp");
</script>

<svelte:head>
	<link rel="icon" href={data.playerUrl ? playerImage : discImage} />
	<meta name="darkreader-lock" content="true" />
	<meta property="og:title" content={data.selectedPlayer ? "Symphonist | " + data.selectedPlayer.nickname : "Symphonic SMP"} />
	<meta name="keywords" content="Minecraft, Survival, SMP, Community, Music" />
	<meta name="description" content="The Symphonic SMP is a music inspired Minecraft server with a lot of great small creators">
	<meta property="description" content="The Symphonic SMP is a music inspired Minecraft server with a lot of great small creators" />
	<meta property="og:description" content="The Symphonic SMP is a music inspired Minecraft server with a lot of great small creators" />
	<meta property="og:image" content={data.disc ? (data.playerUrl ? playerImage : discImage) : data.logo} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.disc ? `https://symphonicsmp.net/${data.disc}` : "https://symphonicsmp.net/"} />
	<meta property="og:site_name" content="Symphonic SMP" />
	<meta property="og:locale" content="en_US" />
	<title>{title}</title>
</svelte:head>

<div class={twMerge("h-full not-md:pb-[2dvw] gap-4 md:overflow-hidden", index ? "md:grid md:grid-cols-[1fr_2fr] md:grid-rows-[auto_1fr]" : "")}>
    {#if index || activePanel === "links"}
        <Links/>
    {/if}

    {#if index || activePanel === "content"}
        <Content
            class="md:row-span-2"
            player={selectedPlayerDisplay}
            content={data.content}
        />
    {/if}

    {#if index || activePanel === "symphonists"}
        {#if data.disc == null || registeredPlayers[data.disc] == null}
            <PlayerList
                class="md:row-start-2"
                players={data.players}
            />
        {:else}
            <PlayerProfile
                class="md:row-start-2"
                selectedPlayer={selectedPlayerDisplay}
            />
        {/if}
    {/if}
</div>
