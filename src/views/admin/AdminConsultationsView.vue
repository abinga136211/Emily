<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import {
  deleteAdminConsultation,
  fetchAdminConsultations,
  setAdminConsultationRead,
  type ConsultationItem,
  type ConsultationStatusFilter
} from '@/api/site'

const POLL_MS = 2000
const SEARCH_DEBOUNCE_MS = 300

const items = ref<ConsultationItem[]>([])
const page = ref(1)
const totalPages = ref(1)
const total = ref(0)
const unreadTotal = ref(0)
const loading = ref(false)
const refreshing = ref(false)
const error = ref('')
const lastSyncedAt = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const togglingId = ref<number | null>(null)

const searchInput = ref('')
const searchQuery = ref('')
const statusFilter = ref<ConsultationStatusFilter>('all')

let pollTimer: ReturnType<typeof setInterval> | null = null
let searchTimer: ReturnType<typeof setTimeout> | null = null
let inFlight = false

const fingerprint = (list: ConsultationItem[]) =>
  list.map((r) => `${r.id}:${r.created_at}:${r.is_read ? 1 : 0}`).join('|')

const load = async (p = page.value, opts: { silent?: boolean } = {}) => {
  const silent = Boolean(opts.silent)
  if (inFlight) return
  inFlight = true
  if (!silent) {
    loading.value = true
    error.value = ''
  } else {
    refreshing.value = true
  }
  try {
    const data = await fetchAdminConsultations({
      page: p,
      limit: 20,
      q: searchQuery.value,
      status: statusFilter.value
    })
    const nextItems = data.items
    if (
      fingerprint(items.value) !== fingerprint(nextItems) ||
      total.value !== data.total ||
      unreadTotal.value !== data.unreadTotal
    ) {
      items.value = nextItems
      total.value = data.total
      unreadTotal.value = data.unreadTotal
    }
    page.value = data.page
    totalPages.value = data.totalPages
    lastSyncedAt.value = new Date().toLocaleTimeString()
    error.value = ''
  } catch (err) {
    if (!silent) {
      error.value = err instanceof Error ? err.message : '加载失败'
    }
  } finally {
    loading.value = false
    refreshing.value = false
    inFlight = false
  }
}

const applySearch = () => {
  const next = searchInput.value.trim()
  if (next === searchQuery.value) return
  searchQuery.value = next
  void load(1)
}

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    applySearch()
  }, SEARCH_DEBOUNCE_MS)
}

const clearSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchInput.value = ''
  if (!searchQuery.value) return
  searchQuery.value = ''
  void load(1)
}

watch(statusFilter, () => {
  void load(1)
})

const toggleRead = async (row: ConsultationItem) => {
  if (togglingId.value !== null || deletingId.value !== null) return
  togglingId.value = row.id
  error.value = ''
  const next = !row.is_read
  try {
    await setAdminConsultationRead(row.id, next)
    row.is_read = next
    unreadTotal.value = Math.max(0, unreadTotal.value + (next ? -1 : 1))

    const filteredOut =
      (statusFilter.value === 'unread' && next) || (statusFilter.value === 'read' && !next)
    if (filteredOut) {
      items.value = items.value.filter((item) => item.id !== row.id)
      total.value = Math.max(0, total.value - 1)
      if (!items.value.length && page.value > 1) {
        await load(page.value - 1)
      } else if (!items.value.length) {
        await load(page.value)
      } else {
        totalPages.value = Math.max(1, Math.ceil(total.value / 20))
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新状态失败'
  } finally {
    togglingId.value = null
  }
}

const remove = async (row: ConsultationItem) => {
  if (deletingId.value !== null) return
  const ok = window.confirm(`确认删除「${row.name}」的咨询记录？此操作不可恢复。`)
  if (!ok) return

  deletingId.value = row.id
  error.value = ''
  try {
    await deleteAdminConsultation(row.id)
    const wasUnread = !row.is_read
    items.value = items.value.filter((item) => item.id !== row.id)
    total.value = Math.max(0, total.value - 1)
    if (wasUnread) {
      unreadTotal.value = Math.max(0, unreadTotal.value - 1)
    }

    if (!items.value.length && page.value > 1) {
      await load(page.value - 1)
    } else if (!items.value.length) {
      await load(page.value)
    } else {
      totalPages.value = Math.max(1, Math.ceil(total.value / 20))
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '删除失败'
  } finally {
    deletingId.value = null
  }
}

const onVisibility = () => {
  if (document.visibilityState === 'visible') {
    void load(page.value, { silent: true })
  }
}

onMounted(() => {
  void load(1)
  pollTimer = setInterval(() => {
    if (document.visibilityState === 'hidden') return
    void load(page.value, { silent: true })
  }, POLL_MS)
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <section class="admin-list">
    <header class="admin-list__header">
      <div>
        <h1>咨询列表</h1>
        <p>
          共 {{ total }} 条
          <template v-if="!loading">
            · 未读 {{ unreadTotal }}
          </template>
          <span v-if="lastSyncedAt" class="admin-list__sync">
            · 自动刷新 {{ lastSyncedAt }}
            <template v-if="refreshing">…</template>
          </span>
        </p>
      </div>
      <button
        type="button"
        class="admin-list__refresh"
        :disabled="loading || refreshing"
        @click="load(page, { silent: false })"
      >
        立即刷新
      </button>
    </header>

    <div class="admin-list__toolbar">
      <label class="admin-list__search">
        <span class="admin-list__sr">搜索</span>
        <input
          v-model="searchInput"
          type="search"
          placeholder="搜索姓名、邮箱、IP、信息…"
          autocomplete="off"
          @input="onSearchInput"
          @keydown.enter.prevent="applySearch"
        />
        <button
          v-if="searchInput"
          type="button"
          class="admin-list__search-clear"
          @click="clearSearch"
        >
          清除
        </button>
      </label>

      <label class="admin-list__filter">
        <span>状态</span>
        <select v-model="statusFilter">
          <option value="all">全部</option>
          <option value="unread">未读</option>
          <option value="read">已读</option>
        </select>
      </label>
    </div>

    <p v-if="error" class="admin-list__error" role="alert">{{ error }}</p>
    <p v-else-if="loading" class="admin-list__muted">加载中…</p>

    <div v-else class="admin-list__table-wrap">
      <table class="admin-list__table">
        <thead>
          <tr>
            <th>状态</th>
            <th>时间</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>IP</th>
            <th>信息</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!items.length">
            <td colspan="7" class="admin-list__empty">
              {{ searchQuery || statusFilter !== 'all' ? '没有匹配的咨询记录' : '暂无咨询记录' }}
            </td>
          </tr>
          <tr
            v-for="row in items"
            :key="row.id"
            :class="row.is_read ? 'is-read' : 'is-unread'"
          >
            <td>
              <span
                class="admin-list__badge"
                :class="row.is_read ? 'admin-list__badge--read' : 'admin-list__badge--unread'"
              >
                {{ row.is_read ? '已读' : '未读' }}
              </span>
            </td>
            <td class="admin-list__nowrap">{{ row.created_at }}</td>
            <td class="admin-list__name">{{ row.name }}</td>
            <td>{{ row.email }}</td>
            <td class="admin-list__nowrap">{{ row.ip || '—' }}</td>
            <td class="admin-list__message">{{ row.message }}</td>
            <td class="admin-list__actions">
              <button
                type="button"
                class="admin-list__toggle"
                :class="row.is_read ? 'admin-list__toggle--unread' : 'admin-list__toggle--read'"
                :disabled="togglingId !== null || deletingId !== null"
                @click="toggleRead(row)"
              >
                <template v-if="togglingId === row.id">更新中…</template>
                <template v-else>{{ row.is_read ? '标为未读' : '标为已读' }}</template>
              </button>
              <button
                type="button"
                class="admin-list__delete"
                :disabled="deletingId !== null || togglingId !== null"
                @click="remove(row)"
              >
                {{ deletingId === row.id ? '删除中…' : '删除' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1" class="admin-list__pager">
      <button type="button" :disabled="page <= 1 || loading" @click="load(page - 1)">上一页</button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button
        type="button"
        :disabled="page >= totalPages || loading"
        @click="load(page + 1)"
      >
        下一页
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.admin-list__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  h1 {
    margin: 0;
    font-size: 1.4rem;
    color: #0b1f33;
  }

  p {
    margin: 6px 0 0;
    color: #64748b;
    font-size: 0.9rem;
  }
}

.admin-list__sync {
  color: #94a3b8;
}

.admin-list__refresh {
  flex-shrink: 0;
  padding: 8px 14px;
  border: 1px solid #c5d0dc;
  background: #fff;
  font: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.admin-list__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.admin-list__search {
  position: relative;
  flex: 1 1 260px;
  min-width: 200px;
  max-width: 420px;

  input {
    width: 100%;
    box-sizing: border-box;
    padding: 9px 64px 9px 12px;
    border: 1px solid #c5d0dc;
    background: #fff;
    font: inherit;
    color: #0b1f33;

    &::placeholder {
      color: #94a3b8;
    }

    &:focus {
      outline: 2px solid #0b1f33;
      outline-offset: 1px;
    }
  }
}

.admin-list__search-clear {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  padding: 4px 8px;
  border: 0;
  background: transparent;
  color: #64748b;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    color: #0b1f33;
  }
}

.admin-list__filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 0.9rem;

  select {
    padding: 9px 12px;
    border: 1px solid #c5d0dc;
    background: #fff;
    font: inherit;
    color: #0b1f33;
    cursor: pointer;

    &:focus {
      outline: 2px solid #0b1f33;
      outline-offset: 1px;
    }
  }
}

.admin-list__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.admin-list__error {
  color: #b42318;
}

.admin-list__muted {
  color: #64748b;
}

.admin-list__table-wrap {
  overflow: auto;
  background: #fff;
  border: 1px solid #d7dee7;
}

.admin-list__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #e8eef4;
    text-align: left;
    vertical-align: top;
  }

  th {
    background: #f8fafc;
    color: #334155;
    font-weight: 600;
    white-space: nowrap;
  }

  tbody tr.is-unread {
    background: #fff7ed;
    box-shadow: inset 4px 0 0 #c2410c;

    td {
      color: #0b1f33;
    }

    .admin-list__name {
      font-weight: 700;
    }

    .admin-list__message {
      font-weight: 600;
    }
  }

  tbody tr.is-read {
    background: #f8fafc;

    td {
      color: #64748b;
    }

    .admin-list__name,
    .admin-list__message {
      font-weight: 400;
    }
  }
}

.admin-list__badge {
  display: inline-block;
  min-width: 44px;
  padding: 3px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.4;
  text-align: center;
  white-space: nowrap;
}

.admin-list__badge--unread {
  background: #c2410c;
  color: #fff;
}

.admin-list__badge--read {
  background: #e2e8f0;
  color: #64748b;
  font-weight: 600;
}

.admin-list__nowrap {
  white-space: nowrap;
}

.admin-list__message {
  max-width: 360px;
  white-space: pre-wrap;
  word-break: break-word;
}

.admin-list__actions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  width: 1%;
}

.admin-list__toggle {
  padding: 6px 10px;
  font: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.admin-list__toggle--read {
  border: 1px solid #c2410c;
  background: #fff7ed;
  color: #9a3412;

  &:hover:not(:disabled) {
    background: #ffedd5;
  }
}

.admin-list__toggle--unread {
  border: 1px solid #c5d0dc;
  background: #fff;
  color: #475569;

  &:hover:not(:disabled) {
    background: #f1f5f9;
  }
}

.admin-list__delete {
  padding: 6px 10px;
  border: 1px solid #f0b4ae;
  background: #fff5f4;
  color: #b42318;
  font: inherit;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #fee4e2;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.admin-list__empty {
  text-align: center;
  color: #94a3b8;
  padding: 32px 12px !important;
}

.admin-list__pager {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;

  button {
    padding: 8px 12px;
    border: 1px solid #c5d0dc;
    background: #fff;
    cursor: pointer;
    font: inherit;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
