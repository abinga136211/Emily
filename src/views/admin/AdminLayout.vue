<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogout, adminMe } from '@/api/site'

const router = useRouter()
const ready = ref(false)

onMounted(async () => {
  try {
    const me = await adminMe()
    if (!me.authenticated) {
      await router.replace({ name: 'admin-login' })
      return
    }
    ready.value = true
  } catch {
    await router.replace({ name: 'admin-login' })
  }
})

const logout = async () => {
  try {
    await adminLogout()
  } finally {
    await router.replace({ name: 'admin-login' })
  }
}
</script>

<template>
  <div v-if="ready" class="admin-shell">
    <aside class="admin-shell__aside">
      <p class="admin-shell__brand">SKMC Admin</p>
      <nav class="admin-shell__nav">
        <RouterLink
          class="admin-shell__link"
          :to="{ name: 'admin-consultations' }"
          active-class="is-active"
        >
          咨询列表
        </RouterLink>
        <RouterLink
          class="admin-shell__link"
          :to="{ name: 'admin-config' }"
          active-class="is-active"
        >
          系统配置
        </RouterLink>
      </nav>
      <button type="button" class="admin-shell__logout" @click="logout">退出</button>
    </aside>
    <main class="admin-shell__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.admin-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 220px 1fr;
  background: #f4f6f8;
}

.admin-shell__aside {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 16px;
  background: #0b1f33;
  color: #fff;
}

.admin-shell__brand {
  margin: 0 0 8px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.admin-shell__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.admin-shell__link {
  padding: 10px 12px;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  border-radius: 2px;

  &.is-active,
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
}

.admin-shell__logout {
  margin-top: auto;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: #fff;
  font: inherit;
  cursor: pointer;
  text-align: left;
}

.admin-shell__main {
  padding: 28px 32px;
  overflow: auto;
}

@media (max-width: 800px) {
  .admin-shell {
    grid-template-columns: 1fr;
  }

  .admin-shell__aside {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .admin-shell__nav {
    flex-direction: row;
    flex: 1;
  }

  .admin-shell__logout {
    margin-top: 0;
  }
}
</style>
