<script lang="ts">
	import './layout.css';
	import type {LayoutProps} from "../../.svelte-kit/types/src/routes/$types";
	import '@hackernoon/pixel-icon-library/fonts/iconfont.css';
	import {goto} from "$app/navigation";
	import { resolve } from '$app/paths';

	let { data, children }: LayoutProps = $props();
</script>

<div
	id="background"
	class="fixed inset-0 -z-10 bg-[url('/assets/background.webp')] bg-cover bg-center lazyload blur-sm pointer-events-none"
></div>

<div id="app" class="h-screen w-screen">
	<div class="h-full p-2 md:py-5 flex flex-col items-center gap-2 text-white">
	<!--	Header		-->
	<div class="not-md:fixed z-40 h-16 md:my-2 w-300 not-md:max-w-[98dvw] max-w-[96dvw] flex items-center justify-center">
		<div class="relative h-full max-h-full rounded-lg bg-[#1e1e1e] not-md:drop-shadow-xl/30 overflow-hidden">
			<div class="flex flex-row items-center h-full min-w-600 md:min-w-1000 w-[200dvw] scroll">
			    {#each {length: 3} as _, j (j)}
    				{#each data.discs as disc, i (i)}
    					<button type="button" class="flex justify-center cursor-pointer hover:scale-115 transition-transform" onclick={async () => goto(resolve(`/${disc}`))}>
    						<img class="h-10 m-8 aspect-square grow text-white/0" src={"/assets/discs/" + disc + ".webp"} alt="Disc {disc}"/>
    					</button>
    				{/each}
				{/each}
			</div>
		</div>
		<div class="absolute h-16 backdrop-blur-xs min-w-full mask-x-from-50% pointer-events-none"></div>
		<button class="absolute h-16 justify-center items-center md:py-0 md:px-20 group cursor-pointer" onclick={() => {goto(resolve("/"));}}>
			<img class="h-full z-50 not-md:drop-shadow-xl/30 scale-110 md:scale-130 group-hover:scale-115 md:group-hover:scale-140 transition-transform " src={data.logo} alt=""/>
		</button>
	</div>

	<!--	Body		-->
	<div class="md:max-h-[calc(100%-82px)] w-300 max-w-[96dvw] flex-1 not-md:mt-18">
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
