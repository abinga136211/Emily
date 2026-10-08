import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import ServicesView from '@/views/ServicesView.vue'
import IndustriesView from '@/views/IndustriesView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '跨境金融合规与管理咨询' }
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesView,
      meta: { title: '核心服务' }
    },
    {
      path: '/industries',
      name: 'industries',
      component: IndustriesView,
      meta: { title: '行业解决方案' }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { title: '关于我们' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: { title: '联系咨询' }
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: { title: '后台登录', admin: true }
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { admin: true },
      children: [
        { path: '', redirect: { name: 'admin-consultations' } },
        {
          path: 'consultations',
          name: 'admin-consultations',
          component: () => import('@/views/admin/AdminConsultationsView.vue'),
          meta: { title: '咨询列表', admin: true }
        },
        {
          path: 'config',
          name: 'admin-config',
          component: () => import('@/views/admin/AdminConfigView.vue'),
          meta: { title: '系统配置', admin: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: '页面未找到' }
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 96
      }
    }
    if (to.name === 'home') {
      return { top: 0 }
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
