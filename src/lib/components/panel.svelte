<script lang="ts">
    import {twMerge} from "tailwind-merge";

    type PanelProps = {
        children?: any;
        class?: string;
    }
    let { class: classes, children }: PanelProps = $props();
</script>

<div class={twMerge("break-inside-avoid rounded-xl bg-[#1e1e1e] p-1", classes)}>
    {@render children()}
</div>
