import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiCheckCircle, FiMail } from 'react-icons/fi';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
          <FiCheckCircle className="h-8 w-8 text-success" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-text-primary">Check your email</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <Link to="/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white">
          <FiArrowLeft size={16} /> Back to login
        </Link>
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
          <FiMail className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Forgot Password</h2>
        <p className="mt-1 text-sm text-text-secondary">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-danger">{error}</div>}
        <Input label="Email Address" type="email" placeholder="admin@ikonex.ac.ke" {...register('email', { required: true })} />
        <Button type="submit" className="w-full" size="lg" loading={loading}>Send Reset Link</Button>
      </form>
    </div>
  );
}
