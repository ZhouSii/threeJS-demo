import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
// 用来注入 Windi CSS 所需的样式，一定要加上！
import 'virtual:windi.css'
// 引入vant组件
import { vantPlugins } from './plugins/vant'

const app = createApp(App)

app.use(router)
app.use(vantPlugins)

app.mount('#app')
