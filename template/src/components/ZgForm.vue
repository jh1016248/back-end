<template>
	<el-form ref="form" class="custom-form" :inline="true" :model="sizeForm" :label-width="labelWidth" :rules="ownRules">
		<template v-for="item in columns" :key="item.prop">
			<div v-if="item.isHeader" class="custom-title">{{item.text}}</div>
			<el-form-item :class="{'is-required': item.required}" v-else-if="!item.hidden" :label="item.label + '：'" :style="{width: item.width || autoWidth}" :prop="item.prop">
				<!-- 开关 type: 'switch' -->
				<el-switch v-if="item.type === 'switch'" v-bind="{
						'active-value': 1,
						'inactive-value': 0,
						...item.attrs
					}" v-on="item.on || {}" v-model="sizeForm[item.prop]" active-color="#13ce66" inactive-color="#ff4949">
				</el-switch>
				<!-- radio -->
				<template v-else-if="item.type === 'radio'">
					<el-radio v-model="sizeForm[item.prop]" v-for="radio in item.radios" v-bind="item.attrs" v-on="item.on || {}" :key="radio.value" :label="radio.value">{{radio.label}}</el-radio>
				</template>
				<!-- 选择框 传入 enums: [] -->
				<el-select v-else-if="item.enums" v-model="sizeForm[item.prop]" style="width: 100%" :clearable="true" v-on="item.on || {}" :placeholder="'请选择' +item.label" v-bind="item.attrs">
					<el-option v-for="item1 in item.enums" :key="item1.value" :label="item1.label" :value="item1.value">
					</el-option>
				</el-select>
				<!-- 日期时间选择器 -->
				<el-date-picker v-else-if="item.type === 'dateTime'" v-model="sizeForm[item.prop]" v-on="item.on || {}" type="datetime"
					:value-format="(item.attrs && item.attrs['value-format']) || 'YYYY-MM-DD HH:mm:ss'" style="width: 100%" :placeholder="'请选择' + item.label"> </el-date-picker>
				<!-- 时间日期区间选择 -->
				<template v-else-if="item.type == 'time-range' && item.startTime && item.endTime">
					<div class="flex">
						<el-date-picker v-model="sizeForm[item.startTime]" type="datetimerange" v-on="item.on || {}" start-placeholder="开始日期"
     					 end-placeholder="结束日期" :value-format="(item.attrs && item.attrs['value-format']) || 'YYYY-MM-DD HH:mm:ss'" style="width: 100%"></el-date-picker>
						<!-- <el-date-picker v-model="sizeForm[item.startTime]" :type="item.attrs && item.attrs.type || 'datetime'"
							:value-format="(item.attrs && item.attrs['value-format']) || 'YYYY-MM-DD HH:mm:ss'" style="width: calc(50% - 10px)" placeholder="请选择开始时间">
						</el-date-picker>
						<span style="width: 20px; text-align: center; display: inline-block">-</span>
						<el-date-picker v-model="sizeForm[item.endTime]" :type="item.attrs && item.attrs.type || 'datetime'"
							:value-format="(item.attrs && item.attrs['value-format']) || 'YYYY-MM-DD HH:mm:ss'" style="width: calc(50% - 10px)" placeholder="请选择结束时间">
						</el-date-picker> -->
					</div>
				</template>
				<!-- 文本框或者textarea 可传入 type: textarea -->
				<el-input v-else-if="!item.type || item.type == 'textarea'" :type="item.type || 'text'" :disabled="item.disabled" v-bind="item.attrs" v-on="item.on || {}"
					:placeholder="'请输入' + item.label" :clearable="true" v-model="sizeForm[item.prop]">
					<template #prepend v-if="item.prepend">
						<slot>{{item.prepend}}</slot>
					</template>
					<template #append v-if="item.append">
						<slot>{{item.append}}</slot>
					</template>
				</el-input>
				<component v-else :is="item.type" v-bind="item.attrs" v-on="item.on || {}" :placeholder="'请输入' + item.label" :clearable="true"></component>
			</el-form-item>
		</template>
	</el-form>
</template>

<script setup lang="ts">
export interface IZgFormExport {
	validate: () => Promise<boolean> // 校验表单 
	clearValidate: () => void // 清除校验结果
	resetFields: () => void  // 重置表单字段数据
	resetForm: () => void // 重置表单
}
import {
	defineProps,
	onMounted,
	PropType,
	ref,
	defineExpose,
	reactive,
	onBeforeUnmount,
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
	formData: {
		type: Object,
		required: true,
	},
})

const autoWidth = ref('50%')
const ownRules: any = reactive({})
const form = ref()
const sizeForm: any = ref(props.formData)

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

function setAutoWidth() {
	const el = form.value.$el.parentNode as HTMLElement
	if (el.offsetWidth >= 900) {
		autoWidth.value = '33.3%'
	} else if (el.offsetWidth <= 600) {
		autoWidth.value = '100%'
	} else {
		autoWidth.value = '50%'
	}
}
onMounted(() => {
	setAutoWidth()
	window.addEventListener('resize', setAutoWidth)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', setAutoWidth)
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
function resetFields() {
	// 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
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

// const tableEl = ref<any>()

// onMounted(() => {

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
		.el-form-item__content {
			flex: 1;
		}
	}
}
</style>