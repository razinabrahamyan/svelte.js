<script lang="ts">
	import { page } from '$app/stores';
	import env from '@root/env';
	import SimpleCmsLogo from '@src/components/icons/SimpleCMS_Logo.svelte';

	// typesafe-i18n
	import LL from '../i18n/i18n-svelte';

	let speed = 50;
	let size = 130;
	let font = 0.8;
	let text = env.SITENAME;
	let repeat = 3;
	let separator = ' • ';

	let array: any = [];
	$: array = [...Array(repeat)].map((_) => [...text].concat([...separator])).flat();
</script>

{#if $page}
	<main
		class="from-surface-900 via-surface-700 to-surface-900 flex h-screen w-full flex-col items-center justify-center bg-gradient-to-t"
	>
		<div class="relative">
			<div
				class="seal absolute"
				style="--size: {size}px; --speed: {speed * 1000}ms; --font: {font}em"
			>
				{#each array as char, index}
					<div class="char" style="--angle: {`${(1 / array.length) * index}turn`}">{char}</div>
				{/each}
			</div>
			<SimpleCmsLogo
				fill="red"
				className="absolute top-[50%] -translate-y-[50%] translate-x-[50%] left-0 h-16 mb-2"
			/>
		</div>

		<div class="relative">
			<!-- error class -->
			<h1 class="relative !text-9xl font-extrabold tracking-widest text-white">
				{$page.status}
			</h1>
			<!-- error url  -->
			<div
				class="bg-error-600/80 absolute top-[50%] mx-auto translate-x-[25%] rotate-12 rounded px-2 text-center text-sm font-bold text-white"
			>
				<div>{$page.url}</div>
				<div>{$LL.ERROR_Pagenotfound()}</div>
			</div>
		</div>

		<h1 class="text-surface-400 text-5xl font-extrabold tracking-widest">
			{#if $page.error} {$page.error.message} {/if}
		</h1>

		<p class="text-lg text-white">{$LL.ERROR_Wrong()}</p>
		<a
			href="/"
			data-sveltekit-preload-data="tap"
			class="from-error-700 via-error-600 to-error-700 relative mt-5 block rounded-xl bg-gradient-to-br px-8 py-4 font-bold uppercase !text-white shadow-xl"
			>{$LL.ERROR_GoHome()}</a
		>
	</main>
{/if}

<style>
	@keyframes rotation {
		0% {
			transform: rotate(0turn);
		}
		100% {
			transform: rotate(1turn);
		}
	}
	.controls span {
		display: block;
		margin-bottom: 0.5em;
	}
	.seal {
		position: relative;
		width: var(--size);
		height: var(--size);
		border-radius: 100%;
		animation: rotation var(--speed) linear infinite;
		font-size: var(--font);
	}
	.char {
		width: 1em;
		height: 100%;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%) rotate(var(--angle, 0deg));
		text-align: center;
		text-transform: uppercase;
	}
</style>
