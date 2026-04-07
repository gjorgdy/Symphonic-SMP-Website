<script lang="ts">
    import PlayerProfile from "$lib/components/index/playerProfile.svelte";
    import PlayerList from "$lib/components/index/playerList.svelte";
    import Content from "$lib/components/index/content.svelte";
    import Links from "$lib/components/index/links.svelte";
    import type {PlayerDisplay} from "$lib/models/player";

    const { data } = $props();

    const selectedPlayer = $derived.by(async () =>
        (await data.players).find((p: PlayerDisplay) => p.disc === data.disc)
    )
</script>

<div class={data.panel ? "" : "h-full md:grid md:grid-cols-[1fr_2fr] md:grid-rows-[auto_1fr] not-md:pb-[2dvw] gap-4 md:overflow-hidden"}>
    {#if !data.panel || data.panel === "links"}
        <Links/>
    {/if}

    {#if !data.panel || data.panel === "symphonists"}
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
    {/if}

    {#if !data.panel || data.panel === "content"}
        <Content
            class="md:row-span-2"
            player={selectedPlayer}
            content={data.content}
        />
    {/if}
</div>