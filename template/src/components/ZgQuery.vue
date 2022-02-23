<template>
	<el-form ref="form" class="custom-form" :inline="true" :model="sizeForm" :label-width="labelWidth">
		<template v-for="(item, index) in columns" :key="item.prop">
			<el-form-item v-if="index < visibleLength || showMore" :label="item.label + '：'" :prop="item.prop" :style="{width: autoWidth}">
				<!-- 选择框 传入 enums: [] -->
				<el-select v-if="item.enums" v-model="sizeForm[item.prop]" style="width: 100%" :clearable="true" :placeholder="'请选择' +item.label" v-bind="item.attrs" v-on="item.on || {}">
					<el-option v-for="item1 in item.enums" :key="item1.value" :label="item1.label" :value="item1.value">
					</el-option>
				</el-select>
				<!-- 日期时间选择器 -->
				<el-date-picker v-else-if="item.type === 'dateTime'" v-model="sizeForm[item.prop]" v-on="item.on || {}" type="datetime"
					:value-format="(item.attrs && item.attrs['value-format']) || 'YYYY-MM-DD HH:mm:ss'" style="width: 100%" :placeholder="'请选择' + item.label"> </el-date-picker>
				<!-- 时间日期区间选择 -->
				<template v-else-if="item.type == 'time-range' && item.startTime && item.endTime">
					<div class="flex">
						<el-date-picker v-model="sizeForm[item.startTime]" :type="item.attrs && item.attrs.type || 'datetime'"
							:value-format="(item.attrs && item.attrs['value-format']) || 'YYYY-MM-DD HH:mm:ss'" style="width: calc(50% - 10px)" placeholder="请选择开始时间">
						</el-date-picker>
						<span style="width: 20px; text-align: center; display: inline-block">-</span>
						<el-date-picker v-model="sizeForm[item.endTime]" :type="item.attrs && item.attrs.type || 'datetime'"
							:value-format="(item.attrs && item.attrs['value-format']) || 'YYYY-MM-DD HH:mm:ss'" style="width: calc(50% - 10px)" placeholder="请选择结束时间">
						</el-date-picker>
					</div>
				</template>
				<!-- 文本框或者textarea 可传入 type: textarea -->
				<el-input v-else-if="!item.type" :type="item.type || 'text'" :disabled="item.disabled" v-bind="item.attrs" v-on="item.on || {}" :placeholder="'请输入' + item.label" :clearable="true"
					v-model="sizeForm[item.prop]" @keydown.enter="handleQuery">
					<template #prepend v-if="item.prepend">
						<slot>{{item.prepend}}</slot>
					</template>
					<template #append v-if="item.append">
						<slot>{{item.append}}</slot>
					</template>
				</el-input>
			</el-form-item>
		</template>
		<el-form-item style="flex: 1;">
			<div class="query-actions">
				<el-button type="primary" @click="handleQuery">查询</el-button>
				<el-button @click="handleReset">重置</el-button>
				<span class="show-more-btn" v-if="showMoreBtn" @click="handleShowMore">
					<el-icon>
						<arrow-up-bold v-if="showMore" />
						<arrow-down-bold v-else />
					</el-icon>
					{{showMore ? '收起' : '展开'}}
				</span>
			</div>
		</el-form-item>
	</el-form>
</template>
<script setup lang="ts">
export interface IRule {
	validator: any
	message?: string
	trigger?: string
}
export interface IColumns {
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
import {
	defineProps,
	onMounted,
	defineEmits,
	PropType,
	ref,
	getCurrentInstance,
	nextTick,
	onBeforeUnmount,
} from 'vue'
import { IEnums } from '@/config/options'
import { IZgTableExport } from '@/components/ZgTable.vue'

const props = defineProps({
	labelWidth: {
		type: String,
	},
	columns: {
		type: Array as PropType<Array<IColumns>>,
		required: true,
	},
	queryForm: {
		type: Object,
		required: true,
	},
})
const emits = defineEmits(['query', 'reset'])
const showMore = ref(false)
const showMoreBtn = ref(false)
const visibleLength = ref(6)
const autoWidth = ref('50%')
const form = ref()
const sizeForm: any = ref(props.queryForm)
const comp = getCurrentInstance()

function setAutoWidth() {
	const el = form.value.$el.parentNode as HTMLElement
	if (el.offsetWidth >= 900) {
		showMoreBtn.value = props.columns.length > 8
		visibleLength.value = 7
		autoWidth.value = '25%'
	} else {
		showMoreBtn.value = props.columns.length > 6
		autoWidth.value = '33.3%'
		visibleLength.value = 5
	}
}

onMounted(() => {
	setAutoWidth()
	window.addEventListener('resize', setAutoWidth)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', setAutoWidth)
})

function handleReset() {
	form.value.resetFields()
	emits('reset')
}
function handleQuery() {
	const tableRef = comp?.parent?.refs.tableRef as IZgTableExport<any>
	tableRef && tableRef.getList()
	emits('query')
}
function handleShowMore() {
	const tableRef = comp?.parent?.refs.tableRef as IZgTableExport<any>
	showMore.value = !showMore.value
	nextTick(() => {
		tableRef && tableRef.resize()
	})
}

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
		margin-bottom: 5px;
		.el-form-item__content {
			flex: 1;
		}
	}
}
.query-actions{
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.show-more-btn {
	padding-left: 10px;
	line-height: 16px;
	vertical-align: middle;
	cursor: pointer;
	.el-icon {
		vertical-align: middle;
		margin-top: -4px;
	}
}
</style>