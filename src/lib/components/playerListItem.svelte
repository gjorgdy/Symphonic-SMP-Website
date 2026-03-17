<script lang="ts">
    type PlayerProps = {
        player: Player;
    }
    let { player }: PlayerProps = $props();
</script>

<div class="flex flex-row items-center gap-4 w-full">
    <div class="rounded-[100%] h-10 w-10 aspect-square bg-white"></div>
    <div class="flex flex-col gap-1">
        <span>{player.name}</span>
        <span class="text-xs text-gray-600">{player.minecraft_name}</span>
    </div>

    <div class="flex gap-8 px-4 grow h-full text-xl flex-row-reverse">
        {#if player.youtube != null}
            <a aria-label="YouTube link" href="{player.youtube}"
               class={"text-gray-100 hover:text-gray-300 transition-colors float-end " +  (player.live === "youtube" ? "text-[#fe0034] hover:text-[#b00024]" : "")}>
                <i class="hn hn-youtube"></i>
            </a>
        {/if}

        {#if player.twitch != null}
            <a aria-label="Twitch link" href="{player.twitch}"
               class={"text-gray-100 hover:text-gray-300 transition-colors float-end " + (player.live === "twitch" ? "text-[#9244ff] hover:text-[#5d2ba3]" : "")}>
                <i class="hn hn-twitch"></i>
            </a>
        {/if}
    </div>
</div>