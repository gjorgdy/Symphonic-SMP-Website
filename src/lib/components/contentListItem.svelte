<script lang="ts">
    import {TimeUtils} from "$lib/utils/timeUtils";
    import {type Content, isLivestream, isShort, isVideo, isVOD} from "$lib/models/content";

    type VideoProps = {
        content?: Content
    }
    let { content }: VideoProps = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 w-full h-fit">
    <a class="relative group aspect-video" href="{content?.url}" target="_blank">
        <div class="absolute h-full w-full opacity-0 group-hover:opacity-30 transition-opacity bg-black rounded-sm"></div>
        {#if content == null}
            <div class="w-full md:min-w-64 bg-[#444444] animate-pulse rounded-sm"></div>
        {:else}
            <img loading="lazy" class="w-full md:min-w-64 aspect-video rounded-sm border-white/5 border" src="{content?.thumbnail_url}" alt="thumbnail for {content?.title}">
            <span class="absolute flex flex-row items-center gap-1 z-10 bottom-0.5 right-0.5 text-xs text-bold bg-black/50 p-0.5 px-1 rounded-xs">
                {#if isVideo(content) }
                    {#if isVOD(content)}
                        <i class="hn hn-tag-solid"></i>
                    {:else if isShort(content)}
                        <i class="hn hn-bolt-solid"></i>
                    {/if}
                    {content?.duration ?? "00:00"}
                {:else if isLivestream(content)}
                    <div class="bg-red-600 rounded-2xl h-2.5 w-2.5 aspect-square"></div>
                    LIVE
                {/if}
            </span>
        {/if}
    </a>
    <div class="relative flex flex-col gap-2 justify-between h-full">
        <div class="flex flex-col gap-2">
            <a
                class="w-fit"
                href="{content?.url}"
                target="_blank"
            >
                <h3 class=" hover:text-gray-300 transition-colors max-h-full text-ellipsis line-clamp-2">{content?.title}</h3>
            </a>
            <a
                href="{content?.creator.url}"
                target="_blank"
                class="w-fit text-sm text-gray-300 hover:text-gray-400 transition-colors"
            >
                {content?.creator.name}
            </a>
        </div>
        <div class="mb-1 w-full text-gray-300">
            <span class="flex flex-row flex-wrap gap-x-4 gap-y-1 text-xs md:text-sm text-center">
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
                {#if isVideo(content) && !isVOD(content)}
                    <span class="flex flex-row items-center gap-2"><i class="hn hn-thumbsup"></i> {content?.likes ?? "-"}</span>
                    <span class="flex flex-row items-center gap-2"><i class="hn hn-comment"></i> {content?.comments ?? "-"}</span>
                {/if}
            </span>
        </div>
    </div>
</div>