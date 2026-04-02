<script lang="ts">
    import PlayerProfile from "$lib/components/index/playerProfile.svelte";
    import PanelHeader from "$lib/components/panelHeader.svelte";
    import PlayerList from "$lib/components/index/playerList.svelte";
    import Content from "$lib/components/index/content.svelte";
    import Links from "$lib/components/index/links.svelte";
    import type {PlayerDisplay} from "$lib/models/player";

    const { data } = $props();

    let menu: boolean = $state(false);

    let selectedPage: string = $state("content");

    const selectedPlayer = $derived.by(async () =>
        (await data.players).find((p: PlayerDisplay) => p.disc === data.disc)
    )
</script>

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
    <div class="h-full md:grid md:grid-cols-[1fr_2fr] md:grid-rows-[auto_1fr] not-md:pb-[2dvw] gap-4 md:overflow-hidden">
        <Links/>

        {#if data.disc == null}
            <PlayerList
                class="md:row-start-2"
                players={data.players}
            />
        {:else}
            <PlayerProfile
                class="md:row-start-2"
                selectedPlayer={selectedPlayer}
            />
        {/if}

        <Content
            class="md:row-span-2"
            player={selectedPlayer}
            content={data.content}
        />
    </div>
{/if}