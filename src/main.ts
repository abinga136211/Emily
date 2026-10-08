import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/global.scss'

// 刷新后始终从页顶开始，避免浏览器恢复滚动位置导致首屏错位 / 顶栏误判为实底
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

const homePath = import.meta.env.BASE_URL.replace(/\/+$/, '') || ''
const path = window.location.pathname.replace(/\/+$/, '') || ''
const isHomePath = path === homePath || path === '' || path === '/'
if (!window.location.hash && isHomePath) {
  window.scrollTo(0, 0)
}

createApp(App).use(router).mount('#app')

if (!window.location.hash && isHomePath) {
  requestAnimationFrame(() => window.scrollTo(0, 0))
}
