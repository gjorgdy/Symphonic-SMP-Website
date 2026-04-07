<script lang="ts">
    type PanelHeaderProps = {
        title?: string;
        subtitle?: string;
        children?: any;
    }
    let { title, subtitle, children }: PanelHeaderProps = $props();
</script>

<div class="flex flex-col md:flex-row not-md:gap-4 pb-4 w-full justify-between">
    <div class="h-fit flex flex-row gap-4 text-xl pixel items-center">
        <span class="flex flex-row items-end gap-2 overflow-hidden">
            {title ?? ""}
            <span class="text-gray-600 text-sm overflow-hidden text-nowrap text-ellipsis">{subtitle ?? ""}</span>
        </span>
    </div>
    {#if children}
        {@render children()}
    {/if}
</div>