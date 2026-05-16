import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ width: 250 }}
        animate={{ width: sidebarOpen ? 250 : 80 }}
        className="h-full bg-[#0F172A] shadow-xl flex flex-col z-20 m-2 mr-0 rounded-xl overflow-hidden"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen && <h1 className="font-extrabold text-xl tracking-wider text-white">CRMS</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {/* Dashboard Link */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#2563EB] text-white shadow-md cursor-pointer font-bold">
            <UserIcon size={20} />
            {sidebarOpen && <span className="capitalize">{role} Portal</span>}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-slate-800 text-slate-300 font-bold transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-2">
        
        {/* TOP NAVBAR */}
        <header className="h-16 glass-panel flex items-center justify-between px-6 z-20 mb-2">
          <h2 className="text-xl font-extrabold text-slate-800">Classroom Reservation System</h2>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#2563EB] rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 cursor-pointer p-1.5 px-3 rounded-full bg-white hover:bg-slate-50 shadow-sm border border-slate-200 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center font-bold text-white shadow-md">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-bold hidden md:block text-slate-800">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
        
      </div>
    </div>
  );
};

export default MainLayout;
