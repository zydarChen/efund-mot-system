import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Sparkles, UserCircle, TrendingUp, PhoneCall, Tag } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { CustomerInfoBar } from './components/CustomerInfoBar';
import { ServiceAlert } from './components/ServiceAlert';
import { BasicInfo } from './sections/BasicInfo';
import { FundBusiness } from './sections/FundBusiness';
import { ContactSummary } from './sections/ContactSummary';
import { CustomerProfile } from './sections/CustomerProfile';
import { customerInfo, fundHoldings } from './data/customerData';
import './panorama.css';

const navItems = [
  { id: 'overview', label: '客户概览', icon: UserCircle },
  { id: 'fund', label: '基金业务', icon: TrendingUp },
  { id: 'contact', label: '触点记录', icon: PhoneCall },
  { id: 'profile', label: '客户画像', icon: Tag },
];

function CustomerPanoramaPage() {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const [activeSection, setActiveSection] = useState('overview');
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Calculate total assets
  const totalAssets = fundHoldings.details.reduce((sum, fund) => sum + fund.amount, 0);
  const fundCount = fundHoldings.details.length;

  // 页面加载后自动打开AI分析弹窗
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScanModal(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 监听 iframe 消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'SCAN_COMPLETED') {
        setScanCompleted(true);
        let count = 5;
        const countdownTimer = setInterval(() => {
          count -= 1;
          setCountdown(count);
          if (count <= 0) {
            clearInterval(countdownTimer);
            setShowScanModal(false);
            setScanCompleted(false);
            setCountdown(5);
          }
        }, 1000);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // iframe 加载完成后自动触发分析
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage('START_ANALYSIS', '*');
      }, 800);
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const sectionMap: Record<string, string> = {
      'overview': 'basic-info',
      'fund': 'fund-business',
      'contact': 'contact-summary',
      'profile': 'customer-profile',
    };
    const targetId = sectionMap[section];
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const openScanModal = () => {
    setShowScanModal(true);
    setScanCompleted(false);
    setCountdown(5);
  };

  return (
    <div className="-m-4">
      {/* 固定顶部区域：导航栏 */}
      <div className="sticky top-0 z-20">
        {/* 导航栏 */}
        <div className="border-b bg-card px-4 py-2 flex items-center gap-4">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回客户列表
          </button>
          <div className="w-px h-5 bg-border" />
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 客户搜索栏 */}
      <SearchBar />

      {/* 客户信息条 */}
      <CustomerInfoBar
        customerName={customerInfo.basicInfo.name}
        customerId={customerId || customerInfo.basicInfo.customerId}
        totalAssets={totalAssets}
        fundCount={fundCount}
      />

      {/* 内容区 */}
      <main className="p-4 space-y-4">
        {/* Service Alert Section */}
        <div id="service-alert">
          <ServiceAlert />
        </div>

        {/* Basic Info Section */}
        <div id="basic-info">
          <BasicInfo />
        </div>

        {/* Customer Profile Section */}
        <div id="customer-profile">
          <CustomerProfile onAIAnalysisClick={openScanModal} />
        </div>

        {/* Fund Business Section */}
        <div id="fund-business">
          <FundBusiness />
        </div>

        {/* Contact Summary Section */}
        <div id="contact-summary">
          <ContactSummary />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-4 pb-2 text-center"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-2" />
          <p className="text-muted-foreground text-xs">
            客户360全景视图系统 · 数据更新时间: 2026-03-31
          </p>
        </motion.footer>
      </main>

      {/* AI分析弹窗 */}
      <AnimatePresence>
        {showScanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{ width: '1000px', height: 'min(680px, 85vh)', maxHeight: '85vh' }}
            >
              {/* 弹窗头部 */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2" style={{ background: 'var(--gradient-primary)' }}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">AI智能客户分析</span>
                </div>
                <div className="flex items-center gap-2">
                  {scanCompleted && (
                    <span className="text-white/90 text-xs">
                      {countdown}秒后自动关闭
                    </span>
                  )}
                  <button
                    onClick={() => setShowScanModal(false)}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* iframe 内容 */}
              <div className="w-full h-full pt-9 overflow-auto">
                <iframe
                  ref={iframeRef}
                  src={`${import.meta.env.BASE_URL}robot-scan-light.html`}
                  className="w-full"
                  style={{ border: 'none', height: 'calc(100% - 48px)', minHeight: '600px' }}
                  onLoad={handleIframeLoad}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CustomerPanoramaPage;
