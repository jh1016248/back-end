<template>
	<ZgQuery :queryForm="queryForm" :columns="queryColumns"></ZgQuery>
	<el-button type="danger" @click="handleDelete">删除</el-button>
	<ZgTable ref="tableRef" :requestUrl="requestUrl" :queryForm="queryForm" :showDataCountBar="true" singleCheck border v-model:tableData="tableData" :columns="columns">
		<template #age="{row}">
			{{row}}
		</template>
	</ZgTable>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import ZgQuery from '@/components/ZgQuery.vue'
import ZgTable, { IColumns, IZgTableExport } from '@/components/ZgTable.vue'
import { Users } from '@/config/options'
import apis from '@/config/apis'
import router from '@/router'

interface IDataItem {
	id: string
	name: string
	age: number
	sex: number
	type: number
}
const requestUrl = ref(apis.getList)
const tableRef = ref<IZgTableExport<IDataItem>>()
const queryColumns = ref([
	{
		label: '名称1',
		prop: 'name1',
		enums: Users.type,
	},
	{
		label: '名称2',
		prop: 'name2',
	},
])
const queryForm = ref({})
const columns = reactive<IColumns[]>([
	// { prop: 'expand', type: 'expand' },
	{ label: '姓名', prop: 'vender', width: 100 },
	{ label: '用户类型', prop: 'type', enums: Users.type },
	{ label: '年龄', prop: 'workshopName' },
	{ label: '设备型号', prop: 'unitType' },
])
let tableData = ref<IDataItem[]>([])

function handleDelete() {
	router.push('/manage/user/edit/0')
	console.log(tableRef.value?.currentRow, tableRef.value?.selectionList)
}
</script>
