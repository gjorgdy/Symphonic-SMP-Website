<script lang="ts">
    import Panel from "$lib/components/panel.svelte";
    import type {PlayerDisplay} from "$lib/models/player";
    import PanelHeader from "$lib/components/panelHeader.svelte";
    import {twMerge} from "tailwind-merge";
	import { onMount } from "svelte";

    type PlayerListProps = {
        selectedPlayer?: Promise<PlayerDisplay | undefined>;
        class?: string;
    }
    let { selectedPlayer, class: classes }: PlayerListProps = $props();

    onMount(() => {
        selectedPlayer?.then(player => {
            console.log(player?.youtube_channel);
        });
    });

    let collapsed = $state(true);
</script>

{#await selectedPlayer then player}
    {#if player?.youtube_channel && player.youtube_channel.description !== ""}
        <Panel class={twMerge("flex flex-col h-fit py-4", classes)}>
            <PanelHeader bind:collapsed title="About" actionText="from YouTube" href="https://www.youtube.com/channel/{player?.youtube_user_id}" class="flex-row px-3"/>
            <div class="overflow-scroll flex flex-col gap-4 md:pt-0 h-full min-h-0 px-3 {collapsed ? "not-md:h-0 not-md:overflow-hidden" : ""}">
                {player.youtube_channel.description}
            </div>
        </Panel>
    {/if}
{/await}
