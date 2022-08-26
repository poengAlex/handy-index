<template>
	<q-page class="row items-center justify-evenly">
		<div>
			<div class="text-h1">
				Handys script Index
			</div>
			<div class="text-caption q-mt-sm">
				A collection of scripts scripted by the Handy team.
			</div>
			<q-banner class="bg-warning text-black q-mt-lg">
				<template v-slot:avatar>
					<q-icon name="warning" color="black" />
				</template>
				This page is in BETA. While it is in BETA it is <b>free</b> to use. When complete, this service will
				have
				a fee.
			</q-banner>
		</div>
	</q-page>
</template>

<script setup lang="ts">

import { ref } from 'vue'

</script>
