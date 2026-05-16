import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Users, Calendar, X, CheckCircle2 } from 'lucide-react';

const dummyTimetable = [
  { id: 1, day: 'Mon', time: '09:00 AM - 10:30 AM', course: 'Intro to AI', room: 'CS-101' },
  { id: 2, day: 'Tue', time: '11:00 AM - 12:30 PM', course: 'Data Structures', room: 'CS-204' },
  { id: 3, day: 'Wed', time: '02:00 PM - 03:30 PM', course: 'Database Sys', room: 'CS-302' },
];

const availableCourses = [
  { id: 101, code: 'ECE-401', name: 'Digital Signal Processing', faculty: 'Dr. Smith', dept: 'Electronics', type: 'UG', time: 'Mon 11:00 AM', room: 'EC-201', seats: 45, booked: 40 },
  { id: 102, code: 'MECH-305', name: 'Thermodynamics', faculty: 'Prof. Johnson', dept: 'Mechanical', type: 'UG', time: 'Tue 09:00 AM', room: 'ME-105', seats: 60, booked: 15 },
  { id: 103, code: 'MGT-501', name: 'Organizational Behavior', faculty: 'Dr. Lee', dept: 'Management', type: 'PG', time: 'Wed 10:00 AM', room: 'BA-401', seats: 30, booked: 28 },
  { id: 104, code: 'CS-601', name: 'Advanced Machine Learning', faculty: 'Dr. Turing', dept: 'Computer Science', type: 'PG', time: 'Thu 02:00 PM', room: 'CS-505', seats: 25, booked: 10 },
];

const StudentDashboard = () => {
  const [filter, setFilter] = useState<'ALL' | 'UG' | 'PG'>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const filteredCourses = availableCourses.filter(c => filter === 'ALL' || c.type === filter);

  const handleBookSeat = () => {
    if (!selectedSeat) return;
    setShowConfirmation(true);
  };

  const closeModals = () => {
    setSelectedCourse(null);
    setSelectedSeat(null);
    setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      
      {/* LEFT SIDEBAR TIMETABLE */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4"
      >
        <div className="glass-panel p-5 sticky top-0">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="text-[#2563EB]" /> My Timetable
          </h2>
          <div className="space-y-3">
            {dummyTimetable.map(slot => (
              <div key={slot.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-[#2563EB] hover:bg-white shadow-sm transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-900">{slot.course}</span>
                  <span className="text-xs bg-[#0F172A] text-white px-2 py-0.5 rounded font-bold">{slot.day}</span>
                </div>
                <div className="text-sm text-slate-600 font-medium flex items-center gap-1 mt-2">
                  <Clock size={14} className="text-slate-400" /> {slot.time}
                </div>
                <div className="text-sm text-slate-600 font-medium flex items-center gap-1 mt-1">
                  <MapPin size={14} className="text-slate-400" /> {slot.room}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RIGHT MAIN CONTENT - COURSES */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Filters & Header */}
        <div className="glass-panel p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Cross-Department Courses</h2>
            <p className="text-sm text-slate-500 font-medium">Book classes outside your primary department</p>
          </div>
          
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['ALL', 'UG', 'PG'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${filter === f ? 'bg-[#2563EB] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={course.id}
                className="glass-panel p-5 hover-glow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-blue-50 border border-blue-200 text-[#2563EB] px-2 py-1 rounded">
                      {course.code} • {course.type}
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 shadow-sm rounded border border-slate-200">
                      {course.dept}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight mb-1">{course.name}</h3>
                  <p className="text-sm text-slate-500 font-bold mb-4">{course.faculty}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Clock size={16} className="text-slate-400" /> {course.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <MapPin size={16} className="text-slate-400" /> {course.room}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Users size={16} className="text-slate-400" /> 
                      <span className={course.booked >= course.seats ? 'text-red-500 font-bold' : ''}>
                        {course.booked} / {course.seats} Seats Booked
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedCourse(course)}
                  disabled={course.booked >= course.seats}
                  className="w-full py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#2563EB] text-white font-bold transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {course.booked >= course.seats ? 'Class Full' : 'Book Seat'}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* SEAT SELECTION MODAL */}
      <AnimatePresence>
        {selectedCourse && !showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-[#FFFFFF] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
              style={{ maxHeight: '90vh' }}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedCourse.name}</h3>
                  <p className="text-slate-500 font-bold text-sm">{selectedCourse.time} | {selectedCourse.room}</p>
                </div>
                <button onClick={closeModals} className="p-2 bg-slate-200/50 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Seat Selection Area */}
              <div className="p-8 overflow-y-auto flex-1 flex flex-col items-center bg-[#FFFFFF]">
                <div className="w-full max-w-md h-8 bg-gradient-to-b from-slate-100 to-transparent border-t-4 border-slate-300 rounded-t-[50%] mb-12 flex items-center justify-center text-slate-500 text-sm font-bold tracking-widest uppercase shadow-sm">
                  Classroom Board / Screen
                </div>

                {/* Generate Dummy 2D Seats */}
                <div className="grid grid-cols-6 gap-3 md:gap-4 mb-8">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const row = String.fromCharCode(65 + Math.floor(i / 6));
                    const num = (i % 6) + 1;
                    const seatId = `${row}${num}`;
                    const isBooked = [2, 5, 12, 14, 18, 22, 23, 28].includes(i);
                    const isSelected = selectedSeat === seatId;

                    return (
                      <button
                        key={seatId}
                        disabled={isBooked}
                        onClick={() => setSelectedSeat(seatId)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-t-lg rounded-b-sm font-bold text-xs flex items-center justify-center transition-all shadow-sm ${
                          isBooked 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-b-4 border-slate-300' 
                            : isSelected 
                              ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transform -translate-y-1 border-b-4 border-[#1E40AF]' 
                              : 'bg-slate-50 text-slate-800 hover:bg-[#3B82F6] hover:text-white hover:-translate-y-1 border-b-4 border-slate-200'
                        }`}
                      >
                        {seatId}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-6 text-sm font-bold text-slate-700">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-50 border border-slate-200 rounded-sm shadow-sm"></div> Available</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#2563EB] rounded-sm shadow-sm"></div> Selected</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-200 border border-slate-300 rounded-sm shadow-sm"></div> Booked</div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                <div className="text-slate-800">
                  {selectedSeat ? (
                    <p className="font-bold">Selected Seat: <span className="text-[#2563EB] text-xl ml-2">{selectedSeat}</span></p>
                  ) : (
                    <p className="text-slate-500 font-medium">Please select a seat</p>
                  )}
                </div>
                <button 
                  disabled={!selectedSeat}
                  onClick={handleBookSeat}
                  className="px-6 py-2.5 bg-[#0F172A] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-[#2563EB] shadow-lg transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirmation && selectedCourse && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-8 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-emerald-600" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Booking Confirmed!</h2>
              <p className="text-slate-600 font-medium mb-8">Your seat has been successfully reserved.</p>

              <div className="bg-slate-50 rounded-xl p-5 text-left space-y-3 mb-8 border border-slate-200">
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-slate-500 text-sm font-bold">Booking ID</span>
                  <span className="text-slate-800 font-mono font-bold">CRMS-{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-slate-500 text-sm font-bold">Course</span>
                  <span className="text-slate-900 font-extrabold">{selectedCourse.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-slate-500 text-sm font-bold">Time</span>
                  <span className="text-slate-800 font-bold">{selectedCourse.time}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-slate-500 text-sm font-bold">Classroom</span>
                  <span className="text-slate-800 font-bold">{selectedCourse.room}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 text-sm font-bold">Seat Number</span>
                  <span className="text-[#2563EB] font-extrabold text-lg">{selectedSeat}</span>
                </div>
              </div>

              <button 
                onClick={closeModals}
                className="w-full py-3 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-[#2563EB] transition-colors shadow-lg"
              >
                Back to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudentDashboard;
