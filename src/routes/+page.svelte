<script lang="ts">
    import type {PageProps} from "../../.svelte-kit/types/src/routes/$types";
    import PlayerListItem from "$lib/components/playerListItem.svelte";
    import VideoListItem from "$lib/components/VideoListItem.svelte";

    const { data }: PageProps = $props();

    let page: string = $state("videos");
</script>

<div class="flex flex-col h-full">
<div class="grid grid-cols-3 w-full h-10 p-2 mb-2 rounded-md md:rounded-xl bg-[#1e1e1e] divide-[#444444] divide-x-2 md:hidden">
    <button
            type="button"
            class={"flex items-center justify-center " + (page === "videos" ? "underline" : "")}
            onclick={(() => page = "videos")}
    >Videos</button>
    <button
        type="button"
        class={"flex items-center justify-center " + (page === "players" ? "underline" : "")}
        onclick={(() => page = "players")}
    > Players </button>
    <button
            type="button"
            class={"flex items-center justify-center " + (page === "links" ? "underline" : "")}
            onclick={(() => page = "links")}
    > Links </button>
</div>

<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] grid-rows-1 md:grid-rows-[1fr_5fr] gap-4 max-w-[95dvw] w-full overflow-hidden">

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
           class="text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
            <i class="hn hn-code text-xl"></i>
            Website developer ; Gjorgdy
        </a>
    </div>
    <!--    About     -->

    <!--    Players     -->
    <div class={"md:row-start-2 rounded-xl bg-[#1e1e1e] min-h-0 overflow-hidden " + (page === "players" ? "" : "not-md:hidden")}>
        <h2 class="text-xl pixel p-4 not-md:hidden">Players</h2>
        <div class="flex flex-col gap-4 p-4 md:pt-0 h-full min-h-0 overflow-y-auto">
            {#each data.players as player}
                <PlayerListItem {player}/>
            {/each}
        </div>
    </div>
    <!--    Players     -->

    <!--    Videos     -->
    <div class={"md:row-span-2 h-full rounded-xl bg-[#1e1e1e] py-4 overflow-hidden " + (page === "videos" ? "" : "not-md:hidden")}>
        <h2 class="text-xl pixel not-md:hidden ml-4">Videos</h2>
        <div class="h-full flex flex-col p-4 gap-8 overflow-auto">
            {#each data.videos as video}
                <VideoListItem {video}/>
            {/each}
        </div>
    </div>
    <!--    videos     -->
</div>
</div>