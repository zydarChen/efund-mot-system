import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Gift, 
  RefreshCw 
} from 'lucide-react';
import { transactionRecords } from '../data/customerData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const actionIcons = {
  buy: ArrowDownCircle,
  sell: ArrowUpCircle,
  dividend: Gift,
  adjust: RefreshCw,
} as const;

const actionColors = {
  buy: 'text-emerald-700 bg-emerald-100 border-emerald-300',
  sell: 'text-amber-700 bg-amber-100 border-amber-300',
  dividend: 'text-blue-700 bg-blue-100 border-blue-300',
  adjust: 'text-primary bg-primary/10 border-primary/25',
} as const;

const actionLabels = {
  buy: '买入',
  sell: '赎回',
  dividend: '分红',
  adjust: '调仓',
} as const;

const nodeColors = {
  buy: '#10b981',
  sell: '#f59e0b',
  dividend: '#3b82f6',
  adjust: '#0ea5e9',
} as const;

type ActionType = keyof typeof actionIcons;

interface Transaction {
  month: string;
  action: string;
  target: string;
  detail: string;
  type: ActionType;
}

const years = ['2025', '2024', '2023'] as const;

export function Timeline() {
  const [activeYear, setActiveYear] = useState('2025');

  const renderYearContent = (year: string) => {
    const records = transactionRecords[year];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {records.map((record, index: number) => {
          const typedRecord = record as Transaction;
          const Icon = actionIcons[typedRecord.type];
          const colorClass = actionColors[typedRecord.type];
          const nodeColor = nodeColors[typedRecord.type];
          
          return (
            <motion.div
              key={`${year}-${index}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.25 }}
              className="bg-gray-50 rounded-lg border border-gray-100 p-2.5 hover:border-primary/25 transition-all hover:shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-500 text-xs">{typedRecord.month}</span>
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                  <Icon className="w-3 h-3" />
                  {actionLabels[typedRecord.type]}
                </div>
              </div>
              
              {/* Card Content */}
              <p className="text-gray-800 text-xs font-medium mb-1 line-clamp-1">{typedRecord.target}</p>
              <p className="text-gray-500 text-xs line-clamp-1">{typedRecord.detail}</p>
              
              {/* Bottom Indicator */}
              <div 
                className="mt-1.5 h-0.5 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${nodeColor}30, ${nodeColor})`,
                  width: '35%'
                }}
              />
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <Tabs value={activeYear} onValueChange={setActiveYear} className="w-full">
      <TabsList className="bg-gray-100 border border-gray-200 p-0.5 mb-3 h-8">
        {years.map((year) => (
          <TabsTrigger 
            key={year}
            value={year}
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-gray-600 text-xs px-4 h-7"
          >
            {year}年
          </TabsTrigger>
        ))}
      </TabsList>
      
      {years.map((year) => (
        <TabsContent key={year} value={year} className="mt-0">
          {renderYearContent(year)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
