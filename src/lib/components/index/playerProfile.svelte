<script lang="ts">
    import Panel from "$lib/components/panel.svelte";
    import PlayerListItem from "$lib/components/playerListItem.svelte";
    import type {PlayerDisplay} from "$lib/models/player";
    import PanelHeader from "../panelHeader.svelte";
    import {twMerge} from "tailwind-merge";
    import Skinview3d from "svelte-skinview3d";
    import {IdleAnimation} from "skinview3d";

    type PlayerListProps = {
        selectedPlayer?: Promise<PlayerDisplay | undefined>;
        class?: string;
    }
    let { selectedPlayer, class: classes }: PlayerListProps = $props();

    let w: number|undefined = $state();
    let h: number|undefined = $state();
</script>

<Panel class={twMerge("overflow-hidden flex flex-col h-fit", classes)}>
    <PanelHeader title="Symphonist">
        <a href="/" class="hover:underline text-gray-400 italic h-min mt-auto">deselect</a>
    </PanelHeader>
    <div class="flex flex-col gap-4 md:pt-0 h-full min-h-0">
        {#await selectedPlayer}
            <div class="w-full min-h-0 aspect-square">
                <div class="h-full border-white/5 bg-white/1 border rounded-sm"></div>
            </div>
            <PlayerListItem/>
        {:then player}
            <div class="w-full aspect-square" bind:clientWidth={w} bind:clientHeight={h}>
                <Skinview3d
                    class="border-white/5 bg-white/1 border rounded-sm"
                    options={{animation: new IdleAnimation(), zoom: 0.75}}
                    width={(w ?? 100)} height={(h ?? 100)}
                    skinUrl="https://mc-heads.net/skin/{player?.minecraft_uuid}"
                />
            </div>
            <PlayerListItem {player} selected={true}/>
        {/await}
    </div>
</Panel>