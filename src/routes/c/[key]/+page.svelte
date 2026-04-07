<script lang="ts">
    let {data} = $props();
</script>

<div class="rounded-xl bg-[#1e1e1e] h-fit flex flex-col p-4 gap-4">
    <iframe
        class="w-full aspect-video rounded-lg overflow-hidden"
        src={data.url}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
    ></iframe>
</div>