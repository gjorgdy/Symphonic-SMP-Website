<script lang="ts">
    import {TimeUtils} from "$lib/utils/timeUtils";
    import {type Content, isLivestream, isVideo} from "$lib/models/content";

    type VideoProps = {
        content?: Content
    }
    let { content }: VideoProps = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 w-full">
    <a class="relative group" href="{content?.url}">
        <div class="absolute h-full w-full opacity-0 group-hover:opacity-30 transition-opacity bg-black rounded-sm"></div>
        {#if content == null}
            <div class="w-full md:min-w-64 aspect-video bg-[#444444] animate-pulse rounded-sm"></div>
        {:else}
            <img class="w-full md:min-w-64 aspect-video rounded-sm" src="{content?.thumbnail_url}" alt="thumbnail for {content?.title}">
            <span class="absolute flex flex-row items-center gap-1 z-10 bottom-0.5 right-0.5 text-xs bg-black/50 p-0.5 rounded-xs">
                {#if isVideo(content) }
                    {content?.duration ?? "00:00"}
                {:else if isLivestream(content)}
                    <div class="bg-red-600 rounded-2xl h-2.5 w-2.5 aspect-square"></div>
                    LIVE
                {/if}
            </span>
        {/if}
    </a>
    <div class="relative flex flex-col gap-2 justify-between">
        <div class="flex flex-col gap-2">
            <a class="w-fit" href="{content?.url}">
                <h3 class="md:text-lg hover:text-gray-300 transition-colors">{content?.title}</h3>
            </a>
            <a href="{content?.creator.url}" class="w-fit not-md:text-sm underline hover:text-gray-400 transition-colors">
                {content?.creator.name}
            </a>
        </div>
        <div class="mb-1 w-full overflow-hidden">
            <span class="flex flex-row flex-wrap gap-4 text-xs md:text-sm text-center text-gray-200">
                <span class="flex flex-row items-center gap-2"><i class="hn hn-clock"></i>
                    {#if isLivestream(content)}
                        {content?.started_at}
                    {:else if isVideo(content)}
                        {TimeUtils.getRelativeTime(content?.published_at)}
                    {:else}
                        -
                    {/if}
                </span>
                <span class="flex flex-row items-center gap-2"><i class="hn hn-eye"></i>
                    {#if isLivestream(content)}
                        {content?.viewers}
                    {:else if isVideo(content)}
                        {content.views}
                    {:else}
                        -
                    {/if}
                </span>
                {#if isVideo(content)}
                    <span class="flex flex-row items-center gap-2"><i class="hn hn-thumbsup"></i> {content?.likes ?? "-"}</span>
                    <span class="flex flex-row items-center gap-2"><i class="hn hn-comment"></i> {content?.comments ?? "-"}</span>
                {/if}
            </span>
        </div>
    </div>
</div>