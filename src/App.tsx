import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Cases } from './pages/Cases';
import { CaseWorkspace } from './pages/CaseWorkspace';
import { Insights } from './pages/Insights';
import { Knowledge } from './pages/Knowledge';
import { Copilot } from './pages/Copilot';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/copilot" replace />} />
            <Route path="dashboard" element={<Home />} />
            <Route path="cases" element={<Cases />} />
            <Route path="cases/:caseId" element={<CaseWorkspace />} />
            <Route path="insights" element={<Insights />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="copilot" element={<Copilot />} />
            <Route path="*" element={<Navigate to="/copilot" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
