<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  fetchAdminConfig,
  saveAdminConfig,
  type ConfigExtraItem,
  type LocalizedText,
  type SiteConfig
} from '@/api/site'
import { notifySiteConfigChanged } from '@/composables/useSiteConfig'

type CoreKey = 'email' | 'wechat' | 'address' | 'website'

type ListRow = {
  id: string
  kind: 'core' | 'extra'
  coreKey?: CoreKey
  titleZh: string
  previewZh: string
  canDelete: boolean
}

const CORE_META: Record<
  CoreKey,
  { labelZh: string; labelEn: string; inputType: 'email' | 'text' | 'textarea' }
> = {
  email: { labelZh: '商务邮箱', labelEn: 'Business Email', inputType: 'email' },
  wechat: { labelZh: '商务微信', labelEn: 'Business WeChat', inputType: 'text' },
  address: { labelZh: '办公地址', labelEn: 'Office Address', inputType: 'textarea' },
  website: { labelZh: '官方网站', labelEn: 'Website', inputType: 'text' }
}

const CORE_KEYS = Object.keys(CORE_META) as CoreKey[]

const emptyLocalized = (): LocalizedText => ({ zh: '', en: '' })

const form = reactive<SiteConfig>({
  email: emptyLocalized(),
  wechat: emptyLocalized(),
  address: emptyLocalized(),
  website: emptyLocalized(),
  extras: [],
  channelOrder: [...CORE_KEYS]
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')
const updatedAt = ref<string | null>(null)

const editorOpen = ref(false)
const editorMode = ref<'create' | 'edit'>('edit')
const editorId = ref<string | null>(null)
const editorIsCore = ref(false)
const editorCoreKey = ref<CoreKey | null>(null)
const editorDraft = reactive({
  label: emptyLocalized(),
  value: emptyLocalized()
})
const editorError = ref('')

const listRows = computed<ListRow[]>(() => {
  const extrasById = new Map(form.extras.map((item) => [item.id, item]))
  return form.channelOrder
    .map((id) => {
      if ((CORE_KEYS as string[]).includes(id)) {
        const key = id as CoreKey
        return {
          id,
          kind: 'core' as const,
          coreKey: key,
          titleZh: CORE_META[key].labelZh,
          previewZh: form[key].zh || '—',
          canDelete: false
        }
      }
      const extra = extrasById.get(id)
      if (!extra) return null
      return {
        id,
        kind: 'extra' as const,
        titleZh: extra.label.zh || '未命名',
        previewZh: extra.value.zh || '—',
        canDelete: true
      }
    })
    .filter((row): row is ListRow => Boolean(row))
})

const assignLocalized = (target: LocalizedText, source: LocalizedText) => {
  target.zh = source.zh
  target.en = source.en
}

const cloneLocalized = (source: LocalizedText): LocalizedText => ({
  zh: source.zh,
  en: source.en
})

const buildPayload = (): SiteConfig => ({
  email: { zh: form.email.zh.trim(), en: form.email.en.trim() },
  wechat: { zh: form.wechat.zh.trim(), en: form.wechat.en.trim() },
  address: { zh: form.address.zh.trim(), en: form.address.en.trim() },
  website: { zh: form.website.zh.trim(), en: form.website.en.trim() },
  extras: form.extras.map((item) => ({
    id: item.id.trim(),
    label: { zh: item.label.zh.trim(), en: item.label.en.trim() },
    value: { zh: item.value.zh.trim(), en: item.value.en.trim() }
  })),
  channelOrder: [...form.channelOrder]
})

const persist = async (next?: Partial<SiteConfig>) => {
  if (saving.value) return
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    if (next?.email) assignLocalized(form.email, next.email)
    if (next?.wechat) assignLocalized(form.wechat, next.wechat)
    if (next?.address) assignLocalized(form.address, next.address)
    if (next?.website) assignLocalized(form.website, next.website)
    if (next?.extras) {
      form.extras = next.extras.map((item) => ({
        id: item.id,
        label: cloneLocalized(item.label),
        value: cloneLocalized(item.value)
      }))
    }
    if (next?.channelOrder) form.channelOrder = [...next.channelOrder]

    const payload = buildPayload()
    for (const key of CORE_KEYS) {
      if (!payload[key].zh || !payload[key].en) {
        throw new Error('基础联系信息的中英属性值均不能为空')
      }
    }
    for (const item of payload.extras) {
      if (!item.label.zh || !item.label.en || !item.value.zh || !item.value.en) {
        throw new Error('自定义属性的中英属性名与属性值均不能为空')
      }
    }

    const saved = await saveAdminConfig(payload)
    updatedAt.value = saved.updated_at
    assignLocalized(form.email, saved.email)
    assignLocalized(form.wechat, saved.wechat)
    assignLocalized(form.address, saved.address)
    assignLocalized(form.website, saved.website)
    form.extras = (saved.extras ?? payload.extras).map((item) => ({
      id: item.id,
      label: cloneLocalized(item.label),
      value: cloneLocalized(item.value)
    }))
    form.channelOrder = saved.channelOrder ?? payload.channelOrder
    success.value = '已保存'
    notifySiteConfigChanged()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '保存失败'
    throw err
  } finally {
    saving.value = false
  }
}

const load = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const data = await fetchAdminConfig()
    assignLocalized(form.email, data.email)
    assignLocalized(form.wechat, data.wechat)
    assignLocalized(form.address, data.address)
    assignLocalized(form.website, data.website)
    form.extras = (data.extras ?? []).map((item) => ({
      id: item.id,
      label: cloneLocalized(item.label),
      value: cloneLocalized(item.value)
    }))
    form.channelOrder = data.channelOrder?.length
      ? [...data.channelOrder]
      : [...CORE_KEYS, ...form.extras.map((item) => item.id)]
    updatedAt.value = data.updated_at
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editorMode.value = 'create'
  editorId.value = `extra-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  editorIsCore.value = false
  editorCoreKey.value = null
  assignLocalized(editorDraft.label, emptyLocalized())
  assignLocalized(editorDraft.value, emptyLocalized())
  editorError.value = ''
  editorOpen.value = true
}

const openEdit = (row: ListRow) => {
  editorMode.value = 'edit'
  editorId.value = row.id
  editorError.value = ''
  if (row.kind === 'core' && row.coreKey) {
    editorIsCore.value = true
    editorCoreKey.value = row.coreKey
    const meta = CORE_META[row.coreKey]
    assignLocalized(editorDraft.label, { zh: meta.labelZh, en: meta.labelEn })
    assignLocalized(editorDraft.value, form[row.coreKey])
  } else {
    editorIsCore.value = false
    editorCoreKey.value = null
    const extra = form.extras.find((item) => item.id === row.id)
    if (!extra) return
    assignLocalized(editorDraft.label, extra.label)
    assignLocalized(editorDraft.value, extra.value)
  }
  editorOpen.value = true
}

const closeEditor = () => {
  editorOpen.value = false
  editorError.value = ''
}

const saveEditor = async () => {
  const labelZh = editorDraft.label.zh.trim()
  const labelEn = editorDraft.label.en.trim()
  const valueZh = editorDraft.value.zh.trim()
  const valueEn = editorDraft.value.en.trim()

  if (!valueZh || !valueEn) {
    editorError.value = '请填写中英文属性值'
    return
  }
  if (!editorIsCore.value && (!labelZh || !labelEn)) {
    editorError.value = '请填写中英文属性名'
    return
  }

  try {
    if (editorIsCore.value && editorCoreKey.value) {
      assignLocalized(form[editorCoreKey.value], { zh: valueZh, en: valueEn })
    } else if (editorMode.value === 'create' && editorId.value) {
      const item: ConfigExtraItem = {
        id: editorId.value,
        label: { zh: labelZh, en: labelEn },
        value: { zh: valueZh, en: valueEn }
      }
      form.extras.push(item)
      form.channelOrder.push(item.id)
    } else if (editorId.value) {
      const extra = form.extras.find((item) => item.id === editorId.value)
      if (!extra) return
      assignLocalized(extra.label, { zh: labelZh, en: labelEn })
      assignLocalized(extra.value, { zh: valueZh, en: valueEn })
    }
    await persist()
    closeEditor()
  } catch {
    // error already set in persist
  }
}

const moveRow = async (id: string, direction: -1 | 1) => {
  const index = form.channelOrder.indexOf(id)
  const target = index + direction
  if (index < 0 || target < 0 || target >= form.channelOrder.length) return
  const next = [...form.channelOrder]
  const tmp = next[index]
  next[index] = next[target]
  next[target] = tmp
  form.channelOrder = next
  try {
    await persist()
  } catch {
    await load()
  }
}

const removeRow = async (row: ListRow) => {
  if (!row.canDelete) return
  const ok = window.confirm(`确认删除「${row.titleZh}」？`)
  if (!ok) return
  form.extras = form.extras.filter((item) => item.id !== row.id)
  form.channelOrder = form.channelOrder.filter((id) => id !== row.id)
  try {
    await persist()
  } catch {
    await load()
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="cfg">
    <div class="cfg__panel">
      <header class="cfg__hero">
        <div class="cfg__hero-copy">
          <p class="cfg__eyebrow"><span class="cfg__eyebrow-line" aria-hidden="true" />设置</p>
          <h1 class="cfg__title">系统配置</h1>
          <p class="cfg__desc">
            管理联系页与页脚展示的联系信息，支持中英文。
            <span v-if="updatedAt">上次保存 {{ updatedAt }}</span>
          </p>
        </div>
        <button type="button" class="cfg__add" :disabled="loading || saving" @click="openCreate">
          新增配置
        </button>
      </header>

      <p v-if="error" class="cfg__flash cfg__flash--error" role="alert">{{ error }}</p>
      <p v-else-if="success" class="cfg__flash cfg__flash--ok" role="status">{{ success }}</p>
      <p v-if="loading" class="cfg__muted">加载中…</p>

      <div v-else class="cfg__list">
        <div class="cfg__list-head" aria-hidden="true">
          <span>标题（简）</span>
          <span>内容预览</span>
          <span>操作</span>
        </div>

        <div v-if="!listRows.length" class="cfg__empty">暂无配置项</div>

        <div v-for="(row, index) in listRows" :key="row.id" class="cfg__row">
          <div class="cfg__cell cfg__cell--title">{{ row.titleZh }}</div>
          <div class="cfg__cell cfg__cell--preview">{{ row.previewZh }}</div>
          <div class="cfg__cell cfg__cell--actions">
            <button
              type="button"
              class="cfg__action"
              :disabled="saving || index === 0"
              @click="moveRow(row.id, -1)"
            >
              上移
            </button>
            <button
              type="button"
              class="cfg__action"
              :disabled="saving || index === listRows.length - 1"
              @click="moveRow(row.id, 1)"
            >
              下移
            </button>
            <button type="button" class="cfg__action" :disabled="saving" @click="openEdit(row)">
              编辑
            </button>
            <button
              v-if="row.canDelete"
              type="button"
              class="cfg__action cfg__action--danger"
              :disabled="saving"
              @click="removeRow(row)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="editorOpen"
      class="cfg__modal"
      role="dialog"
      aria-modal="true"
      :aria-label="editorMode === 'create' ? '新增配置' : '编辑配置'"
      @click.self="closeEditor"
    >
      <div class="cfg__dialog">
        <header class="cfg__dialog-head">
          <h2>{{ editorMode === 'create' ? '新增配置' : '编辑配置' }}</h2>
          <button type="button" class="cfg__dialog-close" @click="closeEditor">关闭</button>
        </header>

        <div class="cfg__dialog-body">
          <label class="cfg__field">
            <span>属性名（中文）</span>
            <input
              v-model="editorDraft.label.zh"
              type="text"
              maxlength="100"
              :disabled="editorIsCore"
              required
            />
          </label>
          <label class="cfg__field">
            <span>属性名（英文）</span>
            <input
              v-model="editorDraft.label.en"
              type="text"
              maxlength="100"
              :disabled="editorIsCore"
              required
            />
          </label>
          <label class="cfg__field cfg__field--full">
            <span>属性值（中文）</span>
            <textarea
              v-if="editorCoreKey === 'address'"
              v-model="editorDraft.value.zh"
              rows="3"
              required
            />
            <input v-else v-model="editorDraft.value.zh" type="text" maxlength="500" required />
          </label>
          <label class="cfg__field cfg__field--full">
            <span>属性值（英文）</span>
            <textarea
              v-if="editorCoreKey === 'address'"
              v-model="editorDraft.value.en"
              rows="3"
              required
            />
            <input v-else v-model="editorDraft.value.en" type="text" maxlength="500" required />
          </label>
        </div>

        <p v-if="editorError" class="cfg__flash cfg__flash--error" role="alert">{{ editorError }}</p>

        <footer class="cfg__dialog-foot">
          <button type="button" class="cfg__ghost" :disabled="saving" @click="closeEditor">
            取消
          </button>
          <button type="button" class="cfg__add" :disabled="saving" @click="saveEditor">
            {{ saving ? '保存中…' : '保存' }}
          </button>
        </footer>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cfg {
  max-width: 960px;
}

.cfg__panel {
  background: #fff;
  border: 1px solid #d7dee7;
  padding: 24px 28px;
}

.cfg__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.cfg__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  color: #94a3b8;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.cfg__eyebrow-line {
  display: inline-block;
  width: 20px;
  height: 1px;
  background: #0b1f33;
}

.cfg__title {
  margin: 0;
  color: #0b1f33;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.3;
}

.cfg__desc {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.55;

  span {
    display: inline;
    margin-left: 6px;
    color: #94a3b8;
    font-size: 0.85rem;
  }
}

.cfg__add {
  flex-shrink: 0;
  padding: 9px 16px;
  border: 0;
  background: #0b1f33;
  color: #fff;
  font: inherit;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #16324f;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.cfg__ghost {
  padding: 9px 14px;
  border: 1px solid #c5d0dc;
  background: #fff;
  color: #475569;
  font: inherit;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f8fafc;
  }
}

.cfg__flash {
  margin: 0 0 14px;
  font-size: 0.9rem;

  &--error {
    color: #b42318;
  }

  &--ok {
    color: #027a48;
  }
}

.cfg__muted {
  color: #64748b;
}

.cfg__list-head,
.cfg__row {
  display: grid;
  grid-template-columns: minmax(120px, 0.9fr) minmax(220px, 1.6fr) minmax(220px, 1.1fr);
  gap: 16px;
  align-items: start;
}

.cfg__list-head {
  padding: 10px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e8eef4;
  color: #334155;
  font-size: 0.82rem;
  font-weight: 600;

  span:last-child {
    text-align: right;
  }
}

.cfg__row {
  padding: 16px 12px;
  border-bottom: 1px solid #e8eef4;

  &:last-child {
    border-bottom: 0;
  }
}

.cfg__cell--title {
  color: #0b1f33;
  font-size: 0.95rem;
  font-weight: 600;
}

.cfg__cell--preview {
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.55;
  word-break: break-word;
}

.cfg__cell--actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.cfg__action {
  padding: 0;
  border: 0;
  background: transparent;
  color: #64748b;
  font: inherit;
  font-size: 0.88rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: #0b1f33;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &--danger {
    color: #b42318;

    &:hover:not(:disabled) {
      color: #912018;
    }
  }
}

.cfg__empty {
  padding: 40px 12px;
  text-align: center;
  color: #94a3b8;
}

.cfg__modal {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(11, 31, 51, 0.4);
}

.cfg__dialog {
  width: min(560px, 100%);
  background: #fff;
  border: 1px solid #d7dee7;
  box-shadow: 0 12px 40px rgba(11, 31, 51, 0.18);
  padding: 22px 24px;
}

.cfg__dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 1.15rem;
    color: #0b1f33;
  }
}

.cfg__dialog-close {
  border: 0;
  background: transparent;
  color: #64748b;
  font: inherit;
  cursor: pointer;

  &:hover {
    color: #0b1f33;
  }
}

.cfg__dialog-body {
  display: grid;
  gap: 14px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
}

.cfg__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #334155;
  font-size: 0.88rem;

  &--full {
    @media (min-width: 640px) {
      grid-column: 1 / -1;
    }
  }

  input,
  textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #c5d0dc;
    font: inherit;
    color: #0b1f33;
    resize: vertical;

    &:disabled {
      background: #f8fafc;
      color: #94a3b8;
    }

    &:focus {
      outline: 2px solid #0b1f33;
      outline-offset: 1px;
    }
  }
}

.cfg__dialog-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

@media (max-width: 720px) {
  .cfg__panel {
    padding: 18px 16px;
  }

  .cfg__hero {
    flex-direction: column;
  }

  .cfg__list-head,
  .cfg__row {
    grid-template-columns: 1fr;
  }

  .cfg__list-head span:nth-child(2),
  .cfg__list-head span:nth-child(3) {
    display: none;
  }

  .cfg__cell--actions {
    justify-content: flex-start;
  }
}
</style>
