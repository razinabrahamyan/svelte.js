<script lang="ts">
	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	import { credentials } from '@src/stores/store';
	import CMSLogo from '../../components/icons/SimpleCMS_Logo.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { FileDropzone } from '@skeletonlabs/skeleton';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	import { user, session } from '@src/collections/Auth';

	import { enhance } from '$app/forms';

	// TODO Only ADMIN user need to generate from /user a token

	//import { auth } from '@lucia-auth/';

	// const authenticateUser = async (email: string, password: string) => {
	// 	try {
	// 		await auth.authenticateUser('email', email, password);
	// 	} catch {
	// 		// error (invalid provider id or password, etc)
	// 	}
	// };

	let username = 'Admin';
	let id = '0';
	let email = 'info@asset-trade.de';
	let password = '12345';
	let newUserEmail: string;
	let newUserRole: 'USER' | 'EDITOR' = 'USER';

	let readonly = true;

	function triggerAlert(): void {
		const alert: ModalSettings = {
			type: 'alert',
			title: 'Upload Image',
			body: 'Upload an Image.',
			image: 'https://i.imgur.com/WOgTG96.gif',
			// Optionally override buttont text
			buttonTextSubmit: 'Submit',
			buttonTextCancel: 'Cancel'
		};
		modalStore.trigger(alert);
	}
</script>

<div class="">
	<h1 class="mb-2">User Settings</h1>

	<div class="mb-2 flex justify-start">
		<button on:click={triggerAlert} class="">
			<Avatar src="https://i.pravatar.cc/" rounded-xl class="mr-4 w-32" />
			<div class="mt-2 text-xs">Upload Image</div>
			<div class="mb-2 font-bold">User ID: 0</div>
		</button>
		<div>
			<label
				>Name:
				<input bind:value={username} name="username" type="text" {readonly} />
			</label>
			<label
				>Email:
				<input bind:value={email} name="email" type="email" {readonly} />
			</label>
			<label
				>Password:
				<input bind:value={password} name="password" type="password" {readonly} />
			</label>
			{#if readonly}
				<button
					on:click={() => {
						readonly = false;
					}}
					class="btn btn-sm variant-filled-surface mt-1"
				>
					Edit User settings
				</button>
			{:else}
				<button
					on:click={() => {
						readonly = true;
					}}
					class="btn btn-sm variant-filled-primary mt-1"
				>
					Save
				</button>
			{/if}
		</div>
	</div>
	<!-- {#if $user?.role === 'ADMIN'} -->
	<button class="btn btn-base variant-filled-secondary">Show UserList</button>
	<div class="mt-3">Generate new User Registions token</div>
	<form method="post" action="?/generateToken" use:enhance>
		<input bind:value={newUserEmail} name="newUserEmail" type="email" required />
		<div>
			<label>
				<input type="radio" bind:group={newUserRole} name="role" value={'USER'} /> User
			</label>
			<label>
				<input type="radio" bind:group={newUserRole} name="role" value={'EDITOR'} /> Editor
			</label>
		</div>
		<button class="btn btn-base variant-filled-tertiary" type="submit">Generate new Token</button>
	</form>
	<button class="btn btn-base variant-filled-tertiary">Delete User</button>
	<!-- {/if} -->
</div>
