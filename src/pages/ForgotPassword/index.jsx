import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import '../../assets/scss/common.scss';
import '../../assets/scss/forms.scss';
import '../../assets/scss/footer.scss';
import '../../assets/scss/signin.scss';
import logoImg from '../../assets/images/mainLogo.png';
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
    <div className="user-log-wrp">
      <div className="inner-wrp">
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
        <div className="panel-right">
          <div className="form-wrp-center login">
            <div className="top-blk reset">
              <div className="login-v2__logo-wrap">
                <img src={logoImg} alt="SGIVS GLOBAL" className="login-v2__logo" />
              </div>
              <div style={{ width: '100%', textAlign: 'left' }}>
                <div className="title">Forgot Password</div>
                <div className="desc">
                  Forgot your password? No problem.
                  <br /> Enter your email and we'll send you a link to reset it.
                </div>
              </div>
            </div>
            <div className="form-sec-wrp">
              <div className="form-group">
                <label className="form-label" for="">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
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
                className="link"
                onClick={() => {
                  navigate('/login');
                }}
              >
                Back to login?
              </Link>
              <button className="btn btn-rounded" onClick={handleSubmit(onSubmit)}>
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
          <footer className="ftr">
            <p className="copy">© 2025 - {new Date().getFullYear()} SGIVS Global. All Rights Reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
