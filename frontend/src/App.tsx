import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { BlockPlanningPage } from './pages/BlockPlanningPage';
import { ConflictCenterPage } from './pages/ConflictCenterPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SimulationPage } from './pages/SimulationPage';
import { LiveOperationsPage } from './pages/LiveOperationsPage';
import { DemoProvider } from './context/DemoContext';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DemoProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="block-planning" element={<BlockPlanningPage />} />
            <Route path="conflict-center" element={<ConflictCenterPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="simulation" element={<SimulationPage />} />
            <Route path="live-operations" element={<LiveOperationsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </DemoProvider>
    </BrowserRouter>
  );
};

export default App;
