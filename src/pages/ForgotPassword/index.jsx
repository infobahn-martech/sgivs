import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import '../../assets/scss/common.scss';
import '../../assets/scss/forms.scss';
import '../../assets/scss/footer.scss';
import '../../assets/scss/signin.scss';
import logo from '../../assets/images/logo.svg';
import useAuthReducer from '../../stores/AuthReducer';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const loginSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email format'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isForgotLoading } = useAuthReducer((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    forgotPassword(data);
  };

  return (
    <div class="user-log-wrp">
      <div class="inner-wrp">
        {/* LEFT PANEL */}
        <div className="panel-left login-v2__left" aria-hidden="true">
          <div className="login-v2__left-card">
            <div className="login-v2__left-title">Access Notice</div>
            <div className="login-v2__left-desc">
              The access to Indian Consular Application CRM system is restricted to authorized personnel only.
              You are informed that its use must be limited only to the authorized users as mentioned in the
              security policy and all the access will be registered and logged.
            </div>
          </div>
        </div>
        <div class="panel-right">
          <div class="form-wrp-center login">
            <div class="top-blk reset">
              <div class="title">
                Forgot Password
                {/* Welcome Back <span class="icon">👋</span> */}
              </div>
              <div class="desc">
                Step into a productive day.
                <br /> Sign in to manage your operations seamlessly.
              </div>
            </div>
            <div class="form-sec-wrp">
              <div class="form-group">
                <label class="form-label" for="">
                  Email
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter your email"
                  {...register('email')}
                />
                {errors.email && (
                  <span htmlFor="" className="error">
                    {errors.email.message}
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
                {isForgotLoading ? (
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

export default ForgotPassword;
