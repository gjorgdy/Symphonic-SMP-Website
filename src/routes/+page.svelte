<script lang="ts">
    import PlayerListItem from "$lib/components/playerListItem.svelte";
    import ContentListItem from "$lib/components/contentListItem.svelte";
    import { ContentUtils } from "$lib/utils/contentUtils";

    const { data } = $props();

    let page: string = $state("content");

    let settings = $state({
        onlySymphonic: true,
        livestreams: true,
        shorts: true
    });
</script>

<div class="flex flex-col h-full w-full">
<div class="flex flex-row h-10 p-2 mb-2 rounded-md md:rounded-xl bg-[#1e1e1e] divide-[#444444] divide-x-2 md:hidden">
    <button
            type="button"
            class={"flex flex-1 items-center justify-center " + (page === "videos" ? "underline" : "")}
            onclick={(() => page = "content")}
    >Content</button>
    <button
        type="button"
        class={"flex flex-2 items-center justify-center " + (page === "players" ? "underline" : "")}
        onclick={(() => page = "players")}
    > Symphonists </button>
    <button
            type="button"
            class={"flex flex-1 items-center justify-center " + (page === "links" ? "underline" : "")}
            onclick={(() => page = "links")}
    > Links </button>
</div>

<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] grid-rows-1 md:grid-rows-[1fr_5fr] gap-4 overflow-hidden">

    <!--    About     -->
    <div class={"rounded-xl bg-[#1e1e1e] flex flex-col p-4 gap-4 " + (page === "links" ? "" : "not-md:hidden")}>
        <h2 class="text-xl pixel not-md:hidden">Links</h2>
        <a aria-label="Discord link" href="https://hexasis.eu/dc/hexasis"
           class="text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-discord text-xl"></i>
            Symphonic SMP Discord
        </a>
        <a aria-label="Announcement video" href="https://youtu.be/B47D5Lja-oc"
           class="text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-youtube text-xl"></i>
            Announcement video
        </a>
        <a aria-label="Announcement video" href="https://hexasis.eu/"
           class="group text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-code text-xl"></i>
            Website developer <span class="text-gray-600 group-hover:text-gray-700 transition-colors text-sm">Gjorgdy</span>
        </a>
    </div>
    <!--    About     -->

    <!--    Players     -->
    <div class={"md:row-start-2 rounded-xl bg-[#1e1e1e] min-h-0 overflow-hidden " + (page === "players" ? "" : "not-md:hidden")}>
        <h2 class="text-xl pixel p-4 not-md:hidden">Symphonists</h2>
        <div class="flex flex-col gap-4 p-4 md:pt-0 h-full min-h-0 overflow-y-auto">
            {#await data.players}
                {#each {length: 5} as _}
                    <PlayerListItem/>
                {/each}
            {:then players}
                {#each players as player}
                    <PlayerListItem {player}/>
                {/each}
            {:catch _}
                <p class="italic">Could not find any recent videos :(</p>
            {/await}
        </div>
    </div>
    <!--    Players     -->

    <!--    Content     -->
    <div class={"md:row-span-2 h-full rounded-xl bg-[#1e1e1e] py-4 overflow-hidden " + (page === "content" ? "" : "not-md:hidden")}>
        <div class="flex flex-row px-4 w-full float-end">
            <h2 class="text-xl pixel not-md:hidden grow">Content</h2>
            <span class="flex items-center float-end gap-2 not-md:w-full">
                <input class="rounded-sm text-[#2e9200] bg-[#1e1e1e] border-white/25" name="filter" type="checkbox" bind:checked={settings.onlySymphonic}>
                <label class="text-gray-400 text-sm not-md:grow" for="filter">SMP only</label>
                <input class="rounded-sm text-[#2e9200] bg-[#1e1e1e] border-white/25" name="live" type="checkbox" bind:checked={settings.livestreams}>
                <label class="text-gray-400 text-sm not-md:grow" for="live">Livestreams</label>
                <input class="rounded-sm text-[#2e9200] bg-[#1e1e1e] border-white/25" name="shorts" type="checkbox" bind:checked={settings.shorts}>
                <label class="text-gray-400 text-sm not-md:grow" for="shorts">Shorts</label>
            </span>
        </div>
        <div class="h-full flex flex-col p-4 pb-8 gap-8 overflow-auto">
            {#await data.content}
                {#each {length: 5} as _}
                    <ContentListItem/>
                {/each}
            {:then content}
                {#if settings.livestreams}
                    {#each content.livestreams as livestream}
                        <ContentListItem {livestream}/>
                    {/each}
                {/if}
                {#each ContentUtils.filterVideos(content.videos, settings) as video}
                    <ContentListItem {video}/>
                {/each}
            {:catch _}
                <p class="italic">Could not find any content :(</p>
            {/await}
        </div>
    </div>
    <!--    Content     -->
</div>
</div>