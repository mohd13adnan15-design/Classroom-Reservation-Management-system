import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, BookOpen, Info, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      demoLogin(email);
      navigate('/');
      setLoading(false);
    }, 800); 
  };

  const autofillDemo = (role: string) => {
    setEmail(`${role}@university.edu`);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#F8FAFC]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-6xl glass-panel overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-2xl border-none"
        style={{ minHeight: '600px' }}
      >
        {/* LEFT SIDE - BRANDING / ANIMATION */}
        <div className="w-full md:w-1/2 p-10 bg-[#0F172A] relative flex flex-col justify-between overflow-hidden text-white">
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-[#2563EB] rounded-full mix-blend-overlay filter blur-[100px] opacity-30"
          />
          <div className="relative z-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-16"
            >
              <div className="p-3 bg-[#2563EB] text-white rounded-xl shadow-lg">
                <BookOpen size={32} />
              </div>
              <h1 className="text-2xl font-bold tracking-wider">CRMS Platform</h1>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white">
                Cross-Department <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100">Learning Hub</span>
              </h2>
              <p className="text-slate-300 text-lg max-w-md font-medium">
                Empowering students to break departmental boundaries and reserve classes across the entire campus seamlessly.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 mt-12 flex flex-col gap-2">
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10 text-sm font-medium">
              <Info size={18} className="text-blue-400" />
              <p className="text-slate-200">Demo Mode: Click a button below to autofill and view different portals!</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => autofillDemo('student')} type="button" className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded font-bold text-xs hover:bg-slate-700 transition-colors shadow-sm">Student Demo</button>
              <button onClick={() => autofillDemo('faculty')} type="button" className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded font-bold text-xs hover:bg-slate-700 transition-colors shadow-sm">Faculty Demo</button>
              <button onClick={() => autofillDemo('hod')} type="button" className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded font-bold text-xs hover:bg-slate-700 transition-colors shadow-sm">HOD Demo</button>
              <button onClick={() => autofillDemo('admin')} type="button" className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded font-bold text-xs hover:bg-slate-700 transition-colors shadow-sm">Admin Demo</button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative bg-[#FFFFFF]">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h3>
            <p className="text-slate-500 font-medium mb-8">Please enter your university credentials to access your portal.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 pl-1">University Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all font-medium"
                    placeholder="student@university.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 pl-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#2563EB] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 bg-white text-[#2563EB] focus:ring-[#2563EB]" />
                  <span className="text-slate-600 hover:text-slate-900 font-bold transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors font-bold">Forgot password?</a>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !email || !password}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    Sign In <LogIn size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
