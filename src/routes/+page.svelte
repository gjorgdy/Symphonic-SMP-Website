<script lang="ts">
    import PlayerListItem from "$lib/components/playerListItem.svelte";
    import Content from "$lib/components/index/content.svelte";
    import PanelTitle from "$lib/components/panelTitle.svelte";
    import {ContentUtils, type Filters} from "$lib/utils/contentUtils";
    import Skinview3d from "svelte-skinview3d";
    import { IdleAnimation } from "skinview3d";
    import type {PlayerDisplay} from "$lib/models/player";
    import {twMerge} from "tailwind-merge";
    import {onMount} from "svelte";

    const { data } = $props();

    let menu: boolean = $state(false);

    let selectedPage: string = $state("content");

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
    <Content
        class={"md:row-span-2 " + (selectedPage === "content" ? "" : "not-md:hidden")}
        player={selectedPlayer}
        content={data.content}
    />
    <!--    Content     -->
</div>
{/if}
</div>