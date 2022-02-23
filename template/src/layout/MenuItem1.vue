<template>
	<el-sub-menu v-if="menu.children && menu.children.length" :index="menu.url">
		<template #title>
			<el-icon v-if="menu.icon">
				<component :is="menu.icon" />
			</el-icon>
			<span>{{menu.menuName}}</span>
		</template>
		<MenuItem v-for="item in menu.children" :menu="item" :pKye="menu.url" :key="item.id">
		</MenuItem>
	</el-sub-menu>
	<el-menu-item v-else :index="menu.url" @click="handleItem(menu)">
		<el-icon v-if="menu.icon">
			<component :is="menu.icon" />
		</el-icon>
		<template #title>{{menu.menuName}}</template>
	</el-menu-item>
</template>

<script lang="ts" setup>
import { defineProps, PropType, ref } from 'vue'
import { useRouter } from 'vue-router'
import MenuItem from './MenuItem1.vue'
import { IMenu } from '@/store/index'
const router = useRouter()
const props = defineProps({
	menu: {
		type: Object as PropType<IMenu>,
		required: true,
	},
	pKye: {
		type: String,
		default: '',
	},
})

function handleItem(menu: IMenu) {
	router.push(menu.url)
}
</script>