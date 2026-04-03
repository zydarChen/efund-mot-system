import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Wallet, PiggyBank } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

interface CustomerInfoBarProps {
  customerName: string;
  customerId: string;
  totalAssets: number;
  fundCount: number;
}

export function CustomerInfoBar({ customerName, customerId, totalAssets, fundCount }: CustomerInfoBarProps) {
  const animatedAssets = useCountUp(totalAssets, 1200);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white border-b border-gray-200 px-4 py-3"
    >
      <div className="flex items-center gap-6">
        {/* Left: Customer Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {customerName.charAt(0)}
            </span>
          </div>
          
          {/* Name & Tags */}
          <div className="flex items-center gap-2">
            <span className="text-gray-800 font-semibold text-base">{customerName}</span>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-1.5 py-0">
              VIP
            </Badge>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 text-sm">{customerId}</span>
          </div>
        </div>

        {/* Metrics - Left aligned next to customer info */}
        <div className="flex items-center gap-5">
          {/* Total Assets */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
              <Wallet className="w-3 h-3 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-gray-500 text-xs">总资产</span>
              <span className="text-gray-800 font-mono-num font-semibold text-sm">
                ¥{animatedAssets.toLocaleString('zh-CN', { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Fund Count */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
              <PiggyBank className="w-3 h-3 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-gray-500 text-xs">持仓</span>
              <span className="text-gray-800 font-mono-num font-semibold text-sm">
                {fundCount}<span className="text-gray-400 text-xs ml-0.5">只</span>
              </span>
            </div>
          </div>

          {/* Return Rate */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-gray-500 text-xs">收益</span>
              <span className="text-emerald-600 font-mono-num font-semibold text-sm">
                +12.8%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
