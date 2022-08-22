<template>
	<div class="text-overline col cursor-pointer" @click.stop="partnerClick">{{
			apiIndex.partnerIdToPartnerName(props.partnerId)
	}}
		<q-tooltip>
			Go to site
		</q-tooltip>
	</div>
</template>

<script setup lang="ts">
import { useIndexStore } from "src/stores/apiIndex";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const apiIndex = useIndexStore();
const props = defineProps(['partnerId']);
const router = useRouter();
function partnerClick() {
	console.log('partnerClick', props.partnerId);
	router.push("/sites/" + props.partnerId)
}
</script>

<style scoped>
</style>
