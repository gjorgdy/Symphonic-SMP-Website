<script lang="ts">
    type VideoProps = {
        video: Video;
    }
    let { video }: VideoProps = $props();
</script>

<div class="flex flex-col md:flex-row gap-4 w-full">
    <a href="{video.url}">
        <img class="not-md:w-full md:max-h-32 aspect-video" src="{video.thumbnail.url}" alt="thumbnail for {video.name}">
    </a>
    <div class="relative flex flex-col gap-2">
        <a href="{video.url}">
            <h3 class="text-lg hover:text-gray-300 transition-colors">{video.name}</h3>
        </a>
        <a href="{video.creator.url}" class="underline hover:text-gray-400 transition-colors">
            {video.creator.name}
        </a>
        <div class="md:absolute bottom-1">
            <span class="flex flex-row gap-4 text-sm text-center text-gray-200">
                <span class="flex flex-row items-center gap-2"><i class="hn hn-clock"></i> {video.timestamp}</span>
                <span class="flex flex-row items-center gap-2"><i class="hn hn-eye"></i> {video.views}</span>
                <span class="flex flex-row items-center gap-2"><i class="hn hn-thumbsup"></i> {video.likes}</span>
                <span class="flex flex-row items-center gap-2"><i class="hn hn-comment"></i> {video.comments}</span>
            </span>
        </div>
    </div>
</div>