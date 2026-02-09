import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SmartMatchingHistory from './pages/SmartMatchingHistory';
import NewAnalysis from './pages/NewAnalysis';
import AnalysisResult from './pages/AnalysisResult';
import HotCreators from './pages/HotCreators';
import Favorites from './pages/Favorites';
import { Page, SubPage, AnalysisRecord } from './types';
import { MOCK_HISTORY } from './constants';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('SMART_MATCHING');
  const [subPage, setSubPage] = useState<SubPage>('HISTORY');
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);

  const handleNavigate = (page: Page) => {
    setActivePage(page);
    // Reset subpage when main nav changes
    if (page === 'SMART_MATCHING') {
      setSubPage('HISTORY');
    }
  };

  const handleNewAnalysis = () => {
    setSubPage('NEW_ANALYSIS');
  };

  const handleExecuteAnalysis = () => {
    // In a real app, this would create a record and navigate
    // For prototype, we simulate jumping to a "new" result by using an existing record
    setSelectedRecord(MOCK_HISTORY[0]); 
    setSubPage('ANALYSIS_RESULT');
  };

  const handleViewResult = (record: AnalysisRecord) => {
    setSelectedRecord(record);
    setSubPage('ANALYSIS_RESULT');
  };

  const handleBackToHistory = () => {
    setSubPage('HISTORY');
    setSelectedRecord(null);
  };

  // Callback to switch to Smart Matching History from other pages
  const handleViewBatchAnalysis = () => {
    setActivePage('SMART_MATCHING');
    setSubPage('HISTORY');
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      
      <main className="ml-64 flex-1 h-screen overflow-auto">
        {activePage === 'SMART_MATCHING' && (
          <>
            {subPage === 'HISTORY' && (
              <SmartMatchingHistory 
                history={MOCK_HISTORY} 
                onNewAnalysis={handleNewAnalysis}
                onViewResult={handleViewResult}
              />
            )}
            {subPage === 'NEW_ANALYSIS' && (
              <NewAnalysis 
                onExecute={handleExecuteAnalysis} 
                onBack={handleBackToHistory}
              />
            )}
            {subPage === 'ANALYSIS_RESULT' && selectedRecord && (
              <AnalysisResult 
                record={selectedRecord} 
                onBack={handleBackToHistory} 
              />
            )}
          </>
        )}

        {activePage === 'HOT_CREATORS' && (
          <HotCreators onViewAnalysis={handleViewBatchAnalysis} />
        )}
        
        {activePage === 'FAVORITES' && (
           <Favorites onViewAnalysis={handleViewBatchAnalysis} />
        )}
      </main>
    </div>
  );
};

export default App;