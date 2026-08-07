<script lang="ts">
    import PlayerProfile from "$lib/components/index/playerProfile.svelte";
    import PlayerList from "$lib/components/index/playerList.svelte";
    import Content from "$lib/components/index/content.svelte";
    import Links from "$lib/components/index/links.svelte";
    import type {PlayerDisplay} from "$lib/models/player";
    import {registeredPlayers} from "$lib/data/registeredPlayers";
    import {twMerge} from "tailwind-merge";
	import PlayerDescription from "$lib/components/playerDescription.svelte";
	import { titleCase } from "$lib/utils/textUtils.js";

    const { data, params } = $props();

    const selectedPlayerDisplay = $derived.by(async () =>{
      const disc = data.disc;
      const players = await data.players;
      return players.find((p: PlayerDisplay) => p.disc === disc);
    })

	const playerImage = $derived.by(() => data.selectedPlayer ? `https://mc-heads.net/avatar/${data.selectedPlayer.minecraft_uuid}` : data.favicon);
	const discImage = $derived.by(() => "/assets/discs/" + (params.disc ?? data.favicon) + ".webp");

	const openGraphPrefix = $derived.by(() => data.playerUrl ? "Symphonist | " : "Disc | ");
	const pageTitle = $derived.by(() => data.playerUrl ? data.selectedPlayer?.nickname : titleCase(params.disc!));
</script>

<svelte:head>
	<link rel="icon" href={data.playerUrl ? playerImage : discImage} />
	<meta name="darkreader-lock" content="true" />
	<meta property="og:title" content={data.selectedPlayer ? openGraphPrefix + pageTitle : "Symphonic SMP"}/>
	<meta name="keywords" content="Minecraft, Survival, SMP, Community, Music" />
	<meta name="description" content="The Symphonic SMP is a music inspired Minecraft server with a lot of great small creators">
	<meta property="description" content="The Symphonic SMP is a music inspired Minecraft server with a lot of great small creators" />
	<meta property="og:description" content="The Symphonic SMP is a music inspired Minecraft server with a lot of great small creators" />
	<meta property="og:image" content={data.disc ? (data.playerUrl ? playerImage : discImage) : data.logo} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.disc ? `https://symphonicsmp.net/${data.disc}` : "https://symphonicsmp.net/"} />
	<meta property="og:site_name" content="Symphonic SMP" />
	<meta property="og:locale" content="en_US" />
	<title>Symphonic SMP {data.selectedPlayer ? "| " + pageTitle : ""}</title>
</svelte:head>

<div class={twMerge("h-full min-h-0 not-md:pb-[2dvw] gap-2 md:gap-4 flex flex-col md:grid md:grid-cols-[1fr_2fr] md:grid-rows-[auto_auto_1fr]")}>
    <!-- Sidebar -->
    <Links class="md:col-start-1"/>
    {#if data.disc == null || registeredPlayers[data.disc] == null}
        <PlayerList
            class="md:col-start-1 md:row-start-2 md:row-span-2"
            players={data.players}
        />
    {:else}
        <PlayerProfile
            class="md:col-start-1 md:row-start-2"
            selectedPlayer={selectedPlayerDisplay}
        />
        <PlayerDescription
            class="not-md:grow md:col-start-1 md:row-start-3"
            selectedPlayer={selectedPlayerDisplay}
        />
    {/if}
    <!-- Content -->
    <Content
        class="h-min md:row-span-3 md:row-start-1"
        player={selectedPlayerDisplay}
        content={data.content}
    />
</div>
