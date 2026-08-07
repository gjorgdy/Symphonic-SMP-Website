<script lang="ts">
    import Panel from "$lib/components/panel.svelte";
	import { twMerge } from "tailwind-merge";
    import PanelHeader from "../panelHeader.svelte";

    type Link = {
        url: string;
        icon: string;
        title: string;
        subtitle?: string;
    }

    const links: Link[] = [
        {
            url: "https://discord.gg/T4GvyhRs52",
            icon: "discord",
            title: "Symphonic SMP Discord"
        },
        {
            url: "https://youtu.be/B47D5Lja-oc",
            icon: "youtube",
            title: "Announcement video"
        },
        {
            url: "https://github.com/gjorgdy",
            icon: "github",
            title: "Website developer",
            subtitle: "Gjorgdy"
        },
        {
            url: "https://ko-fi.com/gjorgdy",
            icon: "wallet",
            title: "Fund the website"
        }
    ]

    type PlayerListProps = {
        class?: string;
    }
    let { class: classes }: PlayerListProps = $props();

    let collapsed = $state(true);
</script>

<Panel class={twMerge("py-4", classes)}>
    <PanelHeader bind:collapsed title="Links" class="px-3"/>
    <div class="flex flex-col gap-4 px-3 transition-transform {collapsed ? 'not-md:h-0 not-md:overflow-hidden' : ''}">
        {#each links as link, i (i)}
            <a aria-label={link.title} href={link.url}
               target="_blank"
               class="text-gray-100 hover:text-gray-300 transition-colors gap-2 flex items-center">
                <i class={`hn hn-${link.icon} text-xl`}></i>
                {link.title}
                {#if link.subtitle}
                    <span class="text-gray-600 group-hover:text-gray-700 transition-colors text-sm">
                        {link.subtitle}
                    </span>
                {/if}
            </a>
        {/each}
    </div>
</Panel>
