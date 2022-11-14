<template>
	<div class="row container">
		<div class="col-12 q-pa-xs">
			<q-input class="" filled dense debounce="100" v-model="filter" placeholder="Search tag names"
				@update:model-value="filterTags()" clearable>
				<template v-slot:append>
					<q-icon name="search" />
				</template>
			</q-input>
			<div class="q-gutter-sm">
				<q-icon name="sort"></q-icon>
				<q-btn flat dense :icon="sortOrderDescending ? 'arrow_downward' : 'arrow_upward'"
					@click="sortOrderDescending = !sortOrderDescending; filterTags()">
				</q-btn>
				<q-radio v-model="sortBy" val="tagId" label="Alphabetically" @update:model-value="filterTags" />
				<q-radio v-model="sortBy" val="count" label="Video count" @update:model-value="filterTags" />
			</div>
			<small class="q-ml-xs">Showing {{ tagsFiltered.length }} of {{ tags.length }} tags</small>
		</div>
		<div class="q-pa-sm">
			<TagVue v-for="tag in tagsFiltered" :key="tag.tagId" :tag="tag.tagId" :count="tag.count" />
		</div>
		<q-inner-loading :showing="loading">
			<q-spinner-gears size="50px" :color="settings.darkMode ? 'grey-2' : 'black'" />
		</q-inner-loading>
	</div>

</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import TagVue from "src/components/Tag.vue";
import { useIndexStore } from 'src/stores/apiIndex';
import { Tag } from "src/_SCRIPTAPIINDEX";
import { randomIntFromInterval } from "src/logic/utils";
import { useSettingsStore } from "src/stores/settings";
const indexStore = useIndexStore();
const filter = ref("");
const sortOrderDescending = ref(true);
const loading = ref(true);
const sortBy = ref<"tagId" | "count">("count");
const tags = ref<Tag[]>([]);
const tagsFiltered = ref<Tag[]>([]);
const settings = useSettingsStore();
const MAX_COUNT_TO_SHOW = 300;

function appendTags(_tags: Tag[]) {
	_tags.forEach(tag => {
		tags.value.push(tag);
	});
}

function filterTags() {
	tagsFiltered.value.length = 0;
	tags.value.forEach(tag => {
		if (tag.tagId.includes(filter.value)) {
			tagsFiltered.value.push(tag);
		}
	});

	function compareDescending(a: any, b: any) {
		if (a[sortBy.value] < b[sortBy.value]) {
			return 1;
		}
		if (a[sortBy.value] > b[sortBy.value]) {
			return -1;
		}
		return 0;
	}
	function compareAscending(a: any, b: any) {
		if (a[sortBy.value] < b[sortBy.value]) {
			return -1;
		}
		if (a[sortBy.value] > b[sortBy.value]) {
			return 1;
		}
		return 0;
	}

	if (sortOrderDescending.value) {
		tagsFiltered.value.sort(compareDescending);
	} else {
		tagsFiltered.value.sort(compareAscending);
	}

	if (tagsFiltered.value.length > MAX_COUNT_TO_SHOW) {
		tagsFiltered.value = tagsFiltered.value.slice(0, MAX_COUNT_TO_SHOW);
	}
}

onMounted(async () => {
	console.log('onMounted');
	let done = false;
	const TAKE = 1000;
	let skip = 0;
	while (!done) {
		try {
			const _tags = await indexStore.getApi().index.getTags(TAKE, skip);
			appendTags(_tags);
			console.log("_tags.length:", _tags.length);
			if (_tags.length < TAKE) {
				done = true;
			} else {
				skip += TAKE;
			}
		} catch (err) { console.error(err); done = true }
	}
	console.log("tags.value[0]:", tags.value[0]);

	filterTags();
	loading.value = false;
});
</script>

<style scoped>

</style>
