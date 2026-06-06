import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiCheckCircle, FiLock } from 'react-icons/fi';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword({ token: searchParams.get('token') || 'demo', password: data.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
          <FiCheckCircle className="h-8 w-8 text-success" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-text-primary">Password Reset</h2>
        <p className="mt-2 text-sm text-text-secondary">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary">
        <FiArrowLeft size={16} /> Back to login
      </Link>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
          <FiLock className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Reset Password</h2>
        <p className="mt-1 text-sm text-text-secondary">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-danger">{error}</div>}
        <Input label="New Password" type="password" {...register('password', { required: true, minLength: 6 })} />
        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword', {
            required: true,
            validate: (v) => v === password || 'Passwords do not match',
          })}
        />
        <Button type="submit" className="w-full" size="lg" loading={loading}>Reset Password</Button>
      </form>
    </div>
  );
}
