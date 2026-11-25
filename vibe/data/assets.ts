// Скільки коштували б 10 000 грн, вкладені на початку 2021 року (значення на кінець кожного року, у гривнях).
// Розрахунок: курс НБУ на кінець року, інфляція Держстату, S&P 500 total return, котирування Apple та BTC,
// ціни землі за даними Мінагрополітики / ННЦ ІАЕ. Депозит і ОВДП — оцінка за типовими ставками тих років.

export const START = 10000

export const yearLabels = ['поч. 2021', '2021', '2022', '2023', '2024', '2025']

export interface Asset {
  key: string
  name: string
  emoji: string
  color: string
  values: number[]
  note: string
}

export const assets: Asset[] = [
  {
    key: 'deposit',
    name: 'Депозит',
    emoji: '🏦',
    color: '#38bdf8',
    values: [10000, 10644, 11587, 12986, 14345, 15891],
    note: 'Ставки ≈ 8–15% річних, після сплати податку з відсотків',
  },
  {
    key: 'ovdp',
    name: 'ОВДП',
    emoji: '📜',
    color: '#ffe14d',
    values: [10000, 11100, 12321, 14539, 16865, 19563],
    note: 'Дохідність ≈ 11–18% річних, без податку',
  },
  {
    key: 'land',
    name: 'Земля',
    emoji: '🌾',
    color: '#ff9f43',
    values: [10000, 10545, 11264, 11640, 13502, 15662],
    note: 'Середня ціна гектара ≈ 32 тис. → 50 тис. грн, без орендної плати',
  },
  {
    key: 'apple',
    name: 'Акції Apple',
    emoji: '🍏',
    color: '#c77dff',
    values: [10000, 12911, 12664, 19492, 28060, 30687],
    note: 'Ціна акції $133 → $272 + зміна курсу долара',
  },
  {
    key: 'etf',
    name: 'ETF на S&P 500',
    emoji: '🧺',
    color: '#00ff9d',
    values: [10000, 12416, 13632, 17883, 24742, 29413],
    note: '500 найбільших компаній США, з дивідендами + зміна курсу',
  },
  {
    key: 'btc',
    name: 'Біткоїн',
    emoji: '🪙',
    color: '#ff6b2c',
    values: [10000, 15405, 7380, 19578, 47900, 45388],
    note: 'BTC ≈ $29 000 → ≈ $88 000 + зміна курсу',
  },
]

export const inflation = {
  key: 'inflation',
  name: 'Щоб не збідніти (інфляція)',
  color: '#ff4d6d',
  values: [10000, 11000, 13926, 14636, 16393, 17704],
}

export const mattress = {
  key: 'mattress',
  name: 'Під матрацом',
  color: '#8a8f98',
  values: [10000, 10000, 10000, 10000, 10000, 10000],
}

export const fmt = (n: number) => `${Math.round(n).toLocaleString('uk-UA')} грн`
export const pct = (n: number) => `${n >= 0 ? '+' : ''}${Math.round(n * 100)}%`
