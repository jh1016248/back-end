<template>
	<div class="nav-bar" :class="{active: showSideBar}">
		<el-icon class="toggle-btn" :size="30" @click="handleBtn">
			<component :is="!showSideBar ? 'expand' : 'fold'" />
		</el-icon>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item class="is-link">homepage</el-breadcrumb-item>
			<el-breadcrumb-item>promotion list</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="right">
			<el-dropdown @command="command">
				<span class="link">
					<el-icon>
						<user-filled />
					</el-icon>
					<span>{{store.state.username}}</span>
					<el-icon class="el-icon--right">
						<arrow-down />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item>退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>

</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store/index'
import { useRouter } from 'vue-router'
const store = useStore<GlobalDataProps>()
const router = useRouter()
const showSideBar = computed(() => store.state.showSideBar)
function handleBtn() {
	store.commit('CHANGE_SIDE_BAR', !showSideBar.value)
}
function command() {
	router.push('/login')
}
</script>
<style lang="less" scoped>
.nav-bar {
	height: 50px;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	display: flex;
	flex: none;
	align-items: center;
	.toggle-btn {
		display: flex;
		align-items: center;
		cursor: pointer;
		height: 100%;
		padding: 0 15px;
		margin-right: 10px;
		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.right {
		text-align: right;
		padding-right: 20px;
		flex: 1;
	}
}
.is-link {
	/deep/.el-breadcrumb__inner {
		font-weight: bold;
	}
}
</style>