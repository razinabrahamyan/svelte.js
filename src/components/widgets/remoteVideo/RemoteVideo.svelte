<script lang="ts">
	import env from '@root/env';

	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;

	export let myData: any = null;

	$: myData;
	const handleSubmit = async (event: Event) => {
		const formData = new FormData();
		formData.append('url', value);
		const response = fetch('/api/video', {
			method: 'POST',
			body: formData
		});
		const data = await (await response).json();
		myData = data;
	};
</script>

<input
	required
	placeholder="Paste a Video URL here"
	type="text"
	name="url"
	bind:value
	on:blur={handleSubmit}
	class="input w-full rounded-md"
/>

{#if myData?.videoUrl}
	<div class="mt-2 grid rounded border p-2 md:grid-cols-2 ">
		<div class="row-span-5 grid grid-cols-2 items-center justify-center gap-1">
			<a
				target="_blank"
				href={myData?.videoUrl}
				rel="noreferrer"
				class="text-tertiary-500 !no-underline"
			>
				<img width="400" height="200" src={myData?.videoThumbnail} alt={myData?.videoTitle} /></a
			>
		</div>

		<div class="flex gap-2 text-xl">Video Data:</div>

		<div class="flex gap-2">
			<div class="w-20">Title:</div>
			<div class="font-bold text-tertiary-500">{myData?.videoTitle}</div>
		</div>
		<div class="flex gap-2">
			<div class="w-20">Duration:</div>
			<div class="font-bold text-tertiary-500">{myData?.duration}<span>min</span></div>
		</div>
		<div class="flex gap-2">
			<div class="w-20">User:</div>
			<div class="font-bold text-tertiary-500">{myData?.user_name}</div>
		</div>
		<div class="flex gap-2">
			<div class="w-20">Dimention:</div>
			<div class="font-bold text-tertiary-500">
				{myData?.height} x {myData?.width}<span>(height x width)</span>
			</div>
		</div>
	</div>
{/if}
