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
</script>

<Panel class={twMerge("overflow-hidden flex flex-col", classes)}>
    <PanelHeader title="Symphonists"/>
    <div class="md:row-start-2 rounded-xl flex flex-col gap-4 bg-[#1e1e1e] min-h-0 md:overflow-hidden">
        <div class="flex flex-col gap-4 h-full min-h-0 md:overflow-y-auto">
            {#await players}
                {#each {length: 20} as _}
                    <PlayerListItem/>
                {/each}
            {:then players}
                {#each players as player}
                    <PlayerListItem {player}/>
                {/each}
            {/await}
        </div>
    </div>
</Panel>