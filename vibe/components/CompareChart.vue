<script setup lang="ts">
import { computed, ref } from 'vue'
import { assets, fmt, inflation, mattress, pct, START, yearLabels } from '../data/assets'

const sum = ref(10000)
const enabled = ref<Record<string, boolean>>(Object.fromEntries(assets.map(a => [a.key, true])))
const showInfl = ref(true)
const hover = ref<number | null>(null)
const idx = computed(() => hover.value ?? 5)

const k = computed(() => sum.value / START)
const visible = computed(() => assets.filter(a => enabled.value[a.key]))

const W = 600
const H = 320
const pad = { l: 58, r: 14, t: 12, b: 28 }
const maxV = computed(() => {
  const vals = visible.value.flatMap(a => a.values)
  if (showInfl.value) vals.push(...inflation.values)
  return Math.max(START, ...vals) * k.value * 1.06
})
const x = (i: number) => pad.l + (i / 5) * (W - pad.l - pad.r)
const y = (v: number) => H - pad.b - ((v * k.value) / maxV.value) * (H - pad.t - pad.b)
const line = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
const ticks = computed(() => [0, 1, 2, 3, 4].map(i => (maxV.value / 4) * i))
const tickLabel = (t: number) => (t >= 1000 ? `${Math.round(t / 1000)}k` : `${Math.round(t)}`)

const ranking = computed(() =>
  [...visible.value]
    .map(a => ({ ...a, v: a.values[idx.value] * k.value, ch: a.values[idx.value] / START - 1 }))
    .sort((p, q) => q.v - p.v),
)

function onMove(e: MouseEvent) {
  const svg = e.currentTarget as SVGSVGElement
  const r = svg.getBoundingClientRect()
  const px = ((e.clientX - r.left) / r.width) * W
  hover.value = Math.max(0, Math.min(5, Math.round(((px - pad.l) / (W - pad.l - pad.r)) * 5)))
}
</script>

<template>
  <div class="cmp">
    <div class="left">
      <div class="chips">
        <button v-for="a in assets" :key="a.key" :class="{ off: !enabled[a.key] }" :style="{ '--c': a.color }" @click="enabled[a.key] = !enabled[a.key]">
          {{ a.emoji }} {{ a.name }}
        </button>
        <button :class="{ off: !showInfl }" style="--c:#ff4d6d" @click="showInfl = !showInfl">📉 Інфляція</button>
      </div>
      <svg :viewBox="`0 0 ${W} ${H}`" @mousemove="onMove" @mouseleave="hover = null">
        <g v-for="t in ticks" :key="t">
          <line :x1="pad.l" :x2="W - pad.r" :y1="H - pad.b - (t / maxV) * (H - pad.t - pad.b)" :y2="H - pad.b - (t / maxV) * (H - pad.t - pad.b)" stroke="#fff" stroke-opacity=".08" />
          <text :x="pad.l - 6" :y="H - pad.b - (t / maxV) * (H - pad.t - pad.b) + 4" text-anchor="end" class="tick">{{ tickLabel(t) }}</text>
        </g>
        <text v-for="(l, i) in yearLabels" :key="l" :x="x(i)" :y="H - 8" text-anchor="middle" class="tick" :class="{ cur: i === idx }">{{ l }}</text>
        <line :x1="x(idx)" :x2="x(idx)" :y1="pad.t" :y2="H - pad.b" stroke="#fff" stroke-opacity=".25" stroke-dasharray="3 4" />
        <path :d="line(mattress.values)" fill="none" :stroke="mattress.color" stroke-width="1.5" stroke-opacity=".6" />
        <path v-if="showInfl" :d="line(inflation.values)" fill="none" stroke="#ff4d6d" stroke-width="2.5" stroke-dasharray="7 5" />
        <g v-for="a in visible" :key="a.key">
          <path :d="line(a.values)" fill="none" :stroke="a.color" stroke-width="3" stroke-linejoin="round" />
          <circle :cx="x(idx)" :cy="y(a.values[idx])" r="5" :fill="a.color" stroke="#121417" stroke-width="2" />
        </g>
      </svg>
      <label class="sum">
        Сума інвестиції: <b>{{ fmt(sum) }}</b>
        <input v-model.number="sum" type="range" min="1000" max="100000" step="1000">
      </label>
    </div>

    <div class="right">
      <div class="when">Результат на <b>{{ idx === 0 ? 'початок 2021' : `кінець ${yearLabels[idx]}` }}</b></div>
      <div v-for="(r, n) in ranking" :key="r.key" class="row">
        <span class="place">{{ n + 1 }}</span>
        <span class="nm"><i :style="{ background: r.color }" />{{ r.emoji }} {{ r.name }}</span>
        <span class="val">{{ fmt(r.v) }}</span>
        <span class="ch" :class="r.ch >= 0 ? 'up' : 'down'">{{ pct(r.ch) }}</span>
      </div>
      <div v-if="showInfl" class="row infl">
        <span class="place">—</span>
        <span class="nm"><i style="background:#ff4d6d" />Треба, щоб не збідніти</span>
        <span class="val">{{ fmt(inflation.values[idx] * k) }}</span>
        <span class="ch">{{ pct(inflation.values[idx] / START - 1) }}</span>
      </div>
      <div class="hint">Наведи мишку на графік, щоб побачити будь-який рік</div>
    </div>
  </div>
</template>

<style scoped>
.cmp { display: grid; grid-template-columns: 1.35fr 1fr; gap: 1.2rem; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.chips button { font-size: .72rem; padding: 3px 10px; border-radius: 999px; border: 1.5px solid var(--c); background: color-mix(in srgb, var(--c) 22%, transparent); cursor: pointer; transition: .2s; }
.chips button.off { background: transparent; opacity: .4; }
svg { width: 100%; display: block; cursor: crosshair; }
.tick { font-size: 11px; fill: #fff; fill-opacity: .5; }
.tick.cur { fill: #00ff9d; fill-opacity: 1; font-weight: 700; }
.sum { display: block; font-size: .8rem; margin-top: 4px; }
.sum input { width: 100%; accent-color: #00ff9d; }
.right { font-size: .82rem; }
.when { margin-bottom: 8px; opacity: .85; }
.row { display: grid; grid-template-columns: 1.4rem 1fr auto 3.2rem; gap: 6px; align-items: center; padding: 5px 8px; border-radius: 8px; background: rgba(30,34,39,.6); border: 1px solid rgba(0,255,157,.1); margin-bottom: 4px; }
.row.infl { background: rgba(239,68,68,.1); border: 1px dashed rgba(239,68,68,.5); }
.place { opacity: .5; font-weight: 700; }
.nm i { display: inline-block; width: 9px; height: 9px; border-radius: 3px; margin-right: 6px; }
.val { font-weight: 700; text-align: right; }
.ch { text-align: right; font-size: .75rem; }
.up { color: #00ff9d; }
.down { color: #ff4d6d; }
.hint { margin-top: 8px; font-size: .7rem; opacity: .5; }
</style>
