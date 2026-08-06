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
</script>

{#await selectedPlayer then player}
    {#if player?.youtube_channel && player.youtube_channel.description !== ""}
        <Panel class={twMerge("overflow-hidden flex flex-col h-fit", classes)}>
            <PanelHeader title="About" panelName="symphonists" class="flex-row">
                <a
                    href="https://www.youtube.com/channel/{player?.youtube_user_id}"
                    class="hover:text-gray-500 text-gray-400 transition-colors italic h-min mt-auto cursor-pointer"
                >
                    from YouTube
                </a>
            </PanelHeader>
            <div class="flex flex-col gap-4 md:pt-0 h-full min-h-0">
                {player.youtube_channel.description}
            </div>
        </Panel>
    {/if}
{/await}
