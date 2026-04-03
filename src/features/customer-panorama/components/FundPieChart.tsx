import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { fundHoldings } from '../data/customerData';

const data = fundHoldings.summary;

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface TooltipPayload {
  name: string;
  value: number;
  payload: {
    type: string;
    amount: number;
    count: number;
    color: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const data = item.payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
        <p className="text-gray-800 font-medium text-sm mb-1">{data.type}</p>
        <p className="text-primary text-xs">
          占比: <span className="font-mono-num">{item.value}%</span>
        </p>
        <p className="text-gray-500 text-xs">
          金额: <span className="font-mono-num">¥{data.amount.toLocaleString()}</span>
        </p>
        <p className="text-gray-500 text-xs">
          数量: <span className="font-mono-num">{data.count}只</span>
        </p>
      </div>
    );
  }
  return null;
};

export function FundPieChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={70}
            innerRadius={45}
            fill="#8884d8"
            dataKey="percentage"
            nameKey="type"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={30}
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span style={{ color: '#4b5563', fontSize: '11px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
