<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import type {LayoutProps} from "../../.svelte-kit/types/src/routes/$types";
	import '@hackernoon/pixel-icon-library/fonts/iconfont.css';
	import { initFlowbite } from 'flowbite'
	import { onMount } from "svelte";

	onMount(() => {
		initFlowbite();
	})

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<div class="static">
	<div id="background" class="absolute z-[-1] h-screen w-screen bg-[url(/assets/background.png)] bg-cover bg-center blur-sm"></div>
</div>

<div id="app" class="h-screen max-h-screen w-screen max-w-screen overflow-hidden">
	<div class="h-full p-2 md:py-5 flex flex-col items-center gap-2 text-white">
	<!--	Header		-->
	<div class="relative h-16 md:my-4 w-300 max-w-[98%] flex items-center justify-center">
		<div class="h-full rounded-lg bg-[#1e1e1e] overflow-hidden">
			<div class="flex flex-row items-center h-full min-w-600 md:min-w-1000 w-[200dvw] scroll">
				{#each data.discs as disc}
					<div class="flex grow justify-center">
						<img class="h-8 md:h-10 m-2" src={"/assets/discs/" + disc + ".png"} alt="Disc {disc}"/>
					</div>
				{/each}
			</div>
		</div>
		<div class="absolute h-16 backdrop-blur-xs min-w-full mask-x-from-50%"></div>
		<a href="/" class="absolute h-16 justify-center items-center md:py-0 md:px-20 group">
			<img class="h-full z-50 scale-70 md:scale-140 group-hover:scale-75 md:group-hover:scale-150 transition-transform " src={data.logo} alt=""/>
		</a>
	</div>
	<!--	Header		-->

	<!--	Body		-->
	<div class="w-300 max-w-[98%] flex-1 min-h-0">
		{@render children()}
	</div>
	<!--	Body		-->

	</div>
</div>

<style>
	@keyframes scroll {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}

	.scroll {
		animation: scroll 120s linear infinite;
	}
</style>
