import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, Receipt, Shield, Star, Wallet, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LiquidBackground from './LiquidBackground';
import { isFirebaseReady } from '../lib/firebase';

export default function LandingPage() {
  const { user, signInWithGoogle, signInAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    signInAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[100dvh] bg-transparent text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      <LiquidBackground />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white font-bold text-xl tracking-tighter">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Expensify</span>
          </div>
          {user ? (
            <Link 
              to="/dashboard"
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-colors active:scale-[0.98] text-sm"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGuestLogin}
                className="hidden sm:block px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium rounded-full transition-colors active:scale-[0.98] text-sm"
              >
                Guest Access
              </button>
              {isFirebaseReady && (
                <button 
                  onClick={signInWithGoogle}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-colors active:scale-[0.98] text-sm"
                >
                  Log in
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-6 relative">
        
        <div className="max-w-4xl mx-auto text-center mt-12 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-balance">
              Manage your spending <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                with total clarity.
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed text-balance"
          >
            Expensify brings expenses, refunds, income, and account sync into one focused workspace for day-to-day money tracking.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link 
                to="/dashboard"
                className="group flex items-center justify-center gap-2 h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full w-full sm:w-auto transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                {isFirebaseReady && (
                  <button 
                    onClick={signInWithGoogle}
                    className="group flex items-center justify-center gap-2 h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full w-full sm:w-auto transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                  >
                    Get Started for Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                <button 
                  onClick={handleGuestLogin}
                  className="group flex items-center justify-center gap-2 h-14 px-8 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-semibold rounded-full w-full sm:w-auto transition-all shadow-sm"
                >
                  Continue as Guest
                </button>
              </>
            )}
            <p className="text-sm text-gray-400 sm:hidden mt-2">No credit card required</p>
          </motion.div>
        </div>

        {/* Product Capabilities Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-5xl mx-auto mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 py-10 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/40 shadow-[0_8px_40px_rgb(0,0,0,0.04)]"
        >
          <div className="text-center">
            <h4 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">CSV</h4>
            <p className="text-sm font-semibold text-gray-600 mt-2 uppercase tracking-wide">Clean Export</p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">Sync</h4>
            <p className="text-sm font-semibold text-gray-600 mt-2 uppercase tracking-wide">Firebase-backed</p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">Guest</h4>
            <p className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-600 mt-2 uppercase tracking-wide">
              Local Mode <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">Views</h4>
            <p className="text-sm font-semibold text-gray-600 mt-2 uppercase tracking-wide">Month & Week</p>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto mt-32 md:mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
            <p className="mt-4 text-gray-500">Powerful features to keep your finances in check.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Receipt className="w-6 h-6 text-blue-600" />}
              title="Track Expenses"
              description="Log every transaction with categories, amounts, and detailed notes."
              delay={0}
            />
            <FeatureCard 
              icon={<Wallet className="w-6 h-6 text-indigo-600" />}
              title="Manage Refunds"
              description="Never lose track of money owed back to you from returns or splitting bills."
              delay={0.1}
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-emerald-600" />}
              title="Export Anywhere"
              description="Export your tracker data to a CSV file for analysis, backup, or sharing."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-purple-600" />}
              title="Secure Cloud Sync"
              description="Signed-in data syncs to your Firebase account while guest entries stay local."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Lightning Fast"
              description="Built for speed. Enter transactions in seconds, not minutes."
              delay={0.4}
            />
            <FeatureCard 
              icon={<ArrowRight className="w-6 h-6 text-rose-500" />}
              title="Beautiful Analytics"
              description="Understand your spending habits with clean, intuitive visualizations."
              delay={0.5}
            />
          </div>
        </div>

        {/* How It Works Section */}
        <section className="max-w-7xl mx-auto mt-32 md:mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-4 text-gray-500">Three simple steps to financial clarity.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-emerald-100 -z-10" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative text-center"
            >
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 mb-6 relative z-10">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Connect</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">Sign in quickly and securely with your Google account. Your data stays with you.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative text-center"
            >
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 mb-6 relative z-10">
                <span className="text-3xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Track</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">Log your daily expenses, categorize them, and add notes or receipts if needed.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative text-center"
            >
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 mb-6 relative z-10">
                <span className="text-3xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Analyze</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">Review weekly or monthly views, export to CSV, and keep your records portable.</p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto mt-32 md:mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Loved by users</h2>
            <p className="mt-4 text-gray-500">Don't just take our word for it.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard 
              text="Expensify completely changed how I look at my spending. The UI is gorgeous and it's lightning fast."
              author="Sarah Jenkins"
              role="Freelance Designer"
              delay={0}
            />
            <TestimonialCard 
              text="Finally, an expense tracker that doesn't feel like a spreadsheet. The refund tracking alone is worth it."
              author="Marcus Chen"
              role="Product Manager"
              delay={0.1}
            />
            <TestimonialCard 
              text="I've tried dozens of budgeting apps. This is the only one I've stuck with because it's so effortless to use."
              author="Elena Rodriguez"
              role="Small Business Owner"
              delay={0.2}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-32 md:mt-40 text-center bg-white/60 backdrop-blur-xl border border-white/40 p-12 rounded-[3rem] shadow-xl shadow-blue-900/5">
          <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to regain control?</h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">Join thousands of users who have transformed their relationship with money using Expensify.</p>
          <div className="flex justify-center">
            {user ? (
              <Link 
                to="/dashboard"
                className="group flex items-center justify-center gap-2 h-14 px-8 bg-black hover:bg-gray-800 text-white font-semibold rounded-full transition-all shadow-lg shadow-black/20"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                {isFirebaseReady && (
                  <button 
                    onClick={signInWithGoogle}
                    className="group flex items-center justify-center gap-2 h-14 px-8 bg-black hover:bg-gray-800 text-white font-semibold rounded-full transition-all shadow-lg shadow-black/20 w-full sm:w-auto"
                  >
                    Start using Expensify
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                <button 
                  onClick={handleGuestLogin}
                  className="group flex items-center justify-center gap-2 h-14 px-8 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-semibold rounded-full transition-all shadow-sm w-full sm:w-auto"
                >
                  Continue as Guest
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-100/50 py-12 text-center mt-20">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Expensify. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}

function TestimonialCard({ text, author, role, delay }: { text: string; author: string; role: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex gap-1 mb-6 text-amber-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 fill-current" />
          ))}
        </div>
        <p className="text-gray-700 leading-relaxed mb-8">"{text}"</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-gray-400">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900">{author}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
