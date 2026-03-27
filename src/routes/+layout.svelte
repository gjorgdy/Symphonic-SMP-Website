<script lang="ts">
	import './layout.css';
	import type {LayoutProps} from "../../.svelte-kit/types/src/routes/$types";
	import '@hackernoon/pixel-icon-library/fonts/iconfont.css';
	import { initFlowbite } from 'flowbite'
	import { onMount } from "svelte";
	import {page} from "$app/state";
	import {goto} from "$app/navigation";

	onMount(() => {
		initFlowbite();
	})

	let { data, children }: LayoutProps = $props();

	function setDisc(disc?: string): void {
		let query = new URLSearchParams(page.url.searchParams.toString());
		if (disc) {
			query.set('disc', disc);
			goto(`?${query.toString()}`);
		} else {
			goto('/');
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={"/assets/discs/" + data.favicon + ".png"} />
	<meta name="darkreader-lock" content="true" />
	<meta property="og:title" content="Symphonic SMP" />
	<meta name="keywords" content="Minecraft, Survival, SMP, Community, Music" />
	<meta name="description" content="The Symphonic SMP is a music inspired Minecraft server with a lot of great smaller creators">
	<meta property="description" content="The Symphonic SMP is a music inspired Minecraft server with a lot of great smaller creators" />
	<meta property="og:description" content="The Symphonic SMP is a music inspired Minecraft server with a lot of great smaller creators" />
	<meta property="og:image" content={data.logo} />
	<title>Symphonic SMP</title>
</svelte:head>

<div
	id="background"
	class="fixed inset-0 -z-10 bg-[url('/assets/background.png')] bg-cover bg-center blur-sm pointer-events-none"
></div>

<div id="app" class="h-screen max-h-screen w-screen max-w-screen md:overflow-hidden">
	<div class="h-dvh p-2 md:py-5 flex flex-col items-center gap-2 text-white">
	<!--	Header		-->
	<div class="not-md:fixed z-40 h-16 md:my-2 w-300 not-md:max-w-[98dvw] max-w-[96dvw] flex items-center justify-center">
		<div class="h-full rounded-lg bg-[#1e1e1e] not-md:drop-shadow-xl/30 overflow-hidden">
			<div class="flex flex-row items-center h-full min-w-600 md:min-w-1000 w-[200dvw] scroll">
				{#each data.discs as disc}
					<button type="button" class="flex justify-center cursor-pointer hover:scale-115 transition-transform" onclick={() => setDisc(disc)}>
						<img class="h-10 m-8 aspect-square grow" src={"/assets/discs/" + disc + ".png"} alt="Disc {disc}"/>
					</button>
				{/each}
			</div>
		</div>
		<div class="absolute h-16 backdrop-blur-xs min-w-full mask-x-from-50% pointer-events-none"></div>
		<a href="/" class="absolute h-16 justify-center items-center md:py-0 md:px-20 group">
			<img class="h-full z-50 not-md:drop-shadow-xl/30 scale-110 md:scale-130 group-hover:scale-115 md:group-hover:scale-140 transition-transform " src={data.logo} alt=""/>
		</a>
	</div>
	<!--	Header		-->

	<!--	Body		-->
	<div class="w-300 max-w-[96dvw] flex-1 min-h-0 not-md:mt-18">
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
