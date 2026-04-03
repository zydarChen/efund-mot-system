import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tag {
  label: string;
  category: string;
}

interface TagCloudProps {
  tags: Tag[];
  className?: string;
}

const categoryColors: Record<string, string> = {
  '性格': 'from-pink-100 to-rose-100 text-pink-700 border-pink-200',
  '教育': 'from-blue-100 to-indigo-100 text-blue-700 border-blue-200',
  '职业': 'from-amber-100 to-orange-100 text-amber-700 border-amber-200',
  '收入': 'from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200',
  '投资风格': 'from-primary/10 to-accent/10 text-primary border-primary/20',
};

export function TagCloud({ tags, className }: TagCloudProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag, index) => (
        <motion.span
          key={tag.label}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.03, duration: 0.25 }}
          whileHover={{ scale: 1.03 }}
          className={`
            px-2 py-0.5 rounded-full text-xs font-medium
            bg-gradient-to-r border
            cursor-default
            transition-shadow duration-200
            hover:shadow-sm
            ${categoryColors[tag.category] || 'from-gray-100 to-gray-200 text-gray-700 border-gray-200'}
          `}
        >
          {tag.label}
        </motion.span>
      ))}
    </div>
  );
}
