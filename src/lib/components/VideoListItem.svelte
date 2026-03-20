<script lang="ts">
    import {YouTubeAPI} from "$lib/apis/youtube";
    import type {Livestream} from "$lib/models/player";

    type VideoProps = {
        video?: Video;
        livestream?: Livestream;
    }
    let { video, livestream }: VideoProps = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 w-full">
    <a class="relative hover:scale-[102%] transition-transform" href="{video?.url ?? livestream?.url}">
        {#if video == null && livestream == null}
            <div class="w-full md:min-w-64 aspect-video rounded-sm bg-[#444444] animate-pulse"></div>
        {:else}
            <img class="w-full md:min-w-64 aspect-video rounded-sm" src="{video?.thumbnail.url ?? livestream?.thumbnail_url}" alt="thumbnail for {video?.name}">
        {/if}
        <span class="absolute z-10 bottom-0.5 right-0.5 text-xs bg-black/50 p-0.5 rounded-xs">{video?.duration ?? "00:00"}</span>
    </a>
    <div class="relative flex flex-col gap-2">
        <a href="{video?.url ?? livestream?.url}">
            <h3 class="md:text-lg hover:text-gray-300 transition-colors">{video?.name ?? livestream?.title}</h3>
        </a>
        <a href="{video?.creator.url}" class="not-md:text-sm grow underline hover:text-gray-400 transition-colors">
            {video?.creator.name}
        </a>
        <div class="mb-1 w-full overflow-hidden">
            <span class="flex flex-row flex-wrap gap-4 text-xs md:text-sm text-center text-gray-200">
                <span class="flex flex-row items-center gap-2"><i class="hn hn-clock"></i> {video != null ? YouTubeAPI.getRelativeTime(video?.timestamp) : "-"}</span>
                <span class="flex flex-row items-center gap-2"><i class="hn hn-eye"></i> {video?.views ?? "-"}</span>
                <span class="flex flex-row items-center gap-2"><i class="hn hn-thumbsup"></i> {video?.likes ?? "-"}</span>
                <span class="flex flex-row items-center gap-2"><i class="hn hn-comment"></i> {video?.comments ?? "-"}</span>
            </span>
        </div>
    </div>
</div>