import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { UserDashboard } from './components/UserDashboard';
import { PlayerList } from './components/PlayerList';
import { TeamBalance } from './components/TeamBalance';
import { MatchFixtures } from './components/MatchFixtures';
import { AdminHub } from './components/AdminHub';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { PlayerInputModal } from './components/PlayerInputModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { AuthModal } from './components/AuthModal';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    selectedPlayer,
    setSelectedPlayer,
    isPlayerModalOpen,
    setIsPlayerModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    viewMode
  } = useApp();

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Outer wrapper: In 'phone' mode, renders a clean phone frame shell on larger screens; on mobile devices it naturally fits 100% width */}
      <div
        className={`w-full transition-all duration-300 flex flex-col min-h-screen ${
          viewMode === 'phone'
            ? 'max-w-md bg-[#0a0f1d] border-x border-slate-800/80 shadow-2xl relative'
            : 'max-w-4xl bg-[#0a0f1d] border-x border-slate-800/80 shadow-2xl relative'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* Tab Content */}
        <main className="flex-1 p-3.5 sm:p-4 overflow-y-auto">
          {activeTab === 'dashboard' && <UserDashboard />}
          {activeTab === 'roster' && <PlayerList />}
          {activeTab === 'balance' && <TeamBalance />}
          {activeTab === 'fixtures' && <MatchFixtures />}
          {activeTab === 'admin' && <AdminHub />}
        </main>

        {/* Bottom Mobile Tab Bar */}
        <BottomNav />

        {/* Modals */}
        {selectedPlayer && !isPlayerModalOpen && (
          <PlayerDetailModal
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}

        {isPlayerModalOpen && (
          <PlayerInputModal
            player={selectedPlayer}
            onClose={() => {
              setIsPlayerModalOpen(false);
              setSelectedPlayer(null);
            }}
          />
        )}

        {isAuthModalOpen && (
          <AuthModal
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}

        {isProfileModalOpen && (
          <ProfileEditModal
            onClose={() => setIsProfileModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
