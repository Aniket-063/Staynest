import { useState } from 'react'

export default function PriceFilter({ onApply }) {
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')

  const handleApply = () => {
    onApply({ minPrice: min, maxPrice: max })
  }

  const handleClear = () => {
    setMin(''); setMax('')
    onApply({ minPrice: '', maxPrice: '' })
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-3 py-2">
        <span className="text-gray-500 text-sm">$</span>
        <input
          type="number"
          value={min}
          onChange={e => setMin(e.target.value)}
          placeholder="Min"
          className="w-16 bg-transparent text-sm text-gray-700 dark:text-slate-200 focus:outline-none placeholder-gray-500"
        />
        <span className="text-gray-400 mx-1">–</span>
        <input
          type="number"
          value={max}
          onChange={e => setMax(e.target.value)}
          placeholder="Max"
          className="w-16 bg-transparent text-sm text-gray-700 dark:text-slate-200 focus:outline-none placeholder-gray-500"
        />
      </div>
      <button onClick={handleApply} className="btn-primary text-sm py-2 px-4">Apply</button>
      {(min || max) && (
        <button onClick={handleClear} className="btn-secondary text-sm py-2 px-4">Clear</button>
      )}
    </div>
  )
}