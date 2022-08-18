<template>
	<div>
		{{ dayjs.duration(props.duration *
				1000).format('HH') === '00' ? dayjs.duration(props.duration *
					1000).format('mm:ss') : dayjs.duration(props.duration *
						1000).format('HH:mm:ss')
		}}
	</div>

</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from 'dayjs'
import durationJs from "dayjs/plugin/duration";
dayjs.extend(durationJs);
const props = defineProps(['duration']);

</script>
