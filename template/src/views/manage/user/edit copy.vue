<template>
	<ZgForm ref="zgForm" :columns="columns" v-model:formData="formData"></ZgForm>
	<el-button @click="handleSubmit">提交</el-button>
</template>

<script lang="ts" setup>
import ZgForm, { IZgFormExport } from '@/components/ZgForm.vue'
import { ref } from 'vue'
import { Users } from '@/config/options'
const formData = ref({
	name: '',
	endTime: '',
	startTime: '',
})
const columns = ref([
	{
		label: '时间范围',
		prop: 'name',
		type: 'time-range',
		startTime: 'startTime',
		endTime: 'endTime',
	},
	{
		label: '名称1',
		prop: 'name1',
		enums: Users.type,
		on: {
			change: (val: number) => {
				columns.value[2].hidden = val == 1
			},
		},
	},
	{
		label: '名称2',
		prop: 'name3',
		type: 'dateTime',
		hidden: false,
		on: {
			change: () => {
				console.log(11111)
			},
		},
	},
	{
		label: '名称3',
		prop: 'name2',
		type: 'switch',
		rules: [
			{
				validator: (f: any, val: number | string, callback: (e?:Error) => void)=> {
					if (val == 1) {
						return callback()
					}
					return callback(new Error('必须为1'))
				},
			},
		],
	},
	{
		label: '名称4',
		prop: 'name3',
		required: true,
		attrs: {
			maxLength: 14,
		},
	},
	{
		label: '名称5',
		prop: 'name4',
		required: true,
	},
])

const zgForm = ref<IZgFormExport>()
async function handleSubmit() {
	await zgForm.value?.validate()
	console.log('confirm')
}
</script>