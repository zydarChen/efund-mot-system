import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InfoItem {
  label: string;
  value: string;
}

interface InfoCardProps {
  title: string;
  icon?: React.ReactNode;
  items: InfoItem[];
  className?: string;
  delay?: number;
}

export function InfoCard({ title, icon, items, className, delay = 0 }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={cn(
        'bg-white border-gray-200 card-hover overflow-hidden shadow-sm',
        className
      )}>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-gray-700 text-sm font-semibold flex items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 pb-3">
          <div className="space-y-1.5">
            {items.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + index * 0.04, duration: 0.25 }}
                className="flex justify-between items-center py-1 px-1.5 rounded hover:bg-primary/5/50 transition-colors"
              >
                <span className="text-gray-500 text-xs">{item.label}</span>
                <span className="text-gray-700 text-xs font-medium text-right">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
