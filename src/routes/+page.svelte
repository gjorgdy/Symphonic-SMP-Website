<script lang="ts">
    import PlayerListItem from "$lib/components/playerListItem.svelte";
    import ContentListItem from "$lib/components/contentListItem.svelte";
    import { ContentUtils } from "$lib/utils/contentUtils";
    import Skinview3d from "svelte-skinview3d";
    import { IdleAnimation } from "skinview3d";

    const { data } = $props();

    let page: string = $state("content");

    let settings = $state({
        onlySymphonic: true,
        livestreams: true,
        shorts: true
    });

    let w: number|undefined = $state();
    let h: number|undefined = $state();
</script>

<div class="flex flex-col h-full w-full">
<div class="flex flex-row h-10 p-2 mb-2 rounded-md md:rounded-xl bg-[#1e1e1e] divide-[#444444] divide-x-2 md:hidden">
    <button
            type="button"
            class={"flex flex-1 items-center justify-center " + (page === "content" ? "underline" : "")}
            onclick={(() => page = "content")}
    >Content</button>
    <button
        type="button"
        class={"flex flex-2 items-center justify-center " + (page === "players" ? "underline" : "")}
        onclick={(() => page = "players")}
    > {data.disc === null ? "Symphonists" : "Symphonist"} </button>
    <button
            type="button"
            class={"flex flex-1 items-center justify-center " + (page === "links" ? "underline" : "")}
            onclick={(() => page = "links")}
    > Links </button>
</div>

<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] grid-rows-1 md:grid-rows-[auto_1fr] gap-4 overflow-hidden">

    <!--    About     -->
    <div class={"rounded-xl bg-[#1e1e1e] h-fit flex flex-col p-4 gap-4 " + (page === "links" ? "" : "not-md:hidden")}>
        <h2 class="text-xl pixel not-md:hidden">Links</h2>
        <a aria-label="Discord link" href="https://discord.gg/T4GvyhRs52"
           class="text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-discord text-xl"></i>
            Symphonic SMP Discord
        </a>
        <a aria-label="Announcement video" href="https://youtu.be/B47D5Lja-oc"
           class="text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-youtube text-xl"></i>
            Announcement video
        </a>
        <a aria-label="Announcement video" href="https://github.com/gjorgdy"
           class="group text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-code text-xl"></i>
            Website developer <span class="text-gray-600 group-hover:text-gray-700 transition-colors text-sm">Gjorgdy</span>
        </a>
        <a aria-label="Announcement video" href="https://ko-fi.com/gjorgdy"
           class="group text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-wallet text-xl"></i>
            Fund the website
        </a>
    </div>
    <!--    About     -->

    <!--    Players     -->
    {#if data.disc == null}
    <div class={"md:row-start-2 rounded-xl bg-[#1e1e1e] min-h-0 overflow-hidden " + (page === "players" ? "" : "not-md:hidden")}>
        <h2 class="text-xl pixel p-4 not-md:hidden">{data.disc == null ? "Symphonists" : "Symphonist"}</h2>
        <div class="flex flex-col gap-4 p-4 md:pt-0 h-full min-h-0 overflow-y-auto">
            {#await data.players}
                {#each {length: 20} as _}
                    <PlayerListItem/>
                {/each}
            {:then players}
                {#each players as player}
                    <PlayerListItem {player}/>
                {/each}
            {/await}
        </div>
    </div>
    {:else}
    <div class={"md:row-start-2 rounded-xl bg-[#1e1e1e] min-h-0 h-fit overflow-hidden " + (page === "players" ? "" : "not-md:hidden")}>
        <div class="flex flex-row gap-2 p-4 not-md:pb-0 justify-between">
            <h2 class="text-xl pixel">Symphonist</h2>
            <a href="/" class="hover:underline text-gray-400 italic h-min mt-auto">show all</a>
        </div>
        <div class="flex flex-col gap-4 p-4 md:pt-0 h-full min-h-0">
        {#await data.players}
            Loading...
        {:then players}
            {@const player = players.find(p => (p.disc === data.disc))}
            <div class="w-full aspect-square" bind:clientWidth={w} bind:clientHeight={h}>
                <Skinview3d
                        class="border-white/5 bg-white/1 border rounded-sm"
                        options={{animation: new IdleAnimation(), zoom: 0.75}}
                        width={(w ?? 100)} height={(h ?? 100)}
                        skinUrl="https://mc-heads.net/skin/{player?.minecraft_uuid}"
                        capeUrl="/textures/cape.png"
                />
            </div>
            <PlayerListItem {player} selected={data.disc != null}/>
        {/await}
        </div>
    </div>
    {/if}
    <!--    Players     -->

    <!--    Content     -->
    <div class={"md:row-span-2 rounded-xl bg-[#1e1e1e] py-4 overflow-hidden min-h-0 flex flex-col " + (page === "content" ? "" : "not-md:hidden")}>
        <div class="flex flex-row px-4 pb-4 w-full justify-between">
            <h2 class="text-xl pixel not-md:hidden">Content</h2>
            <span class="flex items-center float-end gap-2 not-md:w-full">
                <input class="rounded-sm text-[#2e9200] bg-[#1e1e1e] border-white/25" name="filter" type="checkbox" bind:checked={settings.onlySymphonic}>
                <label class="text-gray-400 text-sm not-md:grow" for="filter">SMP only</label>
                <input class="rounded-sm text-[#2e9200] bg-[#1e1e1e] border-white/25" name="live" type="checkbox" bind:checked={settings.livestreams}>
                <label class="text-gray-400 text-sm not-md:grow" for="live">Livestreams</label>
                <input class="rounded-sm text-[#2e9200] bg-[#1e1e1e] border-white/25" name="shorts" type="checkbox" bind:checked={settings.shorts}>
                <label class="text-gray-400 text-sm not-md:grow" for="shorts">Shorts</label>
            </span>
        </div>
        <div class="grow w-full flex flex-col px-4 gap-4 overflow-auto">
            {#await data.content}
                {#each {length: 20} as _}
                    <ContentListItem/>
                {/each}
            {:then content}
                {@const filteredLivestreams = ContentUtils.filterLivestreams(content.livestreams, settings, data.disc)}
                {@const filteredVideos = ContentUtils.filterVideos(content.videos, settings, data.disc)}
                {#each filteredLivestreams as livestream}
                    <ContentListItem {livestream}/>
                {/each}
                {#each filteredVideos as video}
                    <ContentListItem {video}/>
                {/each}
                {#if filteredLivestreams.length === 0 && filteredVideos.length === 0}
                    <p class="italic">Could not find any content :(</p>
                {/if}
            {:catch _}
                <p class="italic">Could not find any content :(</p>
            {/await}
        </div>
    </div>
    <!--    Content     -->
</div>
</div>