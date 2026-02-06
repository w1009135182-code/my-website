
import React, { useState, useMemo } from 'react';
import { Filter, Star, Plus, ExternalLink, TrendingUp } from 'lucide-react';
import { MOCK_CREATORS } from '../constants';
import { Creator } from '../types';

interface Props {
  onViewAnalysis?: (recordId: string) => void;
}

const ITEMS_PER_PAGE = 4;
type Tab = 'comprehensive' | 'rising' | 'sales';

const HotCreators: React.FC<Props> = ({ onViewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<Tab>('comprehensive');
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSalesOnly, setShowSalesOnly] = useState(false);

  // In a real app, this data would be fetched based on the active tab and filters
  const allCreators = MOCK_CREATORS.filter(c => c.source === 'HOT_CREATORS' || c.id === 'c1' || c.id === 'c4');

  const paginatedCreators = useMemo(() => {
    return allCreators.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [currentPage, allCreators]);

  const totalPages = Math.ceil(allCreators.length / ITEMS_PER_PAGE);

  const toggleAll = () => {
    if (selectedCreatorIds.length === paginatedCreators.length) {
      setSelectedCreatorIds([]);
    } else {
      setSelectedCreatorIds(paginatedCreators.map(c => c.id));
    }
  };

  const toggleCreator = (id: string) => {
    setSelectedCreatorIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header and Tabs */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">热门达人榜单</h1>
          <div className="flex items-center bg-gray-200/80 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('comprehensive')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activeTab === 'comprehensive' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              综合热度
            </button>
            <button
              onClick={() => setActiveTab('rising')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activeTab === 'rising' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              飙升黑马
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activeTab === 'sales' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              带货榜
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <Filter size={16} />
              筛选:
            </div>
            <select className="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
              <option>全部垂类</option>
              <option>美妆护肤</option>
              <option>3C数码</option>
            </select>
            <select className="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
              <option>近7天数据</option>
              <option>近30天数据</option>
            </select>
            <select className="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
              <option>粉丝数不限</option>
              <option>&lt; 10万</option>
              <option>10万 - 100万</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sales-toggle" className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="sales-toggle" className="sr-only peer" checked={showSalesOnly} onChange={() => setShowSalesOnly(!showSalesOnly)} />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-800"></div>
            </label>
            <span className="text-sm text-gray-600">仅显示有带货记录</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-12"><input type="checkbox" className="rounded text-blue-600" onChange={toggleAll} checked={selectedCreatorIds.length === paginatedCreators.length && paginatedCreators.length > 0}/></th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">达人信息</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">垂类标签</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">粉丝数</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">互动率</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCreators.map((creator) => (
                <tr key={creator.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3"><input type="checkbox" className="rounded text-blue-600" checked={selectedCreatorIds.includes(creator.id)} onChange={() => toggleCreator(creator.id)}/></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={creator.avatar} className="w-11 h-11 rounded-full" alt={creator.nickname} />
                      <div>
                        <div className="font-bold text-gray-800">{creator.nickname}</div>
                        <div className="text-xs text-gray-500 mb-1">{creator.region}</div>
                        <a href="#" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          View TikTok Profile <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {creator.tags.map(t => <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">{t}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-gray-800">{(creator.followers / 1000).toFixed(1)}K</div>
                    {creator.followerGrowth && (
                       <div className="text-xs text-green-600 flex items-center gap-0.5 mt-1">
                         <TrendingUp size={12} /> +{creator.followerGrowth}%
                       </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{creator.engagementRate}%</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-gray-400 hover:text-yellow-500 transition-colors" title="收藏">
                        <Star size={20} />
                      </button>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors" title="加入达人池">
                        <Plus size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
                显示 {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, allCreators.length)} 共 {allCreators.length} 条
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    上一页
                </button>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    下一页
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HotCreators;
