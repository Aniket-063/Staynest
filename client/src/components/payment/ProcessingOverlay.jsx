import { useEffect, useState } from 'react'

const STAGES = [
  { key: 'processing', label: 'Processing payment…', icon: '💳' },
  { key: 'verifying',  label: 'Verifying with bank…', icon: '🔐' },
  { key: 'confirming', label: 'Confirming booking…',  icon: '🏡' },
]

export default function ProcessingOverlay({ status }) {
  // status: 'processing' | 'success' | 'error'
  const [stageIdx, setStageIdx] = useState(0)

  useEffect(() => {
    if (status !== 'processing') return
    setStageIdx(0)
    const t1 = setTimeout(() => setStageIdx(1), 900)
    const t2 = setTimeout(() => setStageIdx(2), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [status])

  if (status === 'idle') return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center px-6">
        {status === 'processing' && (
          <>
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-brand-100 dark:border-slate-700" />
              <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                {STAGES[stageIdx].icon}
              </div>
            </div>
            <p key={stageIdx} className="text-lg font-semibold text-gray-900 dark:text-white animate-fade-in">
              {STAGES[stageIdx].label}
            </p>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">
              Please don't close or refresh this page
            </p>
            <div className="flex gap-1.5 mt-5">
              {STAGES.map((s, i) => (
                <div
                  key={s.key}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= stageIdx ? 'w-8 bg-brand-500' : 'w-1.5 bg-gray-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5 animate-shake">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Payment failed</p>
          </>
        )}
      </div>
    </div>
  )
}