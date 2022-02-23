<template>
	<ZgTableForm ref="tableForm" :columns="columns" :tableData="formData.users">
	</ZgTableForm>
	<el-button @click="handleSubmit">提交</el-button>
</template>

<script lang="ts" setup>
import ZgTableForm from '@/components/ZgTableForm.vue'
import { ref } from 'vue'
import { Users } from '@/config/options'
const formData = ref({
	name: '',
	endTime: '',
	startTime: '',
	name3: '',
	name2: 0,
	users: [
		{
			name: '',
			age: '',
			type: '',
			list: [
				{ listName: '', listAge: '' },
				{ listName: '', listAge: '' },
			],
		},
		{
			name: '',
			age: '',
			type: '',
			list: [
				{ listName: '', listAge: '' },
				{ listName: '', listAge: '' },
			],
		},
	],
})
const columns = ref([
	{
		label: '姓名',
		prop: 'name',
		required: true,
	},
	{
		label: '年龄',
		prop: 'age',
		rules: [
			{
				trigger: 'change',
				validator: (f, val, callback) => {
					if (val == '') {
						return callback(new Error('请输入年龄'))
					}
					if (val < 18) {
						return callback(new Error('未满18岁！'))
					}
					return callback()
				},
			},
		],
	},
	{
		label: '类型',
		prop: 'type',
		enums: Users.type,
	},
])

const tableForm: any = ref()
async function handleSubmit() {
	await tableForm.value.validate()
	console.log(1)
}
</script>