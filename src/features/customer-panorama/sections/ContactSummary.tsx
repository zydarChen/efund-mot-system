import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '../components/StatusBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  Bell, 
  Calendar,
  FileText,
  Users,
  BookOpen,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { 
  phoneRecords, 
  smsRecords, 
  emailRecords, 
  subscriptionRecords,
  activityRecords,
  complaintRecords,
  inheritanceRecords,
  transferRecords,
  hotTopics,
  subscribedProducts
} from '../data/customerData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

// 各渠道总结内容
const channelSummaries: Record<string, { title: string; content: string }> = {
  traditional: {
    title: '传统服务渠道',
    content: '客户通过电话、短信、邮件等传统渠道与客服保持高频互动，近期主要咨询基金产品、账户操作等问题，服务满意度良好。'
  },
  business: {
    title: '业务办理渠道',
    content: '客户近期有非交易过户业务办理需求，已通过企微沟通完成材料准备，业务流程正在推进中，暂无投诉工单。'
  },
  selfservice: {
    title: '自助服务',
    content: '客户主动关注市场热点信息，订阅了投教类和市场分析类产品，表现出较强的自主学习意愿和投资研究能力。'
  }
};

export function ContactSummary() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('traditional');

  const currentSummary = channelSummaries[activeTab];

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
          <h2 className="text-gray-800 text-lg font-semibold">客户触点汇总</h2>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-100 border border-gray-200 p-0.5 mb-3 h-8">
              <TabsTrigger 
                value="traditional" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-gray-600 text-xs px-3"
              >
                <PhoneCall className="w-3 h-3 mr-1.5" />
                传统服务渠道
              </TabsTrigger>
              <TabsTrigger 
                value="business"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-gray-600 text-xs px-3"
              >
                <FileText className="w-3 h-3 mr-1.5" />
                业务办理渠道
              </TabsTrigger>
              <TabsTrigger 
                value="selfservice"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-gray-600 text-xs px-3"
              >
                <BookOpen className="w-3 h-3 mr-1.5" />
                自助服务
              </TabsTrigger>
            </TabsList>

            {/* Channel Summary Banner */}
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-4 bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/15 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-primary text-sm font-semibold mb-1">{currentSummary.title} · 数据概览</h4>
                  <p className="text-primary text-sm leading-relaxed">{currentSummary.content}</p>
                </div>
              </div>
            </motion.div>

            {/* Traditional Service Channel */}
            <TabsContent value="traditional" className="space-y-3 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Phone Records */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                      <PhoneCall className="w-3 h-3 text-primary" />
                      电话呼入/外呼记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[160px]">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">时间</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">类型</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">内容</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">结果</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {phoneRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-primary/5">
                              <td className="px-3 py-1.5 text-gray-500 text-xs">{record.time}</td>
                              <td className="px-3 py-1.5">
                                <StatusBadge status={record.type} type="cyan" />
                              </td>
                              <td className="px-3 py-1.5 text-gray-600 text-xs">{record.content}</td>
                              <td className="px-3 py-1.5">
                                <StatusBadge status={record.result} type="success" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* SMS Records */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-primary" />
                      短信下发/上行记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[160px]">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">时间</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">类型</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">内容</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {smsRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-primary/5">
                              <td className="px-3 py-1.5 text-gray-500 text-xs">{record.time}</td>
                              <td className="px-3 py-1.5 text-gray-600 text-xs">{record.type}</td>
                              <td className="px-3 py-1.5 text-gray-600 text-xs">{record.content}</td>
                              <td className="px-3 py-1.5">
                                <StatusBadge status={record.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Email Records */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-primary" />
                      邮件往来记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[160px]">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">时间</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">主题</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">类型</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {emailRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-primary/5">
                              <td className="px-3 py-1.5 text-gray-500 text-xs">{record.time}</td>
                              <td className="px-3 py-1.5 text-gray-600 text-xs">{record.subject}</td>
                              <td className="px-3 py-1.5 text-gray-600 text-xs">{record.type}</td>
                              <td className="px-3 py-1.5">
                                <StatusBadge status={record.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Subscription Records */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                      <Bell className="w-3 h-3 text-primary" />
                      订阅管理
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[160px]">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">服务</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">代码</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">状态</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">开通日期</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {subscriptionRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-primary/5">
                              <td className="px-3 py-1.5 text-gray-600 text-xs">{record.service}</td>
                              <td className="px-3 py-1.5 text-gray-400 text-xs font-mono">{record.code}</td>
                              <td className="px-3 py-1.5">
                                <StatusBadge status={record.status} />
                              </td>
                              <td className="px-3 py-1.5 text-gray-400 text-xs">{record.openDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Records */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-primary" />
                    客户活动管理
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[200px]">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">活动ID</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">活动类型</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">活动名称</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">日期</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">渠道经理</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">参加情况</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {activityRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-primary/5">
                            <td className="px-3 py-1.5 text-gray-400 text-xs font-mono">{record.id}</td>
                            <td className="px-3 py-1.5 text-gray-600 text-xs">{record.type}</td>
                            <td className="px-3 py-1.5 text-gray-600 text-xs">{record.name}</td>
                            <td className="px-3 py-1.5 text-gray-400 text-xs">{record.date}</td>
                            <td className="px-3 py-1.5 text-gray-600 text-xs">{record.manager}</td>
                            <td className="px-3 py-1.5">
                              <StatusBadge 
                                status={record.status} 
                                type={record.status === '已参加' ? 'success' : record.status === '未报名' ? 'default' : 'warning'} 
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Channel */}
            <TabsContent value="business" className="space-y-3 mt-0">
              {/* Complaint Records */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-primary" />
                    投诉工单
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[200px]">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">工单编号</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">投诉时间</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">投诉概要</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">级别</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">处理状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {complaintRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-primary/5">
                            <td className="px-3 py-1.5 text-gray-400 text-xs font-mono">{record.id}</td>
                            <td className="px-3 py-1.5 text-gray-400 text-xs">{record.date}</td>
                            <td className="px-3 py-1.5 text-gray-600 text-xs max-w-md truncate">{record.summary}</td>
                            <td className="px-3 py-1.5">
                              <StatusBadge status={record.level} type="info" />
                            </td>
                            <td className="px-3 py-1.5">
                              <StatusBadge status={record.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* 企微沟通记录 */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                    <MessageCircle className="w-3 h-3 text-primary" />
                    企微沟通记录
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[280px]">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5 w-[35%]">沟通记录</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5 w-[15%]">时间</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5 w-[15%]">主题</th>
                          <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5 w-[35%]">跟进事项</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-primary/5">
                          <td className="px-3 py-2 text-gray-700 text-xs leading-relaxed">与客户确认非交易过户申请材料清单及补充要求</td>
                          <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">2026-03-31 09:30:15</td>
                          <td className="px-3 py-2 text-gray-600 text-xs">非交易过户材料沟通</td>
                          <td className="px-3 py-2 text-gray-600 text-xs leading-relaxed">1. 向客户同步继承过户所需的死亡证明、继承公证书、身份证等材料清单；2. 确认客户已准备齐全，告知需在 4 月 3 日前提交至线下营业部或上传至蚂蚁 i 平台；3. 提醒客户公证书需注明 "与原件一致"，避免因格式问题退回。</td>
                        </tr>
                        <tr className="hover:bg-primary/5">
                          <td className="px-3 py-2 text-gray-700 text-xs leading-relaxed">向客户反馈非交易过户申请复核进度及异常处理</td>
                          <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">2026-03-31 11:20:40</td>
                          <td className="px-3 py-2 text-gray-600 text-xs">申请进度同步</td>
                          <td className="px-3 py-2 text-gray-600 text-xs leading-relaxed">1. 告知客户当前申请处于 "待复核" 状态，复核人已收到申请，预计 1 个工作日内完成审核；2. 若审核中发现材料缺失，将第一时间通过企业微信联系客户补正，同步补正要求及截止时间；3. 提供复核咨询入口，客户可随时询问审核进展。</td>
                        </tr>
                        <tr className="hover:bg-primary/5">
                          <td className="px-3 py-2 text-gray-700 text-xs leading-relaxed">解答客户关于非交易过户份额到账时间及查询方式的疑问</td>
                          <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">2026-03-31 14:15:25</td>
                          <td className="px-3 py-2 text-gray-600 text-xs">份额到账及查询沟通</td>
                          <td className="px-3 py-2 text-gray-600 text-xs leading-relaxed">1. 明确告知客户，非交易过户申请经 TA 系统处理完成后，份额将在 1-2 个工作日内划入转入方基金账户；2. 指导客户通过蚂蚁基金 APP "我的资产" 页面查询转入方份额余额，或查看消息中心的到账通知；3. 提供异常查询联系方式，若超期未到账可直接联系对接人协助核查。</td>
                        </tr>
                        <tr className="hover:bg-primary/5">
                          <td className="px-3 py-2 text-gray-700 text-xs leading-relaxed">与客户沟通废弃非交易过户申请的流程及注意事项</td>
                          <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">2026-03-31 16:05:10</td>
                          <td className="px-3 py-2 text-gray-600 text-xs">废弃申请流程沟通</td>
                          <td className="px-3 py-2 text-gray-600 text-xs leading-relaxed">1. 向客户说明废弃非交易过户申请的条件（如材料有误、无需过户等），确认客户是否有废弃需求；2. 告知废弃申请需提交《非交易过户废弃申请书》，经签字确认后提交至系统，废弃后无法恢复原申请；3. 提供申请书模板下载链接，指导客户填写及提交路径。</td>
                        </tr>
                        <tr className="hover:bg-primary/5">
                          <td className="px-3 py-2 text-gray-700 text-xs leading-relaxed">跟进客户非交易过户申请提交后的后续服务衔接</td>
                          <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">2026-04-01 10:00:35</td>
                          <td className="px-3 py-2 text-gray-600 text-xs">后续服务衔接沟通</td>
                          <td className="px-3 py-2 text-gray-600 text-xs leading-relaxed">1. 告知客户非交易过户申请提交完成后，可通过企业微信咨询转入方基金份额的持有技巧、收益查询等相关问题；2. 邀请客户加入蚂蚁基金投顾服务社群，获取后续资产配置建议；3. 留存对接人联系方式，后续过户相关问题可随时咨询。</td>
                        </tr>
                      </tbody>
                    </table>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Inheritance Records */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-primary" />
                      继承过户流程
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[160px]">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">原持有人</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">关系</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">基金</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {inheritanceRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-primary/5">
                              <td className="px-3 py-1.5 text-gray-600 text-xs">{record.fromName}</td>
                              <td className="px-3 py-1.5 text-gray-400 text-xs">{record.relationship}</td>
                              <td className="px-3 py-1.5 text-gray-600 text-xs">{record.fundName}</td>
                              <td className="px-3 py-1.5">
                                <StatusBadge 
                                  status={record.status} 
                                  type={record.status === '已完成' ? 'success' : 'info'} 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Transfer Records */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-primary" />
                      非交易过户
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[160px]">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">单号</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">转出方</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">份额</th>
                            <th className="text-left text-gray-500 text-xs font-medium px-3 py-1.5">状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {transferRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-primary/5">
                              <td className="px-3 py-1.5 text-gray-400 text-xs font-mono">{record.id}</td>
                              <td className="px-3 py-1.5 text-gray-600 text-xs">{record.fromName}</td>
                              <td className="px-3 py-1.5 text-gray-600 text-xs font-mono-num">{record.shares}</td>
                              <td className="px-3 py-1.5">
                                <StatusBadge 
                                  status={record.statusText} 
                                  type={
                                    record.statusText === '已完成' ? 'success' :
                                    record.statusText === '复核失败' ? 'danger' :
                                    record.statusText === '未提交复核' ? 'warning' : 'info'
                                  } 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Self Service */}
            <TabsContent value="selfservice" className="space-y-3 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Hot Topics */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-primary" />
                      关注热点信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[240px]">
                      <div className="space-y-2 p-3">
                        {hotTopics.map((topic, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.04 }}
                            className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/20 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <StatusBadge status={topic.category} type="cyan" />
                              <span className="text-gray-400 text-xs">{topic.date}</span>
                            </div>
                            <p className="text-gray-700 text-xs font-medium mb-1">{topic.title}</p>
                            <p className="text-gray-500 text-xs">{topic.summary}</p>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Subscribed Products */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-gray-700 text-xs font-semibold flex items-center gap-1.5">
                      <Bell className="w-3 h-3 text-primary" />
                      订阅产品信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[240px]">
                      <div className="space-y-2 p-3">
                        {subscribedProducts.map((product, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.04 }}
                            className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/20 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <StatusBadge 
                                status={product.type} 
                                type={product.type === '投教类' ? 'info' : 'warning'} 
                              />
                              <span className="text-gray-400 text-xs">{product.format}</span>
                            </div>
                            <p className="text-gray-700 text-xs">{product.title}</p>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.section>
  );
}
