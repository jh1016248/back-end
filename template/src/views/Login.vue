<template>
	<div class="login-container">
		<div class="login-box">
			<div class="logo">
				<div class="logo-text" :style="{fontSize: '32px' }">管理平台</div>
			</div>

			<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" label-position="left">
				<el-form-item prop="username">
					<el-icon size="26" style="margin-top: -5px; vertical-align: middle" color="rgb(27, 56, 119)">
						<user />
					</el-icon>
					<el-input ref="usernameRef" v-model="loginForm.username" placeholder="用户名/手机号码" name="username" type="text" tabindex="1" />
				</el-form-item>

				<el-form-item prop="password">
					<el-icon size="26" style="margin-top: -5px; vertical-align: middle" color="rgb(27, 56, 119)">
						<key />
					</el-icon>
					<el-input :key="passwordType" ref="passwordRef" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" @keyup="checkCapslock"
						@blur="capsTooltip = false" @keyup.enter="handleLogin" />
					<span class="show-pwd" @click="showPwd">
						<svg style="width: 1em; height: 1em;" v-if="passwordType === 'password'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 64" id="icon-eye">
							<path
								d="M127.072 7.994c1.37-2.208.914-5.152-.914-6.87-2.056-1.717-4.797-1.226-6.396.982-.229.245-25.586 32.382-55.74 32.382-29.24 0-55.74-32.382-55.968-32.627-1.6-1.963-4.57-2.208-6.397-.49C-.17 3.086-.399 6.275 1.2 8.238c.457.736 5.94 7.36 14.62 14.72L4.17 35.96c-1.828 1.963-1.6 5.152.228 6.87.457.98 1.6 1.471 2.742 1.471s2.284-.49 3.198-1.472l12.564-13.983c5.94 4.416 13.021 8.587 20.788 11.53l-4.797 17.418c-.685 2.699.686 5.397 3.198 6.133h1.37c2.057 0 3.884-1.472 4.341-3.68L52.6 42.83c3.655.736 7.538 1.227 11.422 1.227 3.883 0 7.767-.49 11.422-1.227l4.797 17.173c.457 2.208 2.513 3.68 4.34 3.68.457 0 .914 0 1.143-.246 2.513-.736 3.883-3.434 3.198-6.133l-4.797-17.172c7.767-2.944 14.848-7.114 20.788-11.53l12.336 13.738c.913.981 2.056 1.472 3.198 1.472s2.284-.49 3.198-1.472c1.828-1.963 1.828-4.906.228-6.87l-11.65-13.001c9.366-7.36 14.849-14.474 14.849-14.474z">
							</path>
						</svg>
						<svg style="width: 1em; height: 1em;" v-else xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 1024 1024" id="icon-eye-open">
							<path
								d="M512 128q69.675 0 135.51 21.163t115.498 54.997 93.483 74.837 73.685 82.006 51.67 74.837 32.17 54.827L1024 512q-2.347 4.992-6.315 13.483T998.87 560.17t-31.658 51.669-44.331 59.99-56.832 64.34-69.504 60.16-82.347 51.5-94.848 34.687T512 896q-69.675 0-135.51-21.163t-115.498-54.826-93.483-74.326-73.685-81.493-51.67-74.496-32.17-54.997L0 513.707q2.347-4.992 6.315-13.483t18.816-34.816 31.658-51.84 44.331-60.33 56.832-64.683 69.504-60.331 82.347-51.84 94.848-34.816T512 128.085zm0 85.333q-46.677 0-91.648 12.331t-81.152 31.83-70.656 47.146-59.648 54.485-48.853 57.686-37.675 52.821-26.325 43.99q12.33 21.674 26.325 43.52t37.675 52.351 48.853 57.003 59.648 53.845T339.2 767.02t81.152 31.488T512 810.667t91.648-12.331 81.152-31.659 70.656-46.848 59.648-54.186 48.853-57.344 37.675-52.651T927.957 512q-12.33-21.675-26.325-43.648t-37.675-52.65-48.853-57.345-59.648-54.186-70.656-46.848-81.152-31.659T512 213.334zm0 128q70.656 0 120.661 50.006T682.667 512 632.66 632.661 512 682.667 391.339 632.66 341.333 512t50.006-120.661T512 341.333zm0 85.334q-35.328 0-60.33 25.002T426.666 512t25.002 60.33T512 597.334t60.33-25.002T597.334 512t-25.002-60.33T512 426.666z">
							</path>
						</svg>
					</span>
				</el-form-item>
				<el-button :loading="loading" type="primary" style="width:100%; height: 50px; margin-top: 40px;" @click.prevent="handleLogin">登录</el-button>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { useStore } from 'vuex'

const loginForm = reactive({ username: '', password: '' })
const rememberPwd = ref(true)
const loginRules = ref({
	username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
const passwordType = ref('password')
const capsTooltip = ref(false)
const loading = ref(false)
const redirect = ref('/')
const usernameRef = ref()
const passwordRef = ref()
const loginFormRef = ref()
const store = useStore()
const router = useRouter()

function checkCapslock({ shiftKey, key }: { shiftKey: string; key: string }) {
	if (key && key.length === 1) {
		if (
			(shiftKey && key >= 'a' && key <= 'z') ||
			(!shiftKey && key >= 'A' && key <= 'Z')
		) {
			capsTooltip.value = true
		} else {
			capsTooltip.value = false
		}
	}
	if (key === 'CapsLock' && capsTooltip.value === true) {
		capsTooltip.value = false
	}
}
function showPwd() {
	if (passwordType.value === 'password') {
		passwordType.value = ''
	} else {
		passwordType.value = 'password'
	}
	nextTick(() => {
		passwordRef.value.focus()
	})
}
function handleLogin() {
	loginFormRef.value.validate().then(async () => {
		if (rememberPwd.value) {
			localStorage.userAccount = loginForm.username
		}
		if (!rememberPwd.value) {
			localStorage.userAccount = ''
		}
		loading.value = true
		try {
			await store.dispatch('login', {
				userNameOrPhone: loginForm.username,
				password: loginForm.password,
			})
			loading.value = false
			// // const { SystemType, SystemPath } = route.query
			// // if (SystemType == 1 && SystemPath) {
			// // 	let backUrl = decodeURIComponent(SystemPath)
			// // 	backUrl +=
			// // 		(backUrl.indexOf('?') >= 0 ? '&' : '?') +
			// // 		`token=${encodeURIComponent(localStorage.token)}`
			// // 	location.href = backUrl
			// // 	return
			// // }
			// await store.dispatch('getUserMenus')
			let url = redirect.value
			router.replace(decodeURIComponent(url))
		} catch (e) {
			loading.value = false
		}
	})
}
// function getOtherQuery(query) {
// 	return Object.keys(query).reduce((acc, cur) => {
// 		if (cur !== 'redirect') {
// 			acc[cur] = query[cur]
// 		}
// 		return acc
// 	}, {})
// }

onMounted(() => {
	if (localStorage.userAccount !== undefined) {
		let account = localStorage.userAccount || ''
		loginForm.username = account
	}
	if (loginForm.username === '') {
		usernameRef.value.focus()
	} else if (loginForm.password === '') {
		passwordRef.value.focus()
	}
})
</script>

<style lang="less">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

@bg: #283443;
.login-box {
	position: absolute;
	width: 620px;
	height: 500px;
	background: #fff;
	box-shadow: 0 5px 18px rgba(0, 34, 76, 0.3);
	border-radius: 9px;
	left: 50%;
	margin-left: -310px;
	top: 50%;
	margin-top: -250px;
	.logo {
		.logo-text {
			text-align: center;
			color: #0a3976;
			width: 100%;
			padding-top: 90px;
			font-size: 24px;
		}
	}
}
.login-form {
	position: relative;
	width: 408px;
	max-width: 100%;
	padding: 0 35px 0;
	margin: 0 auto 0;
	overflow: hidden;
	box-sizing: border-box;
}
/* reset element-ui css */
.login-container {
	position: relative;
	width: 1920px;
	background: url('../assets/images/login-bg.png') center center no-repeat;
	background-size: 100% 100%;

	.el-input {
		display: inline-block;
		height: 47px;
		width: 85%;

		input {
			background: transparent;
			border: 0px;
			-webkit-appearance: none;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			// color: $light_gray;
			font-size: 14px;
			height: 47px;
			// caret-color: $cursor;

			&:-webkit-autofill {
			}
		}
	}

	.el-form-item {
		height: 92px;
		padding-top: 45px;
		box-sizing: border-box;
		border-bottom: 1px solid #ccc;
		color: #454545;
		margin-bottom: 0;
	}
}
</style>

<style lang="less" scoped>
@bg: #2d3a4b;

.el-form-item__content {
	line-height: 1;
}
.login-container {
	min-height: 100%;
	width: 100%;
	background-color: @bg;

	position: relative;
	max-width: 100%;
	padding: 0 35px 0;
	margin: 0 auto 0;
	overflow: hidden;
	.fa {
		font-size: 28px;
		color: #0a3976;
		vertical-align: -5px;
		margin: 0 0 0 18px;
		width: 22px;
	}

	.tips {
		font-size: 14px;
		color: #fff;
		margin-bottom: 10px;

		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}

	.show-pwd {
		position: absolute;
		right: 10px;
		top: 14px;
		font-size: 16px;
		// color: $dark_gray;
		cursor: pointer;
		user-select: none;
	}
	.remember-bar {
		margin-top: 28px;
		font-size: 14px;
		margin-bottom: 40px;
	}
	.thirdparty-button {
		position: absolute;
		right: 0;
		bottom: 6px;
	}

	@media only screen and (max-width: 470px) {
		.thirdparty-button {
			display: none;
		}
	}
}
</style>
