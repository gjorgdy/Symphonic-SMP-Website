<script lang="ts">
    import type {Livestream} from "$lib/models/livestream";
    import {TimeUtils} from "$lib/utils/timeUtils";
    import type {Video} from "$lib/models/video";

    type VideoProps = {
        video?: Video;
        livestream?: Livestream;
    }
    let { video, livestream }: VideoProps = $props();

    const contentUrl = () => video?.url ?? livestream?.url;
</script>

<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 w-full">
    <a class="relative hover:scale-[102%] transition-transform" href="{contentUrl()}">
        {#if video == null && livestream == null}
            <div class="w-full md:min-w-64 aspect-video rounded-sm bg-[#444444] animate-pulse"></div>
        {:else}
            <img class="w-full md:min-w-64 aspect-video rounded-sm" src="{video?.thumbnail.url ?? livestream?.thumbnail_url}" alt="thumbnail for {video?.name}">
        {/if}
        <span class="absolute flex flex-row items-center gap-1 z-10 bottom-0.5 right-0.5 text-xs bg-black/50 p-0.5 rounded-xs">
            {#if video != null}
                {video?.duration ?? "00:00"}
            {:else if livestream != null}
                <div class="bg-red-600 rounded-2xl h-2.5 w-2.5 aspect-square"></div>
                LIVE
            {/if}
        </span>
    </a>
    <div class="relative flex flex-col gap-2">
        <a href="{contentUrl()}">
            <h3 class="md:text-lg hover:text-gray-300 transition-colors">{video?.name ?? livestream?.title}</h3>
        </a>
        <a href="{video?.creator.url ?? livestream?.creator_url}" class="not-md:text-sm grow underline hover:text-gray-400 transition-colors">
            {video?.creator.name ?? livestream?.creator_name}
        </a>
        <div class="mb-1 w-full overflow-hidden">
            <span class="flex flex-row flex-wrap gap-4 text-xs md:text-sm text-center text-gray-200">
                <span class="flex flex-row items-center gap-2"><i class="hn hn-clock"></i>
                    {TimeUtils.getRelativeTime(video?.timestamp ?? livestream?.started_at)}</span>
                <span class="flex flex-row items-center gap-2"><i class="hn hn-eye"></i> {video?.views ?? livestream?.viewcount ?? "-"}</span>
                {#if video != null}
                    <span class="flex flex-row items-center gap-2"><i class="hn hn-thumbsup"></i> {video?.likes ?? "-"}</span>
                    <span class="flex flex-row items-center gap-2"><i class="hn hn-comment"></i> {video?.comments ?? "-"}</span>
                {/if}
            </span>
        </div>
    </div>
</div>