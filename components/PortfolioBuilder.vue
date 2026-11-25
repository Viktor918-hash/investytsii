<script setup lang="ts">
import { computed, ref } from 'vue'
import { assets, fmt, inflation, pct, START } from '../data/assets'

const alloc = ref<Record<string, number>>(Object.fromEntries(assets.map(a => [a.key, 0])))
const total = computed(() => Object.values(alloc.value).reduce((s, v) => s + v, 0))
const left = computed(() => START - total.value)

const valueAt = (i: number) => assets.reduce((s, a) => s + (alloc.value[a.key] / START) * a.values[i], 0) + Math.max(left.value, 0)
const final = computed(() => valueAt(5))
const worst = computed(() => Math.min(...[1, 2, 3, 4, 5].map(valueAt)))
</script>

<template>
  <div class="pb">
    <div class="sliders">
      <label v-for="a in assets" :key="a.key">
        <span class="nm">{{ a.emoji }} {{ a.name }}</span>
        <input v-model.number="alloc[a.key]" type="range" min="0" max="10000" step="500" :style="{ accentColor: a.color }">
        <span class="amt">{{ fmt(alloc[a.key]) }}</span>
      </label>
    </div>
    <div class="out">
      <div :class="['left', left < 0 ? 'bad' : left === 0 ? 'ok' : '']">
        {{ left < 0 ? `Перебір на ${fmt(-left)}!` : left === 0 ? '✅ Усі 10 000 грн розподілено' : `Ще не вкладено: ${fmt(left)}` }}
      </div>
      <div class="big">
        <span>Твій портфель наприкінці 2025</span>
        <b>{{ left < 0 ? '—' : fmt(final) }}</b>
        <small v-if="left >= 0">{{ pct(final / START - 1) }} · інфляція: {{ fmt(inflation.values[5]) }}</small>
      </div>
      <div v-if="left >= 0 && total > 0" class="worst">Найгірший момент: {{ fmt(worst) }}</div>
    </div>
  </div>
</template>

<style scoped>
.pb { display: grid; grid-template-columns: 1.3fr 1fr; gap: 1.5rem; font-size: .85rem; }
.sliders label { display: grid; grid-template-columns: 8.5rem 1fr 6rem; align-items: center; gap: 8px; margin-bottom: 4px; }
.amt { text-align: right; font-weight: 700; }
.out { background: rgba(255,255,255,.05); border: 1px solid rgba(250,204,21,.35); border-radius: 14px; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }
.left { font-size: .8rem; opacity: .85; }
.left.bad { color: #f87171; opacity: 1; font-weight: 700; }
.left.ok { color: #4ade80; opacity: 1; }
.big span { display: block; opacity: .7; font-size: .8rem; }
.big b { font-size: 1.9rem; color: #facc15; }
.big small { display: block; opacity: .7; }
.worst { font-size: .78rem; opacity: .8; }
</style>
