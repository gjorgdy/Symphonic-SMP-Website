<script lang="ts">
    import {type Panel, setPanel} from "$lib/utils/navigationUtils";
    import {twMerge} from "tailwind-merge";

    type PanelHeaderProps = {
        title?: string;
        subtitle?: string;
        panelName: Panel;
        children?: any;
        class?: string;
    }
    let { title, subtitle, panelName, children, class: className }: PanelHeaderProps = $props();
</script>

<div class={twMerge("flex flex-col md:flex-row not-md:gap-4 pb-4 w-full justify-between", className)}>
    <div class="h-fit flex flex-row gap-4 text-xl pixel items-center">
        <button class="flex flex-row items-end gap-2 overflow-hidden cursor-pointer" onclick={async () => await setPanel(panelName)}>
            {title ?? ""}
            <span class="text-gray-600 text-sm overflow-hidden text-nowrap text-ellipsis">{subtitle ?? ""}</span>
        </button>
    </div>
    {#if children}
        {@render children()}
    {/if}
</div>