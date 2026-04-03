import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdvancedSearchDialog } from './AdvancedSearchDialog';

interface SearchField {
  id: string;
  label: string;
  placeholder: string;
  hasIndex: boolean;
}

const searchFields: SearchField[] = [
  { id: 'common', label: '常用查询', placeholder: '可输入基金账号、身份证号码、客户姓名和手机号码', hasIndex: true },
  { id: 'customerId', label: '客户编号', placeholder: '请输入客户编号', hasIndex: true },
  { id: 'fundAccount', label: '基金账号', placeholder: '请输入基金账号', hasIndex: false },
  { id: 'idCard', label: '有效证件(个人)', placeholder: '请输入身份证号码', hasIndex: false },
  { id: 'name', label: '客户姓名', placeholder: '请输入客户姓名', hasIndex: false },
  { id: 'phone', label: '手机', placeholder: '请输入手机号码', hasIndex: false },
  { id: 'email', label: '邮件地址', placeholder: '请输入邮箱地址', hasIndex: false },
  { id: 'orgId', label: '有效证件(机构)', placeholder: '请输入机构证件号码', hasIndex: false },
  { id: 'productId', label: '有效证件(产品)', placeholder: '请输入产品证件号码', hasIndex: false },
  { id: 'tradeAccount', label: '交易账号', placeholder: '请输入交易账号', hasIndex: false },
  { id: 'telephone', label: '电话', placeholder: '请输入电话号码', hasIndex: false },
  { id: 'memberCard', label: '会员卡号', placeholder: '请输入会员卡号', hasIndex: false },
];

export function SearchBar() {
  const [selectedField, setSelectedField] = useState<SearchField>(searchFields[0]);
  const [searchValue, setSearchValue] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleFieldChange = (field: SearchField) => {
    setSelectedField(field);
    setSearchValue('');
    setShowWarning(!field.hasIndex);
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    console.log('搜索:', selectedField.label, searchValue);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-[hsl(207,85%,42%)] to-[hsl(191,78%,55%)] px-4 py-3"
      >
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          {/* Search Label */}
          <div className="flex items-center gap-2 text-white flex-shrink-0">
            <Search className="w-5 h-5" />
            <span className="font-medium text-sm">客户查询</span>
          </div>

          {/* Search Controls */}
          <div className="flex-1 flex items-center gap-2">
            {/* Field Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 px-3 bg-white/10 hover:bg-white/20 text-white border-0 text-sm min-w-[110px] justify-between"
                >
                  <span>{selectedField.label}</span>
                  <ChevronDown className="w-4 h-4 ml-2 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {searchFields.map((field) => (
                  <DropdownMenuItem
                    key={field.id}
                    onClick={() => handleFieldChange(field)}
                    className={`text-sm cursor-pointer ${
                      selectedField.id === field.id ? 'bg-primary/5 text-primary' : ''
                    }`}
                  >
                    {field.label}
                    {!field.hasIndex && (
                      <span className="ml-auto text-amber-500 text-xs">*</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Input */}
            <div className="flex-1 relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={selectedField.placeholder}
                className="h-9 pl-10 pr-4 bg-white border-0 text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/50"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="h-9 px-5 bg-white hover:bg-gray-100 text-primary text-sm font-medium"
            >
              客户搜索
            </Button>

            {/* Advanced Search Button */}
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(true)}
              className="h-9 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-sm font-medium"
            >
              高级搜索
            </Button>
          </div>
        </div>

        {/* Warning Banner */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-6xl mx-auto mt-2"
            >
              <div className="flex items-center gap-2 bg-amber-400/90 rounded px-3 py-1.5">
                <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-white text-xs">
                  提示：该字段不支持索引查询，可能导致查询速度较慢
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Advanced Search Dialog */}
      <AdvancedSearchDialog open={showAdvanced} onOpenChange={setShowAdvanced} />
    </>
  );
}
