import { useState } from 'react';
import { motion } from 'framer-motion';
import { InfoCard } from '../components/InfoCard';
import { 
  User, 
  Phone, 
  Briefcase, 
  Shield,
  ChevronDown,
  ChevronUp,
  Pencil
} from 'lucide-react';
import { customerInfo } from '../data/customerData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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

export function BasicInfo() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { basicInfo, contactInfo, businessInfo, systemStatus } = customerInfo;

  const basicItems = [
    { label: '客户姓名', value: basicInfo.name },
    { label: '证件类型', value: basicInfo.idType },
    { label: '证件号码', value: basicInfo.idNumber },
    { label: '客户编号', value: basicInfo.customerId },
  ];

  const contactItems = [
    { label: '手机号码', value: contactInfo.phone },
    { label: '电子邮箱', value: contactInfo.email },
    { label: '通讯地址', value: contactInfo.address },
    { label: '邮政编码', value: contactInfo.zipCode },
  ];

  const businessItems = [
    { label: '客户类型', value: businessInfo.customerType },
    { label: '风险等级', value: businessInfo.riskLevel },
    { label: '投资经验', value: businessInfo.investmentExp },
    { label: '开户日期', value: businessInfo.openDate },
  ];

  const systemItems = [
    { label: '账户状态', value: systemStatus.accountStatus },
    { label: '黑名单状态', value: systemStatus.blacklistStatus },
    { label: '服务等级', value: systemStatus.serviceLevel },
    { label: '最近登录', value: systemStatus.lastLogin },
  ];

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="space-y-3"
    >
      {/* Section Title with Collapse & Edit Buttons */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-[hsl(207,85%,42%)] to-[hsl(191,78%,55%)] rounded-full" />
          <h2 className="text-gray-800 text-lg font-semibold">基本信息</h2>
        </div>
        <div className="flex items-center gap-1">
          {/* Edit Button */}
          <button
            title="点击可编辑客户信息"
            className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          {/* Collapse Button */}
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
        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div variants={itemVariants}>
            <InfoCard
              title="基本资料"
              icon={<User className="w-4 h-4" />}
              items={basicItems}
            />
          </motion.div>
              
              <motion.div variants={itemVariants}>
                <InfoCard
                  title="联系方式与地址"
                  icon={<Phone className="w-4 h-4" />}
                  items={contactItems}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <InfoCard
                  title="业务属性"
                  icon={<Briefcase className="w-4 h-4" />}
                  items={businessItems}
                />
              </motion.div>
              
          <motion.div variants={itemVariants}>
            <InfoCard
              title="系统状态与标记"
              icon={<Shield className="w-4 h-4" />}
              items={systemItems}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
