<script lang="ts">
    import type {PlayerDisplay} from "$lib/models/player";
    import {setDisc} from "$lib/utils/navigationUtils";

    type PlayerProps = {
        player?: PlayerDisplay;
        selected?: boolean;
    }
    let { player, selected }: PlayerProps = $props();

    const showSkin = $derived.by(() => selected === undefined && player?.profile_picture_url != null);
</script>

<div class="flex flex-row items-center justify-between gap-4 w-full">
    <button
            type="submit"
            onclick={() => setDisc(player?.disc)}
            class={"flex flex-row grow items-center gap-2 " + (showSkin ? "cursor-pointer group" : "")}
    >
        <!--    Profile Picture    -->
        <div class="relative rounded-sm h-10 w-10 aspect-square bg-white/1 border-white/5 border overflow-hidden">
            {#if player == null}
                <div class="absolute h-full w-full bg-[#444444] animate-pulse"></div>
            {:else}
                {#if showSkin}
                    <img loading="lazy" class="absolute top-0 h-full w-full rotate-y-0 group-hover:-rotate-y-90 transition-transform" src="https://mc-heads.net/avatar/{player.minecraft_uuid}" alt="">
                    <img loading="lazy" class="absolute top-0 h-full w-full ml-px transition-transform rotate-y-90 group-hover:rotate-y-0" src={"/assets/discs/" + player.disc + ".webp"} alt="">
                {:else}
                    <img loading="lazy" class="absolute top-0 h-full w-full ml-px" src={"/assets/discs/" + player.disc + ".webp"} alt="">
                {/if}
            {/if}
        </div>
        <!--    Name    -->
        <span class="flex flex-col items-start gap-1">
            <span class="group-hover:text-gray-400 transition-colors">{player?.nickname ?? "-"}</span>
            <span class="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">{player?.minecraft_name ?? "-"}</span>
        </span>
    </button>
    <div class="flex gap-8 h-full text-xl flex-row-reverse">
        {#if player == null}
            <span class="flex items-center justify-center text-[#444444] transition-colors float-end">
                <i class="hn hn-globe"></i>
            </span>
        {/if}
        {#if player?.youtube_user_id != null}
            <a aria-label="YouTube link"
               href="https://www.youtube.com/channel/{player?.youtube_user_id}"
               target="_blank"
               class={"flex items-center justify-center text-gray-100 hover:text-red-300 transition-colors float-end"}>
                <i class="hn hn-youtube"></i>
            </a>
        {/if}
        {#if player?.twitch_url != null}
            <a aria-label="Twitch link"
               href="{player?.twitch_url}"
               target="_blank"
               class={"flex items-center justify-center text-gray-100 hover:text-purple-300 transition-colors float-end"}>
                <i class="hn hn-twitch"></i>
            </a>
        {/if}
    </div>
</div>