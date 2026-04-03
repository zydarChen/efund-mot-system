import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Tags, 
  Headphones, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Cpu
} from 'lucide-react';

interface CustomerProfileProps {
  onAIAnalysisClick?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// 客户画像数据
const customerStage = {
  stage: '成长期',
  subStage: '进阶用户',
  description: '客户处于投资成长期，已有一定投资经验，正在积极扩展投资知识和技能'
};

const customerTags = [
  '开户 6-18 个月',
  '持仓 5-50 万',
  '投资经验 1-3 年',
  '主动研究市场',
  '尝试权益 / 主题基金',
  '风险承受力提升'
];

const serviceTouchpoints = [
  { name: '官方 APP', icon: '📱' },
  { name: '易服务', icon: '💬' },
  { name: '投资顾问', icon: '👔' },
  { name: '企微', icon: '💼' },
  { name: '社群', icon: '👥' },
  { name: '直播路演', icon: '🎥' },
  { name: '线下沙龙', icon: '🤝' }
];

const serviceStrategies = [
  { name: '组合优化', color: 'sky' },
  { name: '定投策略', color: 'emerald' },
  { name: '市场解读', color: 'blue' },
  { name: '投后陪伴', color: 'amber' },
  { name: '工具赋能', color: 'purple' }
];

export function CustomerProfile({ onAIAnalysisClick }: CustomerProfileProps = {}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* Section Title with Collapse Button & AI Analysis Button */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-[hsl(207,85%,42%)] to-[hsl(191,78%,55%)] rounded-full" />
          <h2 className="text-gray-800 text-lg font-semibold">客户画像标签</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* AI分析按钮 */}
          {onAIAnalysisClick && (
            <Button
              onClick={onAIAnalysisClick}
              size="sm"
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-xs px-3 py-1.5 h-8 rounded-lg shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
            >
              <Cpu className="w-3.5 h-3.5 mr-1.5" />
              AI分析
            </Button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'}`}>
        {/* 使用固定高度的网格布局，确保左右对齐 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="grid grid-rows-2 gap-4">
            {/* Customer Stage Card - 固定高度 */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="bg-white border-gray-200 card-hover shadow-sm h-full flex flex-col">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-gray-800 text-sm font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    客户阶段
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex-1 flex items-center">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(207,85%,52%)] to-[hsl(207,85%,42%)] flex items-center justify-center">
                        <span className="text-white text-base font-bold">{customerStage.stage}</span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-800">{customerStage.subStage}</h3>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{customerStage.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Customer Tags Card - 固定高度 */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="bg-white border-gray-200 card-hover shadow-sm h-full flex flex-col">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-gray-800 text-sm font-semibold flex items-center gap-2">
                    <Tags className="w-4 h-4 text-primary" />
                    客户标签
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex-1 flex items-center">
                  <div className="flex flex-wrap gap-2">
                    {customerTags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="px-2.5 py-1 bg-gradient-to-r from-primary/5 to-blue-50 text-primary border border-primary/20 rounded-md text-xs font-medium hover:shadow-sm transition-shadow"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="grid grid-rows-2 gap-4">
            {/* Service Touchpoints AI Recommendation - 固定高度 */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="bg-white border-gray-200 card-hover shadow-sm h-full flex flex-col">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-gray-800 text-sm font-semibold flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-emerald-500" />
                    服务触点 AI 推荐
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex-1 flex items-center">
                  <div className="grid grid-cols-7 gap-2 w-full">
                    {serviceTouchpoints.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex flex-col items-center p-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors cursor-pointer"
                      >
                        <span className="text-xl mb-1">{item.icon}</span>
                        <span className="text-gray-700 text-[10px] font-medium text-center leading-tight">{item.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Strategy AI Recommendation - 固定高度 */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="bg-white border-gray-200 card-hover shadow-sm h-full flex flex-col">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-gray-800 text-sm font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    服务策略 AI 推荐
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex-1 flex items-center">
                  <div className="flex flex-wrap gap-2">
                    {serviceStrategies.map((strategy, index) => {
                      const colorMap: Record<string, string> = {
                        sky: 'from-primary/5 to-blue-50 text-primary border-primary/20',
                        emerald: 'from-emerald-50 to-green-50 text-emerald-700 border-emerald-200',
                        blue: 'from-blue-50 to-indigo-50 text-blue-700 border-blue-200',
                        amber: 'from-amber-50 to-yellow-50 text-amber-700 border-amber-200',
                        purple: 'from-purple-50 to-pink-50 text-purple-700 border-purple-200',
                      };
                      return (
                        <motion.span
                          key={strategy.name}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 }}
                          className={`px-3 py-1.5 bg-gradient-to-r ${colorMap[strategy.color]} border rounded-md text-xs font-medium hover:shadow-sm transition-shadow`}
                        >
                          {strategy.name}
                        </motion.span>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
