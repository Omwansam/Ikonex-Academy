import { Outlet } from 'react-router-dom';
import { FiAward, FiBookOpen, FiShield, FiUsers } from 'react-icons/fi';
import { APP_NAME } from '../utils/constants';

const features = [
  { icon: FiUsers, title: 'Student Management', desc: 'Complete records & enrollment' },
  { icon: FiBookOpen, title: 'Academic Tracking', desc: 'Results, assessments & reports' },
  { icon: FiAward, title: 'Performance Analytics', desc: 'Insights that drive excellence' },
  { icon: FiShield, title: 'Secure Portal', desc: 'Role-based access for all users' },
];

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="auth-pattern relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-xl font-bold shadow-xl shadow-primary/40">
            IK
          </div>
          <h1 className="mt-10 text-4xl font-bold leading-tight tracking-tight">{APP_NAME}</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-300">
            Empowering schools with a modern, intuitive platform for academic excellence.
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-accent">
                <Icon size={20} />
              </div>
              <p className="mt-3 font-semibold">{title}</p>
              <p className="mt-1 text-xs text-slate-400">{desc}</p>
            </div>
          ))}
        </div>

        <div className="relative flex gap-10 border-t border-white/10 pt-8">
          {[
            { stat: '500+', label: 'Students' },
            { stat: '50+', label: 'Teachers' },
            { stat: '98%', label: 'Pass Rate' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-bold text-accent">{item.stat}</p>
              <p className="mt-1 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-background p-6 lg:w-1/2 lg:p-12">
        <div className="mb-8 text-center lg:hidden">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-xl font-bold text-white shadow-lg">
            IK
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">{APP_NAME}</h1>
        </div>
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
