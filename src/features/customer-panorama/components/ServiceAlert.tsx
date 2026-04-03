import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingDown, FileWarning, Clock } from 'lucide-react';

interface AlertItem {
  id: string;
  type: 'risk' | 'warning' | 'info';
  icon: React.ReactNode;
  title: string;
  content: string;
  tag: string;
  tagColor: string;
}

export function ServiceAlert() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      type: 'risk',
      icon: <TrendingDown className="w-4 h-4" />,
      title: '账户收益大幅回撤',
      content: '客户账户近30天收益回撤达18.5%，超过客户风险承受阈值（15%），建议尽快联系客户进行持仓调整和风险安抚。',
      tag: '高风险',
      tagColor: 'bg-red-100 text-red-700',
    },
    {
      id: '2',
      type: 'warning',
      icon: <FileWarning className="w-4 h-4" />,
      title: '多起投诉工单待解决',
      content: '近期有3起投诉工单（TS-20260329-010、TS-20260326-009、TS-20260323-008）处理进度滞后，请及时跟进处理。',
      tag: '待处理',
      tagColor: 'bg-amber-100 text-amber-700',
    },
    {
      id: '3',
      type: 'info',
      icon: <Clock className="w-4 h-4" />,
      title: '身份证信息即将过期',
      content: '客户预留身份证信息将于2026-04-15过期，请及时跟进客户更换有效证件。',
      tag: '服务提醒',
      tagColor: 'bg-blue-100 text-blue-700',
    },
  ]);

  const handleProcess = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (alerts.length === 0) return null;

  const getCardColor = (type: string) => {
    switch (type) {
      case 'risk':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'risk':
        return 'bg-red-100 text-red-600';
      case 'warning':
        return 'bg-amber-100 text-amber-600';
      case 'info':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'risk':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'warning':
        return 'bg-amber-600 text-white hover:bg-amber-700';
      case 'info':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      default:
        return 'bg-gray-600 text-white hover:bg-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      {/* Alert Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-3 h-3 text-red-600" />
        </div>
        <h3 className="text-red-700 font-semibold text-sm">服务预警</h3>
        <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
          {alerts.length}
        </span>
      </div>

      {/* Alert Cards - Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.25 }}
              className={`relative rounded-lg border p-3 ${getCardColor(alert.type)}`}
            >
              {/* Card Content */}
              <div className="flex items-start gap-2">
                {/* Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(alert.type)}`}>
                  {alert.icon}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-gray-800 font-medium text-sm truncate">{alert.title}</h4>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${alert.tagColor}`}>
                      {alert.tag}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {alert.content}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-2 pt-2 border-t border-gray-200/50 flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleProcess(alert.id)}
                  className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${getButtonColor(alert.type)}`}
                >
                  立即处理
                </button>
                <button className={`text-xs font-medium px-2.5 py-1 rounded border transition-colors ${
                  alert.type === 'risk' 
                    ? 'border-red-300 text-red-600 hover:bg-red-100' 
                    : alert.type === 'warning'
                    ? 'border-amber-300 text-amber-600 hover:bg-amber-100'
                    : 'border-blue-300 text-blue-600 hover:bg-blue-100'
                }`}>
                  查看详情
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
