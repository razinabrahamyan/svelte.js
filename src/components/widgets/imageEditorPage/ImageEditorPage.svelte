<script lang="ts">
	import Fields from '@src/components/Fields.svelte';
	import { saveSimpleData, shape_fields } from '@src/utils/utils_svelte';
	import { entryData } from '@src/stores/store';
	export let field = { db_fieldName: '', fields: [] };
	export let collection: any;
	export let value: any;
	let _fieldsValue: any = [];
	let fields: any;
	let files: any = [];

		let getData = async () => {

		for (let i = 0; i < files.length; i++) {
			let fieldsData = _fieldsValue[i];
			await saveSimpleData(collection, fieldsData);
		}
		if (!files.length) {
			// if no files currently beeing chosen, means we are editing, should update.
			let fieldsData = _fieldsValue;
			await saveSimpleData(collection, fieldsData);
		}
	};
	shape_fields(field.fields).then((data) => ( fields = data));
</script>

{#if files.length > 0}
	{#each files as file, index}
	
		<div class="relative my-4 rounded-lg border-2 border-[#8cccff] p-2 sm:p-[20px]">
			<Fields
				{getData}
				{collection}
				root={false}
				{fields}
				bind:fieldsValue={_fieldsValue[index]}
				value={{ 'Multi Image Array': file }}
			/>
		</div>
	{/each}
{:else if $entryData}
	<Fields {getData} {collection} {fields} bind:fieldsValue={_fieldsValue}  {value} />
{:else}
	<input
		multiple
		bind:files name={field.db_fieldName}
		class="block w-full cursor-pointer rounded-lg
		 border border-gray-300 bg-gray-50 text-sm text
		 -gray-900 focus:outline-none dark:border-gray-600 
		 dark:bg-gray-700 dark:text-gray-400
		dark:placeholder-gray-400"
		type="file"	
	/>
{/if}

<style>
</style>
