import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, Download, ArrowUpRight, 
  Activity, BookMarked 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

const pieData = [
  { name: 'Own Dept Attendance', value: 70 },
  { name: 'Cross Dept Movement', value: 30 },
];
const COLORS = ['#0F172A', '#2563EB'];

const attendanceData = [
  { name: 'Mon', attendance: 82 },
  { name: 'Tue', attendance: 86 },
  { name: 'Wed', attendance: 89 },
  { name: 'Thu', attendance: 84 },
  { name: 'Fri', attendance: 92 },
];

const departments = [
  { id: 'CS', name: 'Computer Science', head: 'Dr. Turing', activeStudents: 1200, crossRegistrations: 350 },
  { id: 'EC', name: 'Electronics', head: 'Dr. Smith', activeStudents: 950, crossRegistrations: 210 },
  { id: 'ME', name: 'Mechanical', head: 'Prof. Johnson', activeStudents: 800, crossRegistrations: 120 },
  { id: 'MG', name: 'Management', head: 'Dr. Lee', activeStudents: 600, crossRegistrations: 480 },
];

const AdminDashboard = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      
      {/* HEADER STATS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">University Overview</h1>
          <p className="text-sm font-bold text-slate-500">Platform-wide analytics and department management</p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-lg transition-all shadow-md disabled:opacity-70"
        >
          {downloading ? (
            <><Activity className="animate-spin" size={18} /> Generating PDF...</>
          ) : (
            <><Download size={18} /> Download Master Report</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Students", val: "5,420", icon: Users, trend: "+12%" },
          { title: "Active Departments", val: "14", icon: Building2, trend: "0%" },
          { title: "Total Bookings", val: "12,845", icon: BookMarked, trend: "+24%" },
          { title: "Platform Health", val: "99.9%", icon: Activity, trend: "Optimal" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-panel p-5 flex items-center justify-between gap-4 hover-glow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-[#2563EB] rounded-lg shadow-sm border border-blue-100">
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{stat.val}</h3>
              </div>
            </div>
            <div className={`text-xs font-bold ${stat.trend.includes('+') || stat.trend === 'Optimal' ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-100'} px-2 py-1 rounded flex items-center gap-1`}>
              {stat.trend.includes('+') && <ArrowUpRight size={12} />}
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: CHARTS */}
        <div className="w-full lg:w-2/3 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CIRCULAR GRAPH (PIE) */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Cross-Dept Movement</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(15,23,42,0.1)', borderRadius: '8px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#0F172A' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AREA CHART */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Weekly Attendance Trend</h2>
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15,23,42,0.05)" />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(15,23,42,0.1)', borderRadius: '8px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="attendance" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: DEPARTMENT LIST */}
        <div className="w-full lg:w-1/3">
          <div className="glass-panel p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">Departments</h2>
              <button className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">View All</button>
            </div>
            
            <div className="space-y-4">
              {departments.map((dept, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={dept.id} 
                  className="p-4 bg-white rounded-xl border border-slate-100 hover:border-[#2563EB]/40 transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900">{dept.name}</h3>
                      <p className="text-xs font-bold text-[#2563EB]">HOD: {dept.head}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
                      {dept.id}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Students</p>
                      <p className="font-extrabold text-slate-900">{dept.activeStudents}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cross-Reg</p>
                      <p className="font-extrabold text-[#2563EB]">{dept.crossRegistrations}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
