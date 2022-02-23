<template>
	<side-bar></side-bar>
	<div class="app-container">
		<nav-bar></nav-bar>
		<div class="container">
			<div class="page-container">
				<router-view v-slot="{ Component }">
					<keep-alive :include="keepAliveRoute">
						<component :is="Component" />
					</keep-alive>
				</router-view>
			</div>
		</div>
	</div>
</template>


<script lang="ts" setup>
import { reactive } from 'vue'
import SideBar from './SideBar.vue'
import NavBar from './NavBar.vue'

const keepAliveRoute = reactive([''])
</script>

<style lang="less" scoped>
.app-container {
	flex: 1;
	transition: all 0.3s;
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
	.container {
		flex: 1;
		background: #fff;
		margin: 10px;
		overflow: scroll;
	}
	.page-container {
		box-sizing: border-box;
		padding: 10px 10px 0;
		height: 100%;
	}
}
</style>