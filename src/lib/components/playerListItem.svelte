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
            <a aria-label="Live link" href="{player.live.url}"
               class={"text-red-600 hover:text-red-700 transition-colors float-end"}>
                <i class="hn hn-chart-network"></i>
            </a>
        {/if}
        {#if player?.youtube != null}
            <a aria-label="YouTube link" href="https://www.youtube.com/channel/{player?.youtube.id}"
               class={"text-gray-100 hover:text-gray-300 transition-colors float-end"}>
                <i class="hn hn-youtube"></i>
            </a>
        {/if}
        {#if player?.twitch != null}
            <a aria-label="Twitch link" href="https://twitch.tv/{player.twitch.handle}"
               class={"text-gray-100 hover:text-gray-300 transition-colors float-end"}>
                <i class="hn hn-twitch"></i>
            </a>
        {/if}
    </div>
</div>