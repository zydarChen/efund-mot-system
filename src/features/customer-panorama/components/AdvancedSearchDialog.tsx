import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchFormData {
  phone: string;
  telephone: string;
  name: string;
  idNumber: string;
}

interface Customer {
  customerId: string;
  name: string;
  idType: string;
  phone: string;
  idNumber: string;
  fax: string;
  gender: string;
  telephone: string;
  age: string;
  email: string;
  customerType: string;
  customerTypeOriginal: string;
  province: string;
  city: string;
  openDate: string;
  zipCode: string;
  wechatLogin: string;
  phoneLogin: string;
  customerLevel: string;
  address: string;
  remark: string;
}

// 模拟客户数据
const mockCustomers: Customer[] = [
  {
    customerId: 'KH0088',
    name: '张建国',
    idType: '居民身份证',
    phone: '13001466630',
    idNumber: '1101011980****1234',
    fax: '-',
    gender: '男',
    telephone: '-',
    age: '46',
    email: 'zhangjg@email.com',
    customerType: '个人客户',
    customerTypeOriginal: '个人',
    province: '北京市',
    city: '北京市',
    openDate: '2020-03-15',
    zipCode: '100020',
    wechatLogin: '已绑定',
    phoneLogin: '已绑定',
    customerLevel: 'VIP',
    address: '北京市朝阳区XX街道XX小区',
    remark: '稳健型投资者',
  },
  {
    customerId: 'KH0089',
    name: '李淑芬',
    idType: '居民身份证',
    phone: '13800138000',
    idNumber: '1101011958****4521',
    fax: '-',
    gender: '女',
    telephone: '010-12345678',
    age: '68',
    email: 'lishufen@email.com',
    customerType: '个人客户',
    customerTypeOriginal: '个人',
    province: '北京市',
    city: '北京市',
    openDate: '2019-06-20',
    zipCode: '100010',
    wechatLogin: '未绑定',
    phoneLogin: '已绑定',
    customerLevel: '普通',
    address: '北京市海淀区XX街道XX小区',
    remark: '-',
  },
  {
    customerId: 'KH0090',
    name: '刘长明',
    idType: '居民身份证',
    phone: '13900139000',
    idNumber: '2101021952****3456',
    fax: '-',
    gender: '男',
    telephone: '-',
    age: '74',
    email: '-',
    customerType: '个人客户',
    customerTypeOriginal: '个人',
    province: '辽宁省',
    city: '沈阳市',
    openDate: '2018-01-10',
    zipCode: '110000',
    wechatLogin: '未绑定',
    phoneLogin: '未绑定',
    customerLevel: '普通',
    address: '辽宁省沈阳市XX区XX街道',
    remark: '-',
  },
];

const tableColumns = [
  { key: 'customerId', label: '客户编号', width: '90px' },
  { key: 'name', label: '客户姓名', width: '80px' },
  { key: 'idType', label: '证件类型', width: '100px' },
  { key: 'phone', label: '手机', width: '110px' },
  { key: 'idNumber', label: '证件号码', width: '140px' },
  { key: 'fax', label: '传真', width: '70px' },
  { key: 'gender', label: '性别', width: '50px' },
  { key: 'telephone', label: '联系电话', width: '100px' },
  { key: 'age', label: '年龄', width: '50px' },
  { key: 'email', label: '邮箱', width: '140px' },
  { key: 'customerType', label: '客户类型', width: '80px' },
  { key: 'customerTypeOriginal', label: '客户类型原值', width: '90px' },
  { key: 'province', label: '省份名称', width: '80px' },
  { key: 'city', label: '城市名称', width: '80px' },
  { key: 'openDate', label: '开户日期（首次）', width: '110px' },
  { key: 'zipCode', label: '邮编', width: '70px' },
  { key: 'wechatLogin', label: '微信登录', width: '70px' },
  { key: 'phoneLogin', label: '手机登录', width: '70px' },
  { key: 'customerLevel', label: '客户等级', width: '70px' },
  { key: 'address', label: '详细地址', width: '180px' },
  { key: 'remark', label: '备注', width: '100px' },
];

export function AdvancedSearchDialog({ open, onOpenChange }: AdvancedSearchDialogProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    phone: '',
    telephone: '',
    name: '',
    idNumber: '',
  });
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // 模拟搜索逻辑
    const results = mockCustomers.filter(customer => {
      const matchPhone = !formData.phone || customer.phone.includes(formData.phone);
      const matchTelephone = !formData.telephone || customer.telephone.includes(formData.telephone);
      const matchName = !formData.name || customer.name.includes(formData.name);
      const matchIdNumber = !formData.idNumber || customer.idNumber.includes(formData.idNumber);
      return matchPhone && matchTelephone && matchName && matchIdNumber;
    });
    setSearchResults(results);
    setHasSearched(true);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const handleReset = () => {
    setFormData({
      phone: '',
      telephone: '',
      name: '',
      idNumber: '',
    });
    setSearchResults([]);
    setHasSearched(false);
    setSelectedRows([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(searchResults.map(c => c.customerId));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, customerId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== customerId));
    }
  };

  const totalPages = Math.ceil(searchResults.length / pageSize);
  const startRecord = searchResults.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(currentPage * pageSize, searchResults.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1400px] h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-4 py-3 border-b border-gray-200">
          <DialogTitle className="text-gray-800 text-base font-semibold">客户列表</DialogTitle>
        </DialogHeader>

        {/* Search Form */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-xs">手机号码：</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="h-8 text-sm bg-white border-gray-300"
                placeholder="请输入手机号码"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-xs">电话：</Label>
              <Input
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                className="h-8 text-sm bg-white border-gray-300"
                placeholder="请输入电话号码"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-xs">客户姓名：</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="h-8 text-sm bg-white border-gray-300"
                placeholder="请输入客户姓名"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-xs">证件号码：</Label>
              <Input
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className="h-8 text-sm bg-white border-gray-300"
                placeholder="请输入证件号码"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <Button
              onClick={handleSearch}
              className="h-8 px-4 bg-primary hover:bg-primary/90 text-white text-sm"
            >
              <Search className="w-4 h-4 mr-1.5" />
              查询
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-8 px-4 border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              重置
            </Button>
          </div>
        </div>

        {/* Export Button */}
        <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <Button
            variant="ghost"
            className="h-7 text-primary hover:text-primary hover:bg-primary/5 text-sm"
          >
            <span className="mr-1">↓</span>
            列表导出
          </Button>
          {hasSearched && (
            <span className="text-gray-500 text-xs">
              共找到 <span className="text-primary font-medium">{searchResults.length}</span> 条记录
            </span>
          )}
        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="min-w-max">
              {/* Table Header */}
              <div className="sticky top-0 bg-gray-50 border-b border-gray-200 flex">
                <div className="w-10 px-2 py-2 border-r border-gray-200 flex items-center justify-center">
                  <Checkbox
                    checked={selectedRows.length === searchResults.length && searchResults.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                {tableColumns.map((col) => (
                  <div
                    key={col.key}
                    className="px-3 py-2 border-r border-gray-200 text-gray-600 text-xs font-medium whitespace-nowrap"
                    style={{ width: col.width, minWidth: col.width }}
                  >
                    {col.label}
                  </div>
                ))}
              </div>

              {/* Table Body */}
              {hasSearched ? (
                searchResults.length > 0 ? (
                  searchResults.map((customer, index) => (
                    <motion.div
                      key={customer.customerId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex border-b border-gray-100 hover:bg-primary/5"
                    >
                      <div className="w-10 px-2 py-2 border-r border-gray-100 flex items-center justify-center">
                        <Checkbox
                          checked={selectedRows.includes(customer.customerId)}
                          onCheckedChange={(checked) => handleSelectRow(customer.customerId, checked as boolean)}
                        />
                      </div>
                      {tableColumns.map((col) => (
                        <div
                          key={col.key}
                          className="px-3 py-2 border-r border-gray-100 text-gray-700 text-xs whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ width: col.width, minWidth: col.width }}
                          title={customer[col.key as keyof Customer]}
                        >
                          {customer[col.key as keyof Customer]}
                        </div>
                      ))}
                    </motion.div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                    暂无匹配数据
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                  请输入查询条件后点击"查询"按钮
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Pagination */}
        {hasSearched && searchResults.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="h-7 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-gray-500 text-xs">条/页</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Input
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                className="h-7 w-12 text-center text-xs"
              />
              <span className="text-gray-500 text-xs">/ {totalPages}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>

            <span className="text-gray-500 text-xs">
              显示 {startRecord} 到 {endRecord} 共 {searchResults.length} 条记录
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
