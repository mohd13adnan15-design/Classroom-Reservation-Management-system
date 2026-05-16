import { motion } from 'framer-motion';
import { Users, Clock, CalendarCheck, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const dummyClasses = [
  { id: 1, name: 'Digital Signal Processing', time: '11:00 AM - 12:30 PM', room: 'EC-201', totalStudents: 45, outsideDept: 12 },
  { id: 2, name: 'Advanced AI', time: '02:00 PM - 03:30 PM', room: 'CS-401', totalStudents: 60, outsideDept: 25 },
];

const availableRooms = [
  { id: 'CS-101', capacity: 60, status: 'available' },
  { id: 'CS-102', capacity: 40, status: 'occupied' },
  { id: 'EC-201', capacity: 50, status: 'available' },
];

const pieData = [
  { name: 'Own Dept', value: 33 },
  { name: 'Cross Dept', value: 12 },
];
const COLORS = ['#0F172A', '#2563EB'];

const FacultyDashboard = () => {
  return (
    <div className="flex flex-col gap-6 pb-10">
      
      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Today's Classes", val: "2", icon: Clock },
          { title: "Total Students", val: "105", icon: Users },
          { title: "Cross-Dept Students", val: "37", icon: CalendarCheck },
          { title: "Avg Attendance", val: "92%", icon: BarChart3 },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-panel p-5 flex items-center gap-4 hover-glow"
          >
            <div className="p-3 bg-blue-50 text-[#2563EB] rounded-lg shadow-sm border border-blue-100">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold">{stat.title}</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{stat.val}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* MAIN COLUMN */}
        <div className="flex-1 space-y-6">
          
          {/* TIMETABLE & CLASS MANAGEMENT */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {dummyClasses.map((cls, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-[#2563EB] transition-colors">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">{cls.name}</h3>
                    <div className="flex gap-4 text-sm font-bold text-[#2563EB] mt-1">
                      <span>🕒 {cls.time}</span>
                      <span>📍 {cls.room}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-[#0F172A] hover:bg-[#2563EB] text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                      View Students
                    </button>
                    <button className="px-4 py-2 bg-white border-2 border-[#2563EB] text-[#2563EB] hover:bg-slate-50 hover:text-[#1D4ED8] text-sm font-bold rounded-lg transition-colors shadow-sm">
                      Reallocate Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROOM AVAILABILITY */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">Room Availability System</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {availableRooms.map((room) => (
                <div key={room.id} className={`p-4 rounded-xl border shadow-sm ${room.status === 'available' ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                  <h4 className="font-extrabold text-slate-900">{room.id}</h4>
                  <p className="text-sm font-bold text-slate-500">Cap: {room.capacity}</p>
                  <span className={`text-xs mt-2 inline-block px-2 py-1 rounded font-bold ${room.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {room.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDE COLUMN */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* CLASS ANALYTICS */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">Class Demographics</h2>
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
            <div className="mt-4 text-center text-sm font-bold text-slate-600">
              Cross-department participation is up <span className="text-emerald-600 font-extrabold">14%</span> this week.
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
