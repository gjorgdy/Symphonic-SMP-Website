<script lang="ts">
    import Panel from "$lib/components/panel.svelte";
    import PlayerListItem from "$lib/components/playerListItem.svelte";
    import type {PlayerDisplay} from "$lib/models/player";
	import PanelHeader from "../panelHeader.svelte";
    import {twMerge} from "tailwind-merge";

    type PlayerListProps = {
        players?: Promise<PlayerDisplay[]>;
        class?: string;
    }
    let { players, class: classes }: PlayerListProps = $props();

    let collapsed = $state(true);
</script>

<Panel class={twMerge("flex flex-col py-4", classes)}>
    <PanelHeader bind:collapsed title="Symphonists" class="px-3"/>
    <div class="grid grid-cols-1 gap-4 px-3 md:overflow-scroll {collapsed ? 'not-md:h-0 not-md:overflow-hidden' : ''}">
        {#await players}
            {#each {length: 20} as _, i (i)}
                <PlayerListItem/>
            {/each}
        {:then players}
            {#each players as player (player.disc)}
                <PlayerListItem {player}/>
            {/each}
        {/await}
    </div>
</Panel>
