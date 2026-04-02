<script lang="ts">
    import PanelTitle from "$lib/components/panelTitle.svelte";

    let {data} = $props();
</script>

<div class="rounded-xl bg-[#1e1e1e] h-fit flex flex-col p-4 gap-4">
    <PanelTitle title="Very Secret Video page"/>
    <iframe
        class="w-full aspect-video rounded-lg overflow-hidden"
        src="https://www.youtube.com/embed/yxUmLosaOQY"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
    ></iframe>
</div>