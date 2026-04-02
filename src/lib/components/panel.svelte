<script lang="ts">
    import PanelHeader from "$lib/components/panelHeader.svelte";
    import {twMerge} from "tailwind-merge";

    type PanelProps = {
        title?: string;
        subtitle?: string;
        onclick?: () => void;
        children?: any;
        class?: string;
    }
    let { title, subtitle, onclick, class: classes, children }: PanelProps = $props();
</script>

<div class={twMerge("rounded-xl bg-[#1e1e1e] p-4", classes)}>
    {#if title}
        <PanelHeader {title} {subtitle} {onclick}/>
    {/if}
    {@render children()}
</div>