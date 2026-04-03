import AnimatedNumber from './AnimatedNumber'

interface KPICardProps {
  value: string
  label: string
  from?: string
  to?: string
  delay?: number
}

export default function KPICard({ value, label, from, to, delay = 0 }: KPICardProps) {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''))
  const hasNumeric = !isNaN(numericValue)
  const suffix = value.replace(/[0-9.,]/g, '')

  return (
    <div
      className="pres-card pres-animate-scale text-center"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="text-[36px] font-bold mb-2 pres-gradient-text">
        {hasNumeric ? (
          <AnimatedNumber value={numericValue} suffix={suffix} />
        ) : (
          value
        )}
      </div>
      <div className="text-sm font-medium mb-1" style={{ color: 'var(--pres-text)' }}>{label}</div>
      {from && to && (
        <div className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>
          {from} <span style={{ color: 'var(--pres-accent)' }}>&rarr;</span> {to}
        </div>
      )}
    </div>
  )
}
