<template>
	<el-form ref="form" class="custom-form" :inline="true" :model="tableData" :label-width="labelWidth">
		<el-table ref="table" :data="tableData" :border="border">
			<el-table-column v-for="(item) in columns" :label="item.label" :key="item.prop">
				<template #default="{row, $index}">
					<el-form-item v-if="!item.hidden" :style="{width: item.width || autoWidth}" :rules="ownRules[item.prop]" :prop="`[${$index}].${item.prop}`">
						<slot :name="item.prop" :row="row" :index="$index">
							<span class="is-required" v-if="item.required">*</span>
							<div class="el-form-item-content">
								<!-- 开关 type: 'switch' -->
								<el-switch v-if="item.type === 'switch'" v-bind="{
									'active-value': 1,
									'inactive-value': 0,
									...item.attrs
								}" v-on="item.on || {}" v-model="row[item.prop]" active-color="#13ce66" inactive-color="#ff4949">
								</el-switch>
								<!-- 选择框 传入 enums: [] -->
								<el-select v-else-if="item.enums" v-model="row[item.prop]" style="width: 100%" :clearable="true" :placeholder="'请选择' +item.label" v-bind="item.attrs" v-on="item.on || {}">
									<el-option v-for="item1 in item.enums" :key="item1.value" :label="item1.label" :value="item1.value">
									</el-option>
								</el-select>
								<!-- 日期时间选择器 -->
								<el-date-picker v-else-if="item.type === 'dateTime'" v-model="row[item.prop]" v-on="item.on || {}" type="datetime"
									:value-format="(item.attrs && item.attrs['value-format']) || 'YYYY-MM-DD HH:mm:ss'" style="width: 100%" :placeholder="'请选择' + item.label"> </el-date-picker>
								<!-- 文本框或者textarea 可传入 type: textarea -->
								<el-input v-else-if="!item.type || item.type == 'textarea'" :type="item.type || 'text'" :disabled="item.disabled" v-bind="item.attrs" v-on="item.on || {}"
									:placeholder="'请输入' + item.label" :clearable="true" v-model="row[item.prop]">
									<template #prepend v-if="item.prepend">
										<slot>{{item.prepend}}</slot>
									</template>
									<template #append v-if="item.append">
										<slot>{{item.append}}</slot>
									</template>
								</el-input>
							</div>
						</slot>
					</el-form-item>
				</template>
			</el-table-column>
		</el-table>
	</el-form>
</template>

<script setup lang="ts">
export interface IZgTableFormExport {
	validate: () => Promise<boolean>
	clearValidate: () => void
	resetFields: () => void
	resetForm: () => void
}
import {
	defineProps,
	PropType,
	ref,
	defineExpose,
	reactive,
} from 'vue'
import { IEnums } from '@/config/options'
interface IRule {
	validator: any
	message?: string
	trigger?: string
}
interface IColumns {
	prop: string
	label: string
	isHeader?: boolean
	text?: string
	width?: string
	type?: string
	attrs?: any
	on?: any
	radios?: IEnums[]
	enums?: IEnums[]
	prepend?: string
	append?: string
	disabled?: boolean
	startTime?: string
	endTime?: string
	required?: boolean
	rules?: IRule[]
	hidden?: boolean
}
const props = defineProps({
	labelWidth: {
		type: String,
		default: '100px',
	},
	columns: {
		type: Array as PropType<Array<IColumns>>,
		required: true,
	},
	tableData: {
		type: Array,
		required: true,
	},
	border: {
		type: Boolean,
		default: true,
	},
})

const autoWidth = ref('100%')
const ownRules: any = reactive({})
const form = ref()

// 赋值rules
props.columns.forEach((item) => {
	if (!item.rules) {
		ownRules[item.prop] = []
	} else {
		ownRules[item.prop] = item.rules
	}
	if (item.required) {
		let isSelect = item.enums || item.type == 'el-date-picker'
		ownRules[item.prop].push({
			required: true,
			message: (isSelect ? '请选择' : '请输入') + item.label,
			trigger: 'change',
		})
	}
})

function validate() {
	return new Promise((resolve, reject) => {
		form.value.validate().then(
			() => {
				resolve(true)
			},
			(res: any) => {
				form.value.scrollToField(Object.keys(res)[0])
				reject(false)
			}
		)
	})
}
function clearValidate() {
	form.value.clearValidate()
}
// 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
function resetFields() {
	form.value.resetFields()
}
function resetForm() {
	resetFields()
	clearValidate()
}

defineExpose({
	validate,
	clearValidate,
	resetFields,
	resetForm,
})
/**
 * 1.赋值当前行： tableRef.value?.handleCurrentChange(tableData.value[0])
 */

// defineExpose({
// 	selectionList,
// 	currentRow,
// 	handleCurrentChange,
// })
</script>

<style lang="less" scoped>
.custom-form {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	.el-form-item {
		display: flex;
		box-sizing: border-box;
		padding: 0 5px;
		margin-right: 0;
		margin-bottom: 0;
		&.is-error {
			margin-bottom: 15px;
		}
		:v-deep(.el-form-item__content) {
			display: flex;
			flex: 1;
		}
		.el-form-item-content{
			flex: 1;
		}
	}
}
.is-required {
	color: red;
	margin-right: 5px;
	align-self: center;
}
</style>