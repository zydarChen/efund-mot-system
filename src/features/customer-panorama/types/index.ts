// 类型定义文件

export interface CustomerBasicInfo {
  name: string;
  idType: string;
  idNumber: string;
  customerId: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  zipCode: string;
}

export interface BusinessInfo {
  customerType: string;
  riskLevel: string;
  investmentExp: string;
  openDate: string;
}

export interface SystemStatus {
  accountStatus: string;
  blacklistStatus: string;
  serviceLevel: string;
  lastLogin: string;
}

export interface FundHoldingSummary {
  type: string;
  percentage: number;
  amount: number;
  count: number;
  color: string;
}

export interface FundHoldingDetail {
  name: string;
  code: string;
  shares: number;
  amount: number;
  percentage: number;
  profit: number;
}

export interface TransactionRecord {
  month: string;
  action: string;
  target: string;
  detail: string;
  type: 'buy' | 'sell' | 'dividend' | 'adjust';
}

export interface ActivityRecord {
  id: string;
  type: string;
  name: string;
  date: string;
  location: string;
  manager: string;
  status: string;
}

export interface ComplaintRecord {
  id: string;
  date: string;
  summary: string;
  status: string;
  level: string;
}

export interface InheritanceRecord {
  id: number;
  fromName: string;
  fromId: string;
  toName: string;
  toId: string;
  relationship: string;
  fundCode: string;
  fundName: string;
  shares: number;
  applyDate: string;
  status: string;
  completeDate: string;
}

export interface TransferRecord {
  id: string;
  type: string;
  fromName: string;
  fromId: string;
  toName: string;
  toId: string;
  shares: number;
  fundCode: string;
  status: string;
  statusText: string;
  createDate: string;
}

export interface HotTopic {
  date: string;
  category: string;
  title: string;
  summary: string;
}

export interface SubscribedProduct {
  type: string;
  title: string;
  format: string;
}

export interface CustomerCharacteristic {
  label: string;
  category: string;
}

export interface RiskProfile {
  riskTolerance: string;
  returnExpectation: string;
  investmentHorizon: string;
  volatilityTolerance: string;
  scores: {
    riskTolerance: number;
    stability: number;
    longTerm: number;
  };
}

export interface PhoneRecord {
  id: number;
  time: string;
  type: string;
  content: string;
  result: string;
}

export interface SmsRecord {
  id: number;
  time: string;
  type: string;
  content: string;
  status: string;
}

export interface EmailRecord {
  id: number;
  time: string;
  subject: string;
  type: string;
  status: string;
}

export interface SubscriptionRecord {
  id: number;
  service: string;
  code: string;
  status: string;
  openDate: string;
}
