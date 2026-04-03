import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FundPieChart } from '../components/FundPieChart';
import { fundHoldings } from '../data/customerData';
import { 
  Wallet, 
  PiggyBank, 
  Receipt, 
  History,
  FileText,
  Gift,
  BarChart3,
  DollarSign,
  Landmark,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// 账户信息数据
const accountInfo = {
  accountNo: '622202******8888',
  accountType: '基金交易账户',
  openDate: '2020-03-15',
  status: '正常',
  riskLevel: '稳健型',
  bankName: '中国工商银行',
  bankAccount: '622202******8888',
};

// 账户流水数据
const accountFlow = [
  { date: '2026-03-30', type: '申购', amount: 50000, balance: 210000, desc: '易方达蓝筹精选混合' },
  { date: '2026-03-28', type: '赎回', amount: -20000, balance: 160000, desc: '易方达灵活配置混合' },
  { date: '2026-03-25', type: '分红', amount: 1500, balance: 180000, desc: '中短债基金分红' },
  { date: '2026-03-20', type: '申购', amount: 30000, balance: 178500, desc: '易方达沪深300指数' },
  { date: '2026-03-15', type: '赎回', amount: -10000, balance: 148500, desc: '利率债基金' },
];

// 份额明细数据
const shareDetails = [
  { fundName: '易方达蓝筹精选混合', fundCode: '005827', shares: 5000, nav: 9.0, amount: 45000 },
  { fundName: '易方达灵活配置混合', fundCode: '009823', shares: 6000, nav: 10.0, amount: 60000 },
  { fundName: '易方达中短债基金', fundCode: '110052', shares: 4500, nav: 7.0, amount: 31500 },
  { fundName: '易方达利率债基金', fundCode: '110053', shares: 2100, nav: 10.0, amount: 21000 },
  { fundName: '易方达沪深300指数', fundCode: '110020', shares: 3000, nav: 10.5, amount: 31500 },
  { fundName: '易方达中证500增强', fundCode: '110021', shares: 1600, nav: 10.5, amount: 16800 },
  { fundName: '易方达全球科技QDII', fundCode: '110024', shares: 400, nav: 10.5, amount: 4200 },
];

// 交易确认数据
const tradeConfirm = [
  { date: '2026-03-30', fundName: '易方达蓝筹精选混合', type: '申购', amount: 50000, status: '确认成功', confirmDate: '2026-03-31' },
  { date: '2026-03-28', fundName: '易方达灵活配置混合', type: '赎回', amount: 20000, status: '确认成功', confirmDate: '2026-03-29' },
  { date: '2026-03-20', fundName: '易方达沪深300指数', type: '申购', amount: 30000, status: '确认成功', confirmDate: '2026-03-21' },
  { date: '2026-03-15', fundName: '易方达利率债基金', type: '赎回', amount: 10000, status: '确认成功', confirmDate: '2026-03-16' },
];

// 组合交易确认数据
const portfolioTrade = [
  { date: '2026-03-30', portfolioName: '稳健增长组合', type: '调仓', amount: 50000, status: '确认成功' },
  { date: '2026-03-15', portfolioName: '价值精选组合', type: '定投', amount: 10000, status: '确认成功' },
];

// 分红记录数据
const dividendRecords = [
  { date: '2026-03-25', fundName: '易方达中短债基金', dividendType: '现金分红', amount: 1500, shares: 0 },
  { date: '2026-02-28', fundName: '易方达利率债基金', dividendType: '红利再投', amount: 800, shares: 80 },
  { date: '2026-01-25', fundName: '易方达中短债基金', dividendType: '现金分红', amount: 1200, shares: 0 },
];

// 收益查询数据
const incomeQuery = [
  { date: '2026-03', totalIncome: 8500, realizedIncome: 3200, unrealizedIncome: 5300 },
  { date: '2026-02', totalIncome: 6200, realizedIncome: 2800, unrealizedIncome: 3400 },
  { date: '2026-01', totalIncome: 7800, realizedIncome: 3500, unrealizedIncome: 4300 },
  { date: '2025-12', totalIncome: 9100, realizedIncome: 4200, unrealizedIncome: 4900 },
];

// 货币每日收益数据
const dailyIncome = [
  { date: '2026-03-30', income: 12.5, principal: 50000 },
  { date: '2026-03-29', income: 12.3, principal: 50000 },
  { date: '2026-03-28', income: 12.8, principal: 50000 },
  { date: '2026-03-27', income: 12.1, principal: 50000 },
  { date: '2026-03-26', income: 12.6, principal: 50000 },
];

export function FundBusiness() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('current-assets');

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="space-y-4"
    >
      {/* Section Title with Collapse Button */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-[hsl(207,85%,42%)] to-[hsl(191,78%,55%)] rounded-full" />
          <h2 className="text-gray-800 text-lg font-semibold">基金业务信息</h2>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </motion.div>

      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[3000px] opacity-100'}`}>
        <motion.div variants={itemVariants}>
          <Card className="bg-white border-gray-200 shadow-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Tabs List */}
                  <TabsList className="w-full justify-start bg-gray-50 border-b border-gray-200 rounded-none p-0 h-auto flex-wrap">
                    {[
                      { id: 'account-info', label: '账户信息', icon: <Landmark className="w-3.5 h-3.5" /> },
                      { id: 'account-flow', label: '账户流水', icon: <Receipt className="w-3.5 h-3.5" /> },
                      { id: 'current-assets', label: '当前资产', icon: <Wallet className="w-3.5 h-3.5" /> },
                      { id: 'history-assets', label: '历史资产', icon: <History className="w-3.5 h-3.5" /> },
                      { id: 'share-detail', label: '份额明细', icon: <PiggyBank className="w-3.5 h-3.5" /> },
                      { id: 'trade-confirm', label: '交易确认', icon: <FileText className="w-3.5 h-3.5" /> },
                      { id: 'portfolio-confirm', label: '组合交易确认', icon: <FileText className="w-3.5 h-3.5" /> },
                      { id: 'dividend', label: '分红记录', icon: <Gift className="w-3.5 h-3.5" /> },
                      { id: 'income', label: '收益查询', icon: <BarChart3 className="w-3.5 h-3.5" /> },
                      { id: 'daily-income', label: '货币每日收益', icon: <DollarSign className="w-3.5 h-3.5" /> },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-gray-600 text-xs px-4 py-2.5 rounded-none border-b-2 border-transparent hover:bg-gray-100 flex items-center gap-1.5"
                      >
                        {tab.icon}
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* 账户信息 */}
                  <TabsContent value="account-info" className="p-4 mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: '基金账号', value: accountInfo.accountNo },
                        { label: '账户类型', value: accountInfo.accountType },
                        { label: '开户日期', value: accountInfo.openDate },
                        { label: '账户状态', value: accountInfo.status, highlight: true },
                        { label: '风险等级', value: accountInfo.riskLevel },
                        { label: '开户银行', value: accountInfo.bankName },
                        { label: '银行账号', value: accountInfo.bankAccount },
                      ].map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                          <p className={`text-sm font-medium ${item.highlight ? 'text-emerald-600' : 'text-gray-800'}`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* 账户流水 */}
                  <TabsContent value="account-flow" className="p-4 mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">日期</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">类型</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">说明</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">金额</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">余额</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {accountFlow.map((item, index) => (
                            <tr key={index} className="hover:bg-primary/5">
                              <td className="px-3 py-2 text-gray-600 text-xs">{item.date}</td>
                              <td className="px-3 py-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  item.type === '申购' ? 'bg-emerald-100 text-emerald-700' :
                                  item.type === '赎回' ? 'bg-amber-100 text-amber-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {item.type}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-gray-600 text-xs">{item.desc}</td>
                              <td className={`px-3 py-2 text-right text-xs font-mono-num ${
                                item.amount > 0 ? 'text-emerald-600' : 'text-red-600'
                              }`}>
                                {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
                              </td>
                              <td className="px-3 py-2 text-right text-gray-700 text-xs font-mono-num">
                                {item.balance.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  {/* 当前资产 */}
                  <TabsContent value="current-assets" className="p-4 mt-0">
                    {/* 资产概览统计 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {(() => {
                        const totalAmount = fundHoldings.details.reduce((s, f) => s + f.amount, 0);
                        const totalProfit = fundHoldings.details.reduce((s, f) => s + f.amount * f.profit / 100, 0);
                        const avgProfit = fundHoldings.details.length > 0
                          ? fundHoldings.details.reduce((s, f) => s + f.profit, 0) / fundHoldings.details.length
                          : 0;
                        return [
                          { label: '总资产', value: `¥${totalAmount.toLocaleString()}`, color: 'text-primary', bg: 'bg-primary/10' },
                          { label: '持仓基金', value: `${fundHoldings.details.length}只`, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                          { label: '累计盈亏', value: `${totalProfit >= 0 ? '+' : ''}¥${totalProfit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, color: totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600', bg: totalProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50' },
                          { label: '平均收益率', value: `${avgProfit >= 0 ? '+' : ''}${avgProfit.toFixed(1)}%`, color: avgProfit >= 0 ? 'text-emerald-600' : 'text-red-600', bg: avgProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50' },
                        ].map((item, i) => (
                          <div key={i} className={`${item.bg} rounded-lg p-3`}>
                            <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                            <p className={`text-base font-bold font-mono-num ${item.color}`}>{item.value}</p>
                          </div>
                        ));
                      })()}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* 持仓分布饼图 + 分类明细 */}
                      <div>
                        <h4 className="text-gray-700 text-sm font-medium mb-3">持仓分布</h4>
                        <div className="h-[200px]">
                          <FundPieChart />
                        </div>
                        {/* 分类统计 */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {fundHoldings.summary.map((item) => (
                            <div key={item.type} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-700 text-xs font-medium truncate">{item.type}</p>
                                <p className="text-gray-400 text-[10px]">{item.count}只 · {item.percentage}%</p>
                              </div>
                              <p className="text-gray-600 text-xs font-mono-num shrink-0">¥{item.amount.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 持仓明细 */}
                      <div>
                        <h4 className="text-gray-700 text-sm font-medium mb-3">持仓明细</h4>
                        <div className="space-y-2">
                          {fundHoldings.details.map((fund) => (
                            <div key={fund.code} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 hover:bg-primary/5 transition-colors">
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-700 text-xs font-medium truncate">{fund.name}</p>
                                <p className="text-gray-400 text-[10px]">{fund.code} · {fund.shares.toLocaleString()}份</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-gray-700 text-xs font-mono-num">¥{fund.amount.toLocaleString()}</p>
                                <p className={`text-[10px] font-mono-num ${fund.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {fund.profit >= 0 ? '+' : ''}{fund.profit}%
                                </p>
                              </div>
                              {/* 占比条 */}
                              <div className="w-14 shrink-0">
                                <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${fund.percentage}%` }} />
                                </div>
                                <p className="text-gray-400 text-[9px] text-center mt-0.5 font-mono-num">{fund.percentage}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 历史资产 */}
                  <TabsContent value="history-assets" className="p-4 mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">日期</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">总资产</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">累计收益</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">收益率</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { date: '2026-03-31', total: 210000, income: 26800, rate: 12.8 },
                            { date: '2026-02-28', total: 205000, income: 21800, rate: 10.6 },
                            { date: '2026-01-31', total: 198000, income: 18800, rate: 9.5 },
                            { date: '2025-12-31', total: 192000, income: 15200, rate: 7.9 },
                            { date: '2025-11-30', total: 185000, income: 12000, rate: 6.5 },
                          ].map((item, index) => (
                            <tr key={index} className="hover:bg-primary/5">
                              <td className="px-3 py-2 text-gray-600 text-xs">{item.date}</td>
                              <td className="text-right px-3 py-2 text-gray-700 text-xs font-mono-num">
                                ¥{item.total.toLocaleString()}
                              </td>
                              <td className="text-right px-3 py-2 text-emerald-600 text-xs font-mono-num">
                                +¥{item.income.toLocaleString()}
                              </td>
                              <td className="text-right px-3 py-2 text-emerald-600 text-xs font-mono-num">
                                +{item.rate}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  {/* 份额明细 */}
                  <TabsContent value="share-detail" className="p-4 mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">基金名称</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">基金代码</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">持有份额</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">单位净值</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">持仓金额</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {shareDetails.map((item, index) => (
                            <tr key={index} className="hover:bg-primary/5">
                              <td className="px-3 py-2 text-gray-700 text-xs font-medium">{item.fundName}</td>
                              <td className="px-3 py-2 text-gray-400 text-xs font-mono">{item.fundCode}</td>
                              <td className="text-right px-3 py-2 text-gray-600 text-xs font-mono-num">
                                {item.shares.toLocaleString()}
                              </td>
                              <td className="text-right px-3 py-2 text-gray-600 text-xs font-mono-num">
                                ¥{item.nav.toFixed(4)}
                              </td>
                              <td className="text-right px-3 py-2 text-gray-700 text-xs font-mono-num">
                                ¥{item.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  {/* 交易确认 */}
                  <TabsContent value="trade-confirm" className="p-4 mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">交易日期</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">基金名称</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">交易类型</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">交易金额</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">确认状态</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">确认日期</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {tradeConfirm.map((item, index) => (
                            <tr key={index} className="hover:bg-primary/5">
                              <td className="px-3 py-2 text-gray-600 text-xs">{item.date}</td>
                              <td className="px-3 py-2 text-gray-700 text-xs">{item.fundName}</td>
                              <td className="px-3 py-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  item.type === '申购' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {item.type}
                                </span>
                              </td>
                              <td className="text-right px-3 py-2 text-gray-700 text-xs font-mono-num">
                                ¥{item.amount.toLocaleString()}
                              </td>
                              <td className="px-3 py-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-gray-600 text-xs">{item.confirmDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  {/* 组合交易确认 */}
                  <TabsContent value="portfolio-confirm" className="p-4 mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">交易日期</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">组合名称</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">交易类型</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">交易金额</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">确认状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {portfolioTrade.map((item, index) => (
                            <tr key={index} className="hover:bg-primary/5">
                              <td className="px-3 py-2 text-gray-600 text-xs">{item.date}</td>
                              <td className="px-3 py-2 text-gray-700 text-xs font-medium">{item.portfolioName}</td>
                              <td className="px-3 py-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  item.type === '调仓' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {item.type}
                                </span>
                              </td>
                              <td className="text-right px-3 py-2 text-gray-700 text-xs font-mono-num">
                                ¥{item.amount.toLocaleString()}
                              </td>
                              <td className="px-3 py-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  {/* 分红记录 */}
                  <TabsContent value="dividend" className="p-4 mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">分红日期</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">基金名称</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">分红方式</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">分红金额</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">再投份额</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {dividendRecords.map((item, index) => (
                            <tr key={index} className="hover:bg-primary/5">
                              <td className="px-3 py-2 text-gray-600 text-xs">{item.date}</td>
                              <td className="px-3 py-2 text-gray-700 text-xs">{item.fundName}</td>
                              <td className="px-3 py-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  item.dividendType === '现金分红' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {item.dividendType}
                                </span>
                              </td>
                              <td className="text-right px-3 py-2 text-emerald-600 text-xs font-mono-num">
                                +¥{item.amount.toLocaleString()}
                              </td>
                              <td className="text-right px-3 py-2 text-gray-600 text-xs font-mono-num">
                                {item.shares > 0 ? item.shares : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  {/* 收益查询 */}
                  <TabsContent value="income" className="p-4 mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">月份</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">总收益</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">已实现收益</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">未实现收益</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {incomeQuery.map((item, index) => (
                            <tr key={index} className="hover:bg-primary/5">
                              <td className="px-3 py-2 text-gray-600 text-xs">{item.date}</td>
                              <td className="text-right px-3 py-2 text-emerald-600 text-xs font-mono-num font-medium">
                                +¥{item.totalIncome.toLocaleString()}
                              </td>
                              <td className="text-right px-3 py-2 text-emerald-600 text-xs font-mono-num">
                                +¥{item.realizedIncome.toLocaleString()}
                              </td>
                              <td className="text-right px-3 py-2 text-blue-600 text-xs font-mono-num">
                                +¥{item.unrealizedIncome.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  {/* 货币每日收益 */}
                  <TabsContent value="daily-income" className="p-4 mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-2">日期</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">本金</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">当日收益</th>
                            <th className="text-right text-gray-500 text-xs font-medium px-3 py-2">七日年化</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {dailyIncome.map((item, index) => (
                            <tr key={index} className="hover:bg-primary/5">
                              <td className="px-3 py-2 text-gray-600 text-xs">{item.date}</td>
                              <td className="text-right px-3 py-2 text-gray-700 text-xs font-mono-num">
                                ¥{item.principal.toLocaleString()}
                              </td>
                              <td className="text-right px-3 py-2 text-emerald-600 text-xs font-mono-num">
                                +¥{item.income.toFixed(2)}
                              </td>
                              <td className="text-right px-3 py-2 text-gray-600 text-xs font-mono-num">
                                2.45%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          </div>
    </motion.section>
  );
}
