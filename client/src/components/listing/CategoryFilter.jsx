const CATEGORIES = [
  { id: '',          label: 'All',        icon: '🌍' },
  { id: 'beach',     label: 'Beach',      icon: '🏖️' },
  { id: 'mountain',  label: 'Mountains',  icon: '⛰️' },
  { id: 'city',      label: 'City',       icon: '🏙️' },
  { id: 'countryside', label: 'Countryside', icon: '🌿' },
  { id: 'luxury',    label: 'Luxury',     icon: '✨' },
]

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl border whitespace-nowrap transition-all shrink-0 text-sm font-medium
            ${selected === cat.id
              ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-200 dark:shadow-brand-900'
              : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-600'
            }`}
        >
          <span className="text-lg leading-none">{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  )
}