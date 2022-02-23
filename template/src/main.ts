import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import * as ElementPlusIcon from '@element-plus/icons'
import './styles/reset.less'
import 'element-plus/dist/index.css'
import './styles/index.less'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ZgModal from '@/components/ZgModal.vue'
import ZgQuery from '@/components/ZgQuery.vue'
import ZgForm from '@/components/ZgForm.vue'
import ZgTable from '@/components/ZgTable.vue'

const app = createApp(App)
    .use(store)
    .use(router)
    .use(ElementPlus, { locale: zhCn })

Object.entries(ElementPlusIcon).forEach(([name, component]) => {
    app.component(name, component)
})
app.component('ZgModal', ZgModal)
app.component('ZgQuery', ZgQuery)
app.component('ZgForm', ZgForm)
app.component('ZgTable', ZgTable)
app.mount('#app')
