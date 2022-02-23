<template>
	<el-dialog v-bind="props" :before-close="handleClose" :top="top">
		<slot></slot>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose" v-if="cancelText">{{cancelText}}</el-button>
				<el-button type="primary" @click="confirm" v-if="confirmText">{{confirmText}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive } from 'vue'
import { ElDialog } from 'element-plus'
const emits = defineEmits(['confirm', 'update:modelValue', 'close'])

const props = defineProps({
	appendToBody: {
		type: Boolean,
		default: false,
	},
	destroyOnClose: {
		type: Boolean,
		default: false,
	},
	center: {
		type: Boolean,
		default: false,
	},
	customClass: {
		type: String,
		default: '',
	},
	closeOnClickModal: {
		type: Boolean,
		default: true,
	},
	closeOnPressEscape: {
		type: Boolean,
		default: true,
	},
	fullscreen: {
		type: Boolean,
		default: false,
	},
	lockScroll: {
		type: Boolean,
		default: true,
	},
	modal: {
		type: Boolean,
		default: true,
	},
	showClose: {
		type: Boolean,
		default: true,
	},
	openDelay: {
		type: Number,
		default: 0,
	},
	closeDelay: {
		type: Number,
		default: 0,
	},
	top: {
		type: String,
		default: '20px',
	},
	modalClass: String,
	zIndex: {
		type: Number,
	},
	modelValue: {
		type: Boolean,
		default: false,
		required: true,
	},
	title: {
		type: String,
		default: '模态框',
	},
	width: {
		type: String,
		default: '600px',
	},
	cancelText: {
		type: String,
		default: '取消',
	},
	confirmText: {
		type: String,
		default: '确定',
	},
})
function handleClose() {
	emits('update:modelValue', false)
	emits('close')
}

function confirm() {
	emits('confirm')
	// handleClose()
}
</script>