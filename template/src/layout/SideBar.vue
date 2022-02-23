<template>
	<div class="side-bar" :class="{active: showSideBar}">
		<el-menu :default-active="defaultActive" background-color="#304156" text-color="#fff" class="el-menu-vertical-demo" :collapse="!showSideBar" :collapse-transition="showSideBar">
			<MenuItem v-for="item in userMenus" :menu="item" :key="item.id">
			</MenuItem>
		</el-menu>
	</div>
</template>
<script lang="ts" setup>
import { useStore } from 'vuex'
import { computed, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { GlobalDataProps } from '@/store/index'
import MenuItem from './MenuItem1.vue'
const router = useRouter()
const defaultActive = ref(router.currentRoute.value.path)
const store = useStore<GlobalDataProps>()
const showSideBar = computed(() => store.state.showSideBar)

interface IMenu {
	menuName: string
	url: string
	children?: IMenu[]
	icon?: string
}
const userMenus: IMenu[] = reactive([
	{
		menuName: '活动管理',
		url: '/manage/user/index',
		icon: 'position',
	},
	{
		menuName: '模板管理',
		url: '/template',
		icon: 'position',
	},
	{
		menuName: '用户管理',
		url: '/user',
		icon: 'user',
	},
	{
		menuName: '文章管理',
		url: '/article',
		icon: 'document',
	},
])
</script>

<style lang="less" scoped>
.side-bar {
	width: 64px;
	height: 100%;
	background: #304156;
	box-sizing: border-box;
	transition: all 0.3s;
	&.active {
		width: 210px;
		padding: 10px;
	}
}
.el-menu-vertical-demo {
	overflow: hidden;
	border-right: none;
}
</style>