import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, UserMinus, UploadCloud, BellRing, 
  BarChart2, Edit3, Trash2, Plus, FileText, CheckCircle, X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const dummyWorkload = [
  { name: 'Dr. Smith', hours: 14 },
  { name: 'Prof. Johnson', hours: 18 },
  { name: 'Dr. Lee', hours: 12 },
  { name: 'Dr. Turing', hours: 16 },
];

const facultyLeaves = [
  { id: 1, name: 'Dr. Smith', date: 'Today', reason: 'Medical Emergency', status: 'pending' }
];

const timetableData = [
  { id: 1, day: 'Monday', time: '10:00 AM', course: 'Digital Electronics', faculty: 'Prof. Johnson', room: 'EC-201' },
  { id: 2, day: 'Tuesday', time: '11:30 AM', course: 'Signals & Systems', faculty: 'Dr. Lee', room: 'EC-305' },
  { id: 3, day: 'Wednesday', time: '02:00 PM', course: 'Microprocessors', faculty: 'Dr. Smith', room: 'EC-101' },
];

const HodDashboard = () => {
  const [showReallocateModal, setShowReallocateModal] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const handleUpload = () => {
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      
      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Department Attendance", val: "88%", icon: BarChart2 },
          { title: "Cross-Dept Students", val: "142", icon: UserMinus },
          { title: "Faculty on Leave", val: "1", icon: BellRing, alert: true },
          { title: "Total Courses", val: "16", icon: FileText },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-panel p-5 flex items-center gap-4 hover-glow relative"
          >
            {stat.alert && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
            )}
            <div className={`p-3 rounded-lg shadow-sm border ${stat.alert ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-[#2563EB] border-blue-100'}`}>
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
        
        {/* LEFT COLUMN: TIMETABLE & REALLOCATION */}
        <div className="flex-1 space-y-6">
          
          {/* FACULTY REALLOCATION ALERT */}
          <AnimatePresence>
            {facultyLeaves.map(leave => (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                key={leave.id}
                className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-full">
                    <UserMinus size={24} />
                  </div>
                  <div>
                    <h3 className="text-red-800 font-bold">Action Required: Faculty Leave</h3>
                    <p className="text-red-600 text-sm font-medium">{leave.name} is on leave {leave.date} ({leave.reason})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReallocateModal(true)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                  Reallocate Classes
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* TIMETABLE EDITOR */}
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <CalendarDays className="text-[#2563EB]" /> Timetable Editor
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] hover:bg-[#2563EB] text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                <Plus size={16} /> Add Slot
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-slate-500 text-sm font-extrabold">
                    <th className="pb-3 pl-2">Day & Time</th>
                    <th className="pb-3">Course</th>
                    <th className="pb-3">Faculty</th>
                    <th className="pb-3">Room</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timetableData.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pl-2">
                        <div className="font-bold text-slate-900">{row.day}</div>
                        <div className="text-xs font-bold text-[#2563EB]">{row.time}</div>
                      </td>
                      <td className="py-4 font-bold text-slate-900">{row.course}</td>
                      <td className="py-4 text-slate-600 font-medium">{row.faculty}</td>
                      <td className="py-4 text-slate-600 font-medium">{row.room}</td>
                      <td className="py-4 text-right pr-2">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 bg-white text-slate-600 rounded shadow-sm hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-1.5 bg-white text-red-600 rounded shadow-sm hover:bg-red-50 hover:text-red-700 transition-colors border border-red-200">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SYLLABUS & ANALYTICS */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* SYLLABUS UPLOAD */}
          <div className="glass-panel p-6 text-center">
            <h2 className="text-xl font-extrabold text-slate-900 mb-4 text-left">Syllabus Management</h2>
            <div className="border-2 border-dashed border-[#2563EB]/30 bg-blue-50/30 rounded-xl p-8 hover:bg-blue-50 hover:border-[#2563EB] transition-all cursor-pointer flex flex-col items-center justify-center">
              <UploadCloud size={40} className="text-[#2563EB] mb-3" />
              <p className="text-slate-900 font-bold">Drag & Drop PDF Syllabus</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Maximum file size 10MB</p>
              <button onClick={handleUpload} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-lg transition-colors shadow-sm">
                Browse Files
              </button>
            </div>
            
            <AnimatePresence>
              {showUploadSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 bg-emerald-100 text-emerald-800 text-sm font-bold rounded-lg border border-emerald-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Syllabus Uploaded Successfully
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FACULTY WORKLOAD CHART */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">Faculty Workload (Hrs/Week)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyWorkload}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }}
                    dx={-10}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(15,23,42,0.03)' }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(15,23,42,0.1)', borderRadius: '8px', fontWeight: 'bold', color: '#0F172A' }}
                  />
                  <Bar dataKey="hours" fill="#0F172A" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>

      {/* REALLOCATE MODAL */}
      <AnimatePresence>
        {showReallocateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-extrabold text-slate-900">Reallocate Faculty</h3>
                <button onClick={() => setShowReallocateModal(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 font-bold mb-2">Select a replacement faculty for <span className="text-[#2563EB]">Dr. Smith's</span> classes today.</p>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Available Faculty</label>
                  <select className="w-full p-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    <option>Select Faculty...</option>
                    <option>Dr. Turing (2 hrs available)</option>
                    <option>Prof. Johnson (1 hr available)</option>
                  </select>
                </div>
                
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-bold text-slate-900">Notify Students?</label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#2563EB] bg-white border-slate-300 rounded focus:ring-[#2563EB]" />
                    <span className="text-sm font-bold text-slate-600">Send automated timetable update notification</span>
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setShowReallocateModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={() => setShowReallocateModal(false)} className="px-6 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg shadow-md transition-colors">
                  Save & Notify
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HodDashboard;
