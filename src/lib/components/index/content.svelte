<script lang="ts">
    import Panel from "$lib/components/panel.svelte";
    import {twMerge} from "tailwind-merge";
    import {ContentUtils, DEFAULT_FILTERS, type Filters} from "$lib/utils/contentUtils";
    import ContentListItem from "$lib/components/contentListItem.svelte";
    import PanelHeader from "$lib/components/panelHeader.svelte";
    import type {ContentCollection} from "../../../routes/+page.server";
    import type {PlayerDisplay} from "$lib/models/player";
    import {onMount} from "svelte";

    let filters = $state({ ...DEFAULT_FILTERS });

    onMount(() => {
        try {
            const raw = localStorage.getItem("CONTENT_FILTERS");
            if (raw) {
                const parsed = JSON.parse(raw) as Partial<Filters>;
                filters = { ...DEFAULT_FILTERS, ...parsed };
            }
        } catch {
            filters = { ...DEFAULT_FILTERS };
        }
    });

    $effect(() => {
        filters.livestreams;
        filters.videos;
        filters.shorts;
        filters.vods;
        filters.notSymphonic;

        localStorage.setItem("CONTENT_FILTERS", JSON.stringify(filters));
    });

    const icons = {
        "livestreams": undefined,
        "videos": "play",
        "shorts": "bolt",
        "vods": "tag",
        "notSymphonic": "sparkles",
    }

    type ContentProps = {
        content: Promise<ContentCollection>;
        player: Promise<PlayerDisplay | undefined>;
        class?: string;
    }
    let { content, player, class: classes }: ContentProps = $props();

    const filterKeys = $derived.by(() => Object.keys(filters) as (keyof Filters)[]);
    const formatLabel = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
</script>

<Panel class={twMerge(classes, "overflow-hidden min-h-0 flex flex-col")}>
    {#await player then player}
        <PanelHeader title="Content" subtitle={player ? "by " + player?.nickname : undefined} >
            <span class="shrink flex md:justify-end items-center float-end gap-4 not-md:w-full flex-wrap w-fit">
                {#each filterKeys as key}
                    <button class="flex flex-row gap-1.5 items-center cursor-pointer" aria-label="livestreams-filter" onclick={() => filters[key] = !filters[key]}>
                        <input class="appearance-none h-4 w-4 rounded-sm checked:bg-[#2e9200] bg-[#1e1e1e] transition-colors border border-white/25 cursor-pointer" name={key} type="checkbox" bind:checked={filters[key]}>
                        {#if icons[key]}
                            <i class={twMerge("absolute mx-0.5 text-xs scale-80 transition-opacity", filters[key] ? "opacity-100" : "opacity-0", "hn hn-" + icons[key] + "-solid")}></i>
                        {:else}
                            <div class={twMerge("absolute mx-1 bg-white rounded-2xl h-2 w-2 aspect-square", filters[key] ? "opacity-100" : "opacity-0")}></div>
                        {/if}
                        <label class="text-gray-400 text-sm not-md:grow flex items-center gap-1 cursor-pointer" for={key}>
                        {formatLabel(key)}
                        </label>
                    </button>
                {/each}
            </span>
        </PanelHeader>
    {/await}
    <div class="grow w-full flex flex-col gap-4 overflow-auto">
        {#await content}
            {#each {length: 20} as _}
                <ContentListItem/>
            {/each}
        {:then content}
            {#await player then player}
                {@const filteredLivestreams = ContentUtils.filterLivestreams(content.livestreams, filters, player?.disc)}
                {@const filteredVideos = ContentUtils.filterVideos(content.videos, filters, player?.disc)}
                {#each filteredLivestreams as livestream}
                    <ContentListItem content={livestream}/>
                {/each}
                {#each filteredVideos as video}
                    <ContentListItem content={video}/>
                {/each}
                {#if filteredLivestreams.length === 0 && filteredVideos.length === 0}
                    <p class="italic">Could not find any content :(</p>
                {/if}
            {/await}
        {:catch _}
            <p class="italic">An error occurred trying to retrieve content, please try again later</p>
        {/await}
    </div>
</Panel>