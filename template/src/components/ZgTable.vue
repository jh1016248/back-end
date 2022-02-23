<template>
	<div class="data-count-bar" ref="dataCountBar" v-if="showDataCountBar">
		<el-icon size="18" style="margin-right: 5px;">
			<document />
		</el-icon>
		<div>
			当前页共有<span class="c-blue">{{ tableData && tableData.length || 0 }}</span>条数据
			，已选择<span>{{ singleCheck && !!singleId ? 1 : selectionList.length }}</span>条数据。
		</div>
		<span v-if="selectionList.length > 0" class="c-blue link" @click="handleEmptySelection">清空</span>
	</div>
	<div ref="tableEl">
		<el-table ref="tableRef" :data="tableData" :border="border" v-loading="loading" size="medium" :width="width" :row-key="rowKey" :sort-change="sortChange" :max-height="customHeight || height"
			:highlight-current-row="highlightCurrentRow || singleCheck" @current-change="handleCurrentChange" @row-click="rowClick" @selection-change="selectionChange">
			<!-- 多选 -->
			<el-table-column v-if="multipleCheck" class="multiple-check-column" type="selection" width="50">
			</el-table-column>
			<!-- 单选 -->
			<el-table-column v-else-if="singleCheck" width="50">
				<template #header></template>
				<template #default="scope">
					<el-radio v-model="singleId" class="radio-no-label" :label="scope.row.id"></el-radio>
				</template>
			</el-table-column>
			<template v-for="item in myColumns" :key="item.prop">
				<el-table-column :prop="item.prop" :label="item.label" :width="item.width" align="center" :sortable="item.sortable" :type="item.type">
					<!-- 自定义头部 -->
					<template #header v-if="!!item.headerSlot">
						<slot :name="item.headerSlot"></slot>
					</template>
					<template #default="scope">
						<!-- 自定义内容 -->
						<slot :name="item.listProp ? `${item.listProp}${item.prop}` : item.prop" :row="scope.row" :index="scope.$index">
							<!-- 传入enums的 -->
							<span v-if="item.enums">
								{{getEnumVal(item.enums, scope.row[item.prop])}}
							</span>
							<!-- 传入子列表prop,展示多行 -->
							<div v-else-if="item.listProp">
								<div class="list-item" v-for="(child, index) in scope.row[item.listProp]" :key="index">
									{{child[item.prop]}}
								</div>
							</div>
							<!-- 普通列，直接展示值 -->
							<span v-else>{{scope.row[item.prop]}}</span>
						</slot>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<el-pagination class="zg-table-pagination" background v-model:page-size="pageSize" @current-change="getList" @size-change="getList" v-model:current-page="currentPage"
			layout="total, sizes, prev, pager, next" :total="total">
		</el-pagination>
	</div>
</template>

<script setup lang="ts">
export interface IColumns {
	label?: string // 表头
	prop: string
	width?: string | number
	enums?: IEnums[]
	headerSlot?: string
	hidden?: boolean
	sortable?: true | false | 'custom'
	type?: 'expand'
	slot?: boolean
	listProp?: string
}
export interface IZgTableExport<T> {
	selectionList: Ref<Array<T>>
	currentRow: Ref<T>
	handleCurrentChange: (row: T) => void
	getList: () => void
	resize: () => void
}
import {
	defineProps,
	ref,
	Ref,
	reactive,
	computed,
	PropType,
	defineExpose,
	onMounted,
	defineEmits,
	nextTick,
	onBeforeUnmount,
} from 'vue'
import { ElTable } from 'element-plus'
import { IEnums } from '@/config/options'
import request from '@/utils/request'

interface IRow {
	id: string
}
const emits = defineEmits(['update:tableData'])
const props = defineProps({
	size: Number,
	width: [String, Number],
	height: [String, Number],
	maxHeight: [String, Number],
	border: Boolean,
	rowKey: String,
	sortChange: Function, 
	highlightCurrentRow: Boolean, // 高亮当前行
	multipleCheck: {
		type: Boolean,
		default: false,
	},
	singleCheck: {
		type: Boolean,
		default: false,
	},
	showDataCountBar: {
		type: Boolean,
		default: false,
	},
	tableData: { type: Array, default: () => [] },
	columns: {
		type: Array as PropType<Array<IColumns>>,
		required: true,
	},
	fullPage: {
		type: Boolean,
		default: true,
	},
	queryForm: {
		type: Object,
	},
	requestUrl: {
		type: String,
	},
	autoInit: {
		type: Boolean,
		default: true,
	},
})

const myColumns = computed(() => {
	return props.columns.filter((item): boolean => !item.hidden)
})

const singleId = ref('')
const tableRef = ref()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const currentRow = ref({})
const selectionList = reactive([])
const customHeight = ref(0)
const loading = ref(false)

interface Res {
	code: string
	result: any
}

function getList() {
	if (props.requestUrl) {
		loading.value = true
		request
			.post(props.requestUrl, {
				obj: props.queryForm,
				size: pageSize.value,
				currentPage: currentPage.value,
			})
			.then((res: any) => {
				loading.value = false
				if (res.code === '0') {
					const { result } = res
					total.value = result.total
					emits('update:tableData', result.records)
				}
			})
			.catch((e) => {
				loading.value = false
			})
	}
}

function rowClick(row: IRow) {
	if (props.multipleCheck) {
		tableRef.value.toggleRowSelection(row)
	}
}

function selectionChange(selection: []) {
	selectionList.splice(0, selectionList.length, ...selection)
}

function handleEmptySelection() {
	selectionList.length = 0
	tableRef.value.clearSelection()
}

function handleCurrentChange(row: IRow) {
	if (props.singleCheck) {
		tableRef.value.setCurrentRow(row)
		currentRow.value = row
		singleId.value = row.id
	}
}

function getEnumVal(
	enums: IEnums[],
	value: string | number = ''
): string | undefined {
	if (!enums.length || value === '') return ''
	const item = enums.find((item) => item.value == value)
	return item?.label
}
function resize() {
	let height =
		tableEl.value?.parentNode.offsetHeight - tableEl.value?.offsetTop + 20
	customHeight.value = height < 300 ? 300 : height
}
/**
 * 1.赋值当前行： tableRef.value?.handleCurrentChange(tableData.value[0])
 */

defineExpose({
	selectionList,
	currentRow,
	handleCurrentChange,
	getList,
	resize,
})

const tableEl = ref<any>()

onMounted(() => {
	if (props.fullPage) {
		nextTick(() => {
			resize()
		})
		window.addEventListener('resize', resize)
	}
	if (props.autoInit) {
		getList()
	}
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', resize)
})
</script>

<style lang="less" scoped>
.data-count-bar {
	box-sizing: border-box;
	display: flex;
	margin: 5px 0;
	background: #e6f7ff;
	border: 1px solid #91d5ff;
	height: 36px;
	line-height: 34px;
	padding-left: 10px;
	border-radius: 3px;
	align-items: center;
	font-size: 14px;
	.c-blue {
		margin: 0 5px;
	}
}
.list-item {
	padding: 10px 0;
	border-bottom: 1px solid #ccc;
	&:last-child {
		border-bottom: 0;
	}
}
.zg-table-pagination {
	justify-content: flex-end;
	padding: 5px 0;
	:v-deep(.btn-next) {
		margin-right: 0;
	}
}
:v-deep(.el-table-column--selection) {
	.el-checkbox {
		height: 0;
		margin-left: 7px;
	}
}
.radio-no-label {
	height: 0;
	margin-left: 7px;
	:v-deep(.el-radio__label) {
		display: none;
	}
}
</style>