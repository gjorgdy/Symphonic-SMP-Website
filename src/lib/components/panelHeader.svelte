<script lang="ts">
    import {twMerge} from "tailwind-merge";

    type PanelHeaderProps = {
        title?: string;
        subtitle?: string;
        actionText?: string;
        action?: () => void;
        href?: string;
        children?: any;
        collapsed?: boolean;
        class?: string;
    }
    let { title, subtitle, actionText, action, href, children, collapsed = $bindable(), class: className }: PanelHeaderProps = $props();
</script>

<div class={twMerge("relative flex flex-col md:flex-row not-md:gap-4 w-full justify-between md:pb-4", collapsed ? "": "pb-4", className)}>
    {#if collapsed != undefined}
        <button
            class="absolute p-2 -top-1 right-0 pixel text-lg hover:text-gray-300 transition-colors cursor-pointer md:hidden"
            onclick={() => collapsed = !collapsed}
        >
            {#if collapsed}
                <i class="hn hn-plus-solid"></i>
            {:else}
                <i class="hn hn-minus-solid"></i>
            {/if}
        </button>
    {/if}
    <div class="{collapsed != undefined ? "w-[calc(100%-24px)]" : "w-full"} md:w-full flex flex-col md:flex-row justify-between md:items-center gap-2">
        <div class="h-fit flex flex-row gap-4 items-center justify-between {children ? "" : "w-full"}">
            <div class="flex flex-row items-end justify-center gap-2 overflow-hidden md:text-xl pixel">
                <button
                    class="hover:text-gray-300 transition-colors cursor-pointer"
                >
                    {title ?? ""}
                </button>
                <button
                    class="text-gray-600 text-xs not-md:mb-0.5 md:text-sm overflow-hidden text-nowrap text-ellipsis hover:text-gray-700 hover:line-through transition-colors cursor-pointer"
                >
                    {subtitle ?? ""}
                </button>
            </div>
            {#if href}
                <a {href} class="hover:text-gray-500 text-gray-400 transition-colors italic h-min mt-auto cursor-pointer {collapsed ? "not-md:hidden" : ""}">
                    {actionText ?? ""}
                </a>
            {:else if action}
                <button
                    class="hover:text-gray-500 text-gray-400 transition-colors italic h-min mt-auto cursor-pointer {collapsed ? "not-md:hidden" : ""}"
                    onclick={action}
                >
                    {actionText ?? ""}
                </button>
            {/if}
        </div>
        {#if children}
            {@render children()}
        {/if}
    </div>
</div>
