import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import '../../assets/scss/common.scss';
import '../../assets/scss/forms.scss';
import '../../assets/scss/footer.scss';
import '../../assets/scss/signin.scss';
import logo from '../../assets/images/logo.svg';
import useAuthReducer from '../../stores/AuthReducer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().nonempty('Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { restPassword, isResetPassLoading, successMessage } = useAuthReducer(
    (state) => state
  );

  const [token, setToken] = useState('');

  useEffect(() => {
    const urlToken = location.pathname.split('/reset-password/')[1]; // Extract token
    if (urlToken) {
      setToken(urlToken);
    }
  }, [location]);

  useEffect(() => {
    if (successMessage === 'Password reset successfully') navigate('/login');
  }, [successMessage]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data) => {
    if (token) {
      restPassword({ ...data, token });
    } else {
      console.error('Token not found');
    }
  };

  return (
    <div class="user-log-wrp">
      <div class="inner-wrp">
        <div class="panel-left">
          <div class="logo-wrp">
            <img src={logo} alt="" />
          </div>
          <div class="quotes-wrp">
            Step into a productive day.<br /> Sign in to{' '}
            start managing your projects.
          </div>
        </div>
        <div class="panel-right">
          <div class="form-wrp-center login">
            <div class="top-blk reset">
              <div class="title">
                Reset Password
                {/* Welcome Back <span class="icon">👋</span> */}
              </div>
              <div class="desc">
                Step into a productive day.<br /> Sign in to
                start managing your projects.
              </div>
            </div>
            <div class="form-sec-wrp">
              <div class="form-group">
                <label class="form-label" for="">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Enter password"
                  {...register('password')}
                />
                {errors.password && (
                  <span htmlFor="" className="error">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div class="form-group">
                <label class="form-label" for="">
                  Confirm Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Confirm password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <span htmlFor="" className="error">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <Link
                class="link"
                onClick={() => {
                  navigate('/login');
                }}
              >
                Back to login?
              </Link>
              <button class="btn btn-rounded" onClick={handleSubmit(onSubmit)}>
                {isResetPassLoading ? (
                  <Spinner
                    size="sm"
                    as="span"
                    animation="border"
                    variant="light"
                    aria-hidden="true"
                    className="custom-spinner"
                  />
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
          <footer class="ftr">
            <p class="copy">© 2025 ALL RIGHTS RESERVED</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
