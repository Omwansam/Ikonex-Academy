import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { authService, DEMO_STUDENT_PASSWORD } from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

function looksLikeAdmissionNumber(value) {
  return /^IKX/i.test(String(value || '').trim());
}

export default function LoginPage() {
  const [loginType, setLoginType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const switchLoginType = (type) => {
    setLoginType(type);
    setError('');
    reset({ identifier: '', password: '', remember: false });
  };

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    const identifier = String(data.identifier || '').trim();
    const password = String(data.password || '').trim();
    const effectiveType = looksLikeAdmissionNumber(identifier) ? 'student' : loginType;
    if (looksLikeAdmissionNumber(identifier) && loginType === 'admin') setLoginType('student');

    try {
      const result = effectiveType === 'admin'
        ? await authService.loginAdmin({ email: identifier, password })
        : await authService.loginStudent({ admissionNumber: identifier, password });
      login(result.user, result.token);
      navigate(result.user.role === 'admin' ? '/admin' : '/student', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
          {loginType === 'admin' ? <FiLock className="h-7 w-7 text-primary" /> : <FiUser className="h-7 w-7 text-primary" />}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Welcome back</h2>
        <p className="mt-1 text-sm text-text-secondary">Sign in to continue to your portal</p>
      </div>

      <div className="flex rounded-xl bg-slate-100 p-1">
        {['student', 'admin'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => switchLoginType(type)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
              loginType === type ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {loginType === 'student' && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-xs leading-relaxed text-primary">
          Demo password for all active students: <strong>{DEMO_STUDENT_PASSWORD}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-danger">{error}</div>
        )}

        <Input
          label={loginType === 'admin' ? 'Email Address' : 'Admission Number'}
          type={loginType === 'admin' ? 'email' : 'text'}
          placeholder={loginType === 'admin' ? 'admin@ikonex.ac.ke' : 'IKX2024001'}
          error={errors.identifier?.message}
          {...register('identifier', { required: 'This field is required' })}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="mt-2 flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-primary">
            {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
            {showPassword ? 'Hide password' : 'Show password'}
          </button>
        </div>

        {loginType === 'admin' && (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" {...register('remember')} />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">Forgot password?</Link>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" loading={loading}>Sign In</Button>
      </form>

      <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs leading-relaxed text-text-secondary">
        Demo — Admin: <strong>admin@ikonex.ac.ke</strong> / admin123 · Student: <strong>IKX2024001</strong> / {DEMO_STUDENT_PASSWORD}
      </p>
    </div>
  );
}
