interface FeatureCardProps {
  num?: string
  title: string
  desc: string
  details?: string[]
  highlight?: boolean
  delay?: number
}

export default function FeatureCard({ num, title, desc, details, highlight, delay = 0 }: FeatureCardProps) {
  return (
    <div
      className={`pres-card pres-animate-up ${highlight ? 'pres-card-highlight' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {num && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-3"
          style={{ background: 'var(--pres-accent)', color: 'var(--pres-bg-from)' }}
        >
          {num}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--pres-text)' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--pres-text-secondary)' }}>{desc}</p>
      {details && details.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {details.map((d, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--pres-text-dim)' }}>
              <span style={{ color: 'var(--pres-accent)' }} className="mt-0.5">&#x2022;</span>
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
