<script setup lang="ts">
import { computed } from 'vue'
import { assets, fmt, inflation, mattress, pct, START, yearLabels } from '../data/assets'

const props = defineProps<{ asset: string }>()

const a = computed(() => assets.find(x => x.key === props.asset)!)
const last = computed(() => a.value.values[5])
const nominal = computed(() => last.value / START - 1)
const real = computed(() => last.value / inflation.values[5] - 1)

const W = 440
const H = 230
const pad = { l: 52, r: 16, t: 12, b: 26 }
const maxV = computed(() => Math.max(...a.value.values, ...inflation.values) * 1.08)
const x = (i: number) => pad.l + (i / 5) * (W - pad.l - pad.r)
const y = (v: number) => H - pad.b - (v / maxV.value) * (H - pad.t - pad.b)
const line = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
const area = computed(() => `${line(a.value.values)} L${x(5)},${y(0)} L${x(0)},${y(0)} Z`)
const ticks = computed(() => [0, 1, 2, 3, 4].map(i => (maxV.value / 4) * i))
const gid = computed(() => `g-${props.asset}`)
</script>

<template>
  <div class="asset-chart">
    <div class="result">
      <span class="from">10 000 грн</span>
      <span class="arrow">→</span>
      <span class="to" :style="{ color: a.color }">{{ fmt(last) }}</span>
      <span class="badge" :class="nominal >= 0 ? 'up' : 'down'">{{ pct(nominal) }}</span>
    </div>
    <svg :viewBox="`0 0 ${W} ${H}`">
      <defs>
        <linearGradient :id="gid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" :stop-color="a.color" stop-opacity=".35" />
          <stop offset="100%" :stop-color="a.color" stop-opacity="0" />
        </linearGradient>
      </defs>
      <g v-for="t in ticks" :key="t">
        <line :x1="pad.l" :x2="W - pad.r" :y1="y(t)" :y2="y(t)" stroke="#fff" stroke-opacity=".08" />
        <text :x="pad.l - 6" :y="y(t) + 4" text-anchor="end" class="tick">{{ Math.round(t / 1000) }}k</text>
      </g>
      <text v-for="(l, i) in yearLabels" :key="l" :x="x(i)" :y="H - 6" text-anchor="middle" class="tick">{{ l }}</text>
      <path :d="line(mattress.values)" fill="none" :stroke="mattress.color" stroke-width="1.5" stroke-opacity=".6" />
      <path :d="line(inflation.values)" fill="none" :stroke="inflation.color" stroke-width="2" stroke-dasharray="6 5" />
      <path :d="area" :fill="`url(#${gid})`" />
      <path :d="line(a.values)" fill="none" :stroke="a.color" stroke-width="3.5" stroke-linejoin="round" />
      <circle v-for="(v, i) in a.values" :key="i" :cx="x(i)" :cy="y(v)" r="4" :fill="a.color">
        <title>{{ yearLabels[i] }}: {{ fmt(v) }}</title>
      </circle>
    </svg>
    <div class="legend">
      <span><i :style="{ background: a.color }" />{{ a.name }}</span>
      <span><i class="dash" />інфляція ({{ fmt(inflation.values[5]) }})</span>
      <span><i :style="{ background: mattress.color }" />під матрацом</span>
    </div>
    <div class="real">
      З урахуванням інфляції: <b :class="real >= 0 ? 'up-t' : 'down-t'">{{ pct(real) }}</b>
      <span class="muted"> · {{ a.note }}</span>
    </div>
  </div>
</template>

<style scoped>
.asset-chart { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09); border-radius: 14px; padding: 10px 14px; }
.result { display: flex; align-items: baseline; gap: .5rem; font-weight: 700; }
.from { opacity: .7; font-size: 1rem; }
.arrow { opacity: .5; }
.to { font-size: 1.6rem; }
.badge { font-size: .85rem; padding: 2px 8px; border-radius: 999px; }
.badge.up { background: rgba(34,197,94,.2); color: #4ade80; }
.badge.down { background: rgba(239,68,68,.2); color: #f87171; }
svg { width: 100%; display: block; }
.tick { font-size: 10px; fill: #fff; fill-opacity: .5; }
.legend { display: flex; gap: 1rem; font-size: .7rem; opacity: .8; }
.legend i { display: inline-block; width: 12px; height: 4px; border-radius: 2px; margin-right: 5px; vertical-align: middle; }
.legend i.dash { background: repeating-linear-gradient(90deg, #ef4444 0 4px, transparent 4px 7px); }
.real { font-size: .75rem; margin-top: 4px; }
.up-t { color: #4ade80; }
.down-t { color: #f87171; }
.muted { opacity: .55; }
</style>
