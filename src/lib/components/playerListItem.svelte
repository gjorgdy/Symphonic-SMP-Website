<script lang="ts">
    import type {PlayerDisplay} from "$lib/models/player";
    import { goto } from '$app/navigation';
    import { page } from '$app/state'

    type PlayerProps = {
        player?: PlayerDisplay;
    }
    let { player }: PlayerProps = $props();

    function setDisc(disc: string): void {
        let query = new URLSearchParams(page.url.searchParams.toString());
        query.set('disc', disc);
        goto(`?${query.toString()}`);
    }

</script>

<div class="flex flex-row items-center gap-4 w-full">
    {#if player == null}
        <div class="rounded-[100%] h-10 w-10 aspect-square bg-[#444444] animate-pulse"></div>
    {:else if player.profile_picture_url != null}
        <button
            type="submit"
            onclick={() => setDisc(player.disc)}
            class="relative rounded-sm h-10 w-10 aspect-square bg-[#444444] overflow-hidden group cursor-pointer"
        >
            <img class="absolute top-0 h-full rotate-y-0 group-hover:-rotate-y-90 transition-transform" src="https://mc-heads.net/avatar/{player.minecraft_uuid}" alt="">
            <img class="absolute top-0 h-full ml-px rotate-y-90 group-hover:rotate-y-0 transition-transform" src={"/assets/discs/" + player.disc + ".png"} alt="">
        </button>
    {:else}
        <div class="rounded-[100%] h-10 w-10 aspect-square bg-white"></div>
    {/if}
    <div class="flex flex-col gap-1">
        <span>{player?.displayName}</span>
        <span class="text-xs text-gray-600">{player?.nickname ?? " "}</span>
    </div>

    <div class="flex gap-8 px-4 grow h-full text-xl flex-row-reverse">
        {#if player?.youtube_user_id != null}
            <a aria-label="YouTube link" href="https://www.youtube.com/channel/{player?.youtube_user_id}"
               class={"flex items-center justify-center text-gray-100 hover:text-red-300 transition-colors float-end"}>
                <i class="hn hn-youtube"></i>
            </a>
        {/if}
        {#if player?.twitch_user_id != null}
            <a aria-label="Twitch link" href="https://twitch.tv/{player?.twitch_user_id}"
               class={"flex items-center justify-center text-gray-100 hover:text-purple-300 transition-colors float-end"}>
                <i class="hn hn-twitch"></i>
            </a>
        {/if}
    </div>
</div>