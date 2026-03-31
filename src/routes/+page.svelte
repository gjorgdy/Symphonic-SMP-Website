<script lang="ts">
    import PlayerListItem from "$lib/components/playerListItem.svelte";
    import ContentListItem from "$lib/components/contentListItem.svelte";
    import PanelTitle from "$lib/components/panelTitle.svelte";
    import {ContentUtils, type Settings} from "$lib/utils/contentUtils";
    import Skinview3d from "svelte-skinview3d";
    import { IdleAnimation } from "skinview3d";
    import type {PlayerDisplay} from "$lib/models/player";

    const { data } = $props();

    let menu: boolean = $state(false);

    let selectedPage: string = $state("content");

    let settings = $state({
        livestreams: true,
        videos: true,
        shorts: false,
        vods: false,
        notSymphonic: false,
    } as Settings);

    let w: number|undefined = $state();
    let h: number|undefined = $state();

    const selectedPlayer = $derived.by(async () =>
        (await data.players).find((p: PlayerDisplay) => p.disc === data.disc)
    )
</script>

<div class="flex flex-col h-full w-full">

{#if menu}
<div class="rounded-xl bg-[#1e1e1e] h-fit flex flex-col p-4 gap-4">
    <PanelTitle title="Menu" onclick={() => menu = !menu}/>
    <button
            type="button"
            class={"flex flex-1 items-center justify-center pixel text-xl " + (selectedPage === "content" ? "underline text-gray-400" : "")}
            onclick={(() => {
                selectedPage = "content"
                menu = false;
            })}
    >Content</button>
    <button
        type="button"
        class={"flex flex-2 items-center justify-center pixel text-xl " + (selectedPage === "players" ? "underline text-gray-400" : "")}
        onclick={(() => {
            selectedPage = "players";
            menu = false;
        })}
    > {data.disc === null ? "Symphonists" : "Symphonist"} </button>
    <button
            type="button"
            class={"flex flex-1 items-center justify-center pixel text-xl " + (selectedPage === "links" ? "underline text-gray-400" : "")}
            onclick={(() => {
                selectedPage = "links";
                menu = false;
            })}
    > Links </button>
</div>
{:else}
<div class="md:grid md:grid-cols-[1fr_2fr] md:grid-rows-[auto_1fr] not-md:pb-[2dvw] gap-4 md:overflow-hidden">

    <!--    About     -->
    <div class={"rounded-xl bg-[#1e1e1e] h-fit flex flex-col p-4 gap-4 " + (selectedPage === "links" ? "" : "not-md:hidden")}>
        <PanelTitle title="Links" onclick={() => menu = !menu}/>
        <a aria-label="Discord link" href="https://discord.gg/T4GvyhRs52"
           target="_blank"
           class="text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-discord text-xl"></i>
            Symphonic SMP Discord
        </a>
        <a aria-label="Announcement video" href="https://youtu.be/B47D5Lja-oc"
           target="_blank"
           class="text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-youtube text-xl"></i>
            Announcement video
        </a>
        <a aria-label="Announcement video" href="https://github.com/gjorgdy"
           target="_blank"
           class="group text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-code text-xl"></i>
            Website developer <span class="text-gray-600 group-hover:text-gray-700 transition-colors text-sm">Gjorgdy</span>
        </a>
        <a aria-label="Announcement video" href="https://ko-fi.com/gjorgdy"
           target="_blank"
           class="group text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-wallet text-xl"></i>
            Fund the website
        </a>
    </div>
    <!--    About     -->

    <!--    Players     -->
    {#if data.disc == null}
    <div class={"md:row-start-2 rounded-xl py-4 flex flex-col gap-4 bg-[#1e1e1e] min-h-0 md:overflow-hidden " + (selectedPage === "players" ? "" : "not-md:hidden")}>
        <div class="px-4">
            <PanelTitle title={data.disc == null ? "Symphonists" : "Symphonist"} onclick={() => menu = !menu}/>
        </div>
        <div class="flex flex-col gap-4 px-4 h-full min-h-0 md:overflow-y-auto">
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
    <div class={"md:row-start-2 rounded-xl bg-[#1e1e1e] min-h-0 h-fit md:overflow-hidden " + (selectedPage === "players" ? "" : "not-md:hidden")}>
        <div class="flex flex-row gap-2 p-4 not-md:pb-0 justify-between">
            <PanelTitle title="Symphonist" onclick={() => menu = !menu}/>
            <a href="/" class="hover:underline text-gray-400 italic h-min mt-auto">deselect</a>
        </div>
        <div class="flex flex-col gap-4 p-4 md:pt-0 h-full min-h-0">
        {#await selectedPlayer}
            <div class="w-full min-h-0 aspect-square">
                <div class="h-full border-white/5 bg-white/1 border rounded-sm"></div>
            </div>
            <PlayerListItem/>
        {:then player}
            <div class="w-full aspect-square" bind:clientWidth={w} bind:clientHeight={h}>
                <Skinview3d
                    class="border-white/5 bg-white/1 border rounded-sm"
                    options={{animation: new IdleAnimation(), zoom: 0.75}}
                    width={(w ?? 100)} height={(h ?? 100)}
                    skinUrl="https://mc-heads.net/skin/{player?.minecraft_uuid}"
                />
            </div>
            <PlayerListItem {player} selected={data.disc != null}/>
        {/await}
        </div>
    </div>
    {/if}
    <!--    Players     -->

    <!--    Content     -->
    <div class={"md:row-span-2 rounded-xl bg-[#1e1e1e] py-4 overflow-hidden min-h-0 flex flex-col " + (selectedPage === "content" ? "" : "not-md:hidden")}>
        <div class="flex flex-col md:flex-row not-md:gap-4 px-4 pb-4 w-full justify-between">
            {#await selectedPlayer}
                <PanelTitle
                    title="Content"
                    onclick={() => menu = !menu}
                />
            {:then player}
                <PanelTitle
                    title="Content"
                    subtitle={player ? "by " + player?.nickname : undefined}
                    onclick={() => menu = !menu}
                />
            {/await}
            <span class="flex items-center float-end gap-4 not-md:w-full flex-wrap w-fit">
                <button class="flex flex-row gap-1.5 items-center" aria-label="livestreams-filter" onclick={() => settings.livestreams = !settings.livestreams}>
                    <input class="appearance-none h-4 w-4 rounded-sm checked:bg-[#2e9200] bg-[#1e1e1e] border border-white/25 cursor-pointer" name="filter" type="checkbox" bind:checked={settings.livestreams}>
                    {#if settings.livestreams}
                        <div class="absolute mx-1 bg-white rounded-2xl h-2 w-2 aspect-square"></div>
                    {/if}
                    <label class="text-gray-400 text-sm not-md:grow flex items-center gap-1 cursor-pointer" for="live">
                        Livestreams
                    </label>
                </button>
                <button class="relative flex flex-row gap-1.5 items-center cursor-pointer" aria-label="shorts-filter" onclick={() => settings.videos = !settings.videos}>
                    <input class="appearance-none h-4 w-4 rounded-sm checked:bg-[#2e9200] bg-[#1e1e1e] border border-white/25 cursor-pointer" name="filter" type="checkbox" bind:checked={settings.videos}>
                    {#if settings.videos}
                    <i class="absolute mx-0.5 hn hn-play-solid text-xs scale-80"></i>
                    {/if}
                    <label class="text-gray-400 text-sm not-md:grow flex items-center gap-1 cursor-pointer" for="shorts">
                        Videos
                    </label>
                </button>
                <button class="relative flex flex-row gap-1.5 items-center cursor-pointer" aria-label="shorts-filter" onclick={() => settings.shorts = !settings.shorts}>
                    <input class="appearance-none h-4 w-4 rounded-sm checked:bg-[#2e9200] bg-[#1e1e1e] border border-white/25 cursor-pointer" name="filter" type="checkbox" bind:checked={settings.shorts}>
                    {#if settings.shorts}
                    <i class="absolute mx-0.5 hn hn-bolt-solid text-xs scale-90"></i>
                    {/if}
                    <label class="text-gray-400 text-sm not-md:grow flex items-center gap-1 cursor-pointer" for="shorts">
                        Shorts
                    </label>
                </button>
                <button class="relative flex flex-row gap-1.5 items-center cursor-pointer" aria-label="vods-filter" onclick={() => settings.vods = !settings.vods}>
                    <input class="appearance-none h-4 w-4 rounded-sm checked:bg-[#2e9200] bg-[#1e1e1e] border border-white/25 cursor-pointer" name="filter" type="checkbox" bind:checked={settings.vods}>
                    {#if settings.vods}
                    <i class="absolute mx-0.5 hn hn-tag-solid text-xs scale-90"></i>
                    {/if}
                    <label class="text-gray-400 text-sm not-md:grow flex items-center gap-1 cursor-pointer" for="vods">
                        VODs
                    </label>
                </button>
                <button class="relative flex flex-row gap-1.5 items-center cursor-pointer" aria-label="notSymphonic-filter" onclick={() => settings.notSymphonic = !settings.notSymphonic}>
                    <input class="appearance-none h-4 w-4 rounded-sm checked:bg-[#2e9200] bg-[#1e1e1e] border border-white/25 cursor-pointer" name="filter" type="checkbox" bind:checked={settings.notSymphonic}>
                    {#if settings.notSymphonic}
                    <i class="absolute mx-px hn hn-sparkles-solid text-xs scale-90"></i>
                    {/if}
                    <label class="text-gray-400 text-sm not-md:grow flex items-center gap-1 cursor-pointer" for="filter">
                        Not Symphonic
                    </label>
                </button>
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
                    <ContentListItem content={livestream}/>
                {/each}
                {#each filteredVideos as video}
                    <ContentListItem content={video}/>
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
{/if}
</div>