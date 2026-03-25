<script lang="ts">
    type VideoProps = {
        title?: string;
        onclick?: () => void;
    }
    let { title, onclick }: VideoProps = $props();
</script>

<div class="h-fit flex flex-row not-md:gap-4 text-xl pixel items-center">
    <button class="translate-y-1.25 md:hidden" aria-label="menu" type="button" {onclick}>
        <i class="hn hn-bars"></i>
    </button>
    <span>{title ?? ""}</span>
</div>