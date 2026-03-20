<script lang="ts">
    import type {ClientPlayer} from "$lib/models/player";

    type PlayerProps = {
        player?: ClientPlayer;
    }
    let { player }: PlayerProps = $props();
</script>

<div class="flex flex-row items-center gap-4 w-full">
    {#if player == null}
        <div class="rounded-[100%] h-10 w-10 aspect-square bg-[#444444] animate-pulse"></div>
    {:else}
        <div class="rounded-[100%] h-10 w-10 aspect-square bg-white"></div>
    {/if}
    <div class="flex flex-col gap-1">
        <span>{player?.display_name}</span>
        <span class="text-xs text-gray-600">{player?.minecraft?.username ?? " "}</span>
    </div>

    <div class="flex gap-8 px-4 grow h-full text-xl flex-row-reverse">
        {#if player?.live != null}
            <a data-tooltip-target="tooltip-{player?.display_name}" aria-label="Live link" href="{player.live.url}"
               class="group flex items-center justify-center">
                <div class="bg-red-600 hover:bg-red-800 transition-colors rounded-2xl h-3 w-3 aspect-square"></div>
                <span class="invisible group-hover:visible w-80 m-4 text-xs absolute bg-[#444444] p-1 rounded-md">
                    <img class="rounded-md mb-2" src="{player.live.thumbnail_url}" alt="">
                    {player?.live.title}
                </span>
            </a>
            <div id="tooltip-{player?.display_name}" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-dark rounded-base shadow-xs opacity-0 tooltip">
                Tooltip on left
            </div>
        {/if}
        {#if player?.youtube != null}
            <a aria-label="YouTube link" href="https://www.youtube.com/channel/{player?.youtube.id}"
               class={"flex items-center justify-center text-gray-100 hover:text-gray-300 transition-colors float-end"}>
                <i class="hn hn-youtube"></i>
            </a>
        {/if}
        {#if player?.twitch != null}
            <a aria-label="Twitch link" href="https://twitch.tv/{player.twitch.handle}"
               class={"flex items-center justify-center text-gray-100 hover:text-gray-300 transition-colors float-end"}>
                <i class="hn hn-twitch"></i>
            </a>
        {/if}
    </div>
</div>