<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin, adminMe } from '@/api/site'

const router = useRouter()
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const me = await adminMe()
    if (me.authenticated) {
      await router.replace({ name: 'admin-consultations' })
    }
  } catch {
    // ignore — show login form
  }
})

const onSubmit = async () => {
  if (loading.value) return
  error.value = ''
  loading.value = true
  try {
    await adminLogin(password.value)
    await router.replace({ name: 'admin-consultations' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-login">
    <form class="admin-login__card" @submit.prevent="onSubmit">
      <h1 class="admin-login__title">后台登录</h1>
      <p class="admin-login__hint">请输入管理口令</p>
      <label class="admin-login__field">
        <span>口令</span>
        <input
          v-model="password"
          type="password"
          name="password"
          autocomplete="current-password"
          required
        />
      </label>
      <p v-if="error" class="admin-login__error" role="alert">{{ error }}</p>
      <button class="admin-login__btn" type="submit" :disabled="loading">
        {{ loading ? '登录中…' : '登录' }}
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.admin-login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(160deg, #0b1f33 0%, #1a3a55 50%, #0e2438 100%);
}

.admin-login__card {
  width: min(100%, 380px);
  padding: 32px 28px;
  background: #fff;
  border: 1px solid #d7dee7;
}

.admin-login__title {
  margin: 0;
  font-size: 1.5rem;
  color: #0b1f33;
}

.admin-login__hint {
  margin: 8px 0 24px;
  color: #5a6b7d;
  font-size: 0.9rem;
}

.admin-login__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.85rem;
  color: #334155;

  input {
    padding: 10px 12px;
    border: 1px solid #c5d0dc;
    font: inherit;
  }
}

.admin-login__error {
  margin: 12px 0 0;
  color: #b42318;
  font-size: 0.85rem;
}

.admin-login__btn {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  border: 0;
  background: #0b1f33;
  color: #fff;
  font: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
