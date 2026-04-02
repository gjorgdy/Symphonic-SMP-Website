<script lang="ts">
    import {twMerge} from "tailwind-merge";

    type PanelProps = {
        children?: any;
        class?: string;
    }
    let { class: classes, children }: PanelProps = $props();
</script>

<div class={twMerge("rounded-xl bg-[#1e1e1e] p-4 min-h-0 md:overflow-hidden", classes)}>
    {@render children()}
</div>