<script lang="ts">
	import RoundLogo from './components/icons/RoundLogo.svelte';
	import Signin from './components/Signin.svelte';
	import SignUp from './components/Signup.svelte';

	let active: undefined | 0 | 1 = undefined;
	let background: 'white' | '#242728' = 'white';
</script>

<div class="body" style="background:{background} ">
	<Signin {active} on:click={() => (active = 0)} on:pointerenter={() => (background = '#242728')} />
	<SignUp {active} on:click={() => (active = 1)} on:pointerenter={() => (background = 'white')} />
	{#if active == undefined}
		<div class="z-30"><RoundLogo /></div>
	{/if}

	<!-- TODO: CSS Logo not finished yet -->
	<!-- <div class="absolute top-20 mx-auto z-[999]">
				<div
					class="top-[-150px] h-[160px] w-[160px] justify-center rounded-full border-2 border-red-500 bg-white"
				>
					<div
						class="relative mx-auto top-2 left-1 h-[140px] w-[140px] rounded-[50%] border-2 border-green-500 border-x-transparent bg-transparent"
					/>
					<div
						class="relative -top-36 left-1 h-[130px] w-[130px] rounded-[50%] border-2 border-black border-x-transparent bg-transparent"
					/>

					<div class="absolute top-6 flex flex-col items-center justify-center text-center">
						<Logo fill="" className="w-8" />
						<div class="text-red-500 font-bold text-2xl">{PUBLIC_SITENAME}</div>
						<div class="-mt-[4px] text-[9px] font-bold text-black">with Sveltekit Power</div>
					</div>
				</div>
			</div> -->
</div>

<style>
	.body {
		width: 100vw;
		height: 100vh;
		display: flex;
		background: linear-gradient(90deg, #242728 50%, white 50%);
	}
	:global(html, body, body > div, .body) {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
