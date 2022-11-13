<template>
	<q-page class="row items-center justify-evenly">
		<div>
			<div class="text-h1 gt-xs">
				Interactive video database
			</div>
			<div class="text-h2 xs">
				Interactive video database
			</div>
			<div class="text-caption q-mt-sm">
				A database of scripts scripted by the Handy team.
			</div>
			<q-banner class="bg-warning text-black q-mt-lg">
				<template v-slot:avatar>
					<q-icon name="warning" color="black" />
				</template>
				This site is in BETA.
			</q-banner>
		</div>
	</q-page>
</template>

<script setup lang="ts">

import { ref } from 'vue'

</script>
