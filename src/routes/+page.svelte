<script lang="ts">
    import Content from "$lib/components/index/content.svelte";
    import PanelHeader from "$lib/components/panelHeader.svelte";
    import type {PlayerDisplay} from "$lib/models/player";
	import PlayerList from "$lib/components/index/playerList.svelte";
    import PlayerProfile from "$lib/components/index/playerProfile.svelte";

    const { data } = $props();

    let menu: boolean = $state(false);

    let selectedPage: string = $state("content");

    const selectedPlayer = $derived.by(async () =>
        (await data.players).find((p: PlayerDisplay) => p.disc === data.disc)
    )
</script>

<div class="flex flex-col h-full w-full">

{#if menu}
<div class="rounded-xl bg-[#1e1e1e] h-fit flex flex-col p-4 gap-4">
    <PanelHeader title="Menu" onclick={() => menu = !menu}/>
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
        <PanelHeader title="Links" onclick={() => menu = !menu}/>
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
        <PlayerList class="md:row-start-2" players={data.players}/>
    {:else}
        <PlayerProfile class="md:row-start-2" selectedPlayer={selectedPlayer}/>
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