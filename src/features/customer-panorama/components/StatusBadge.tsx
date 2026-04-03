import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'cyan';
  className?: string;
}

const statusTypeMap: Record<string, string> = {
  // 活动状态
  '已参加': 'success',
  '已报名，未参加': 'warning',
  '已报名': 'info',
  '未报名': 'default',
  
  // 工单状态
  '已解决': 'success',
  '处理中': 'info',
  '待处理': 'warning',
  
  // 过户状态
  '已完成': 'success',
  '材料审核中': 'info',
  '复核通过': 'cyan',
  '复核失败': 'danger',
  '未提交复核': 'warning',
  
  // 通用状态
  '正常': 'success',
  '异常': 'danger',
  '否': 'default',
  '是': 'success',
  
  // 发送状态
  '发送成功': 'success',
  '发送失败': 'danger',
  '已发送': 'success',
  
  // 订阅状态
  '已订阅': 'success',
  '未订阅': 'default',
  
  // 其他
  '呼入': 'cyan',
  '外呼': 'cyan',
  '宏观经济': 'cyan',
};

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const detectedType = type || (statusTypeMap[status] as StatusBadgeProps['type']) || 'default';
  
  const typeStyles = {
    default: 'bg-gray-100 text-gray-600 border-gray-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    cyan: 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-medium px-1.5 py-0 text-[10px]',
        typeStyles[detectedType],
        className
      )}
    >
      {status}
    </Badge>
  );
}
