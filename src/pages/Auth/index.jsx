import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import '../../assets/scss/common.scss';
import '../../assets/scss/forms.scss';
import '../../assets/scss/footer.scss';
import '../../assets/scss/signin.scss';

import useAuthReducer from '../../stores/AuthReducer';
import useCenterReducer from '../../stores/CenterReducer';
import useCounterReducer from '../../stores/CounterReducer';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import SignUp from '../SignUp';
import logoImg from '../../assets/images/mainLogo.png';

const loginSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
  country_id: z.string().optional(),
  center_id: z.string().optional(),
  counter_id: z.string().optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const { login, isLoginLoading } = useAuthReducer((state) => state);
  const { countryList, getCountries } = useCenterReducer((state) => state);
  const {
    centers,
    counters,
    getAllCenter,
    getAllCounter,
    clearCounterData,
  } = useCounterReducer((state) => state);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: {
      country_id: '',
      center_id: '',
      counter_id: '',
      signInAsBackOfficeStaff: false,
    },
  });

  console.log("counters", counters);
  console.log(countryList);
  const countryId = watch('country_id');
  const centerId = watch('center_id');

  useEffect(() => {
    getCountries();
    getAllCenter();
  }, [getCountries, getAllCenter]);

  useEffect(() => {
    if (centerId) {
      getAllCounter(centerId);
    } else {
      clearCounterData();
      setValue('counter_id', '');
    }
  }, [centerId, getAllCounter, clearCounterData, setValue]);

  useEffect(() => {
    setValue('center_id', '');
    setValue('counter_id', '');
    clearCounterData();
  }, [countryId, setValue, clearCounterData]);

  const centerOptions = useMemo(() => {
    const list = Array.isArray(centers) ? centers : [];
    if (!countryId) return list;
    const filtered = list.filter(
      (c) => String(c?.country_id ?? c?.countryId ?? '') === String(countryId)
    );
    return filtered.length > 0 ? filtered : list;
  }, [centers, countryId]);

  const countryOptions = useMemo(
    () => Array.isArray(countryList) ? countryList : [],
    [countryList]
  );

  const counterOptions = useMemo(
    () => Array.isArray(counters) ? counters : [],
    [counters]
  );

  const onSubmit = async (data) => {
    try {
      await login({
        username: data.username,
        password: data.password,
        center_id: data.center_id || 1,
        counter_id: data.counter_id || 3,
      });
      navigate('/');
    } catch {
      // Error already shown via AlertReducer
    }
  };

  return (
    <div className="user-log-wrp login-v2">
      <div className="inner-wrp login-v2__inner">
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

        {/* RIGHT PANEL */}
        <div className="panel-right login-v2__right">
          <div className="form-wrp-center login login-v2__form-card">
            <div className="top-blk">
              <div className="login-v2__logo-wrap">
                <img src={logoImg} alt="SGIVS GLOBAL" className="login-v2__logo" />
              </div>
              <div style={{ width: '100%', textAlign: 'left' }}>
                <div className="title">Welcome Back</div>
                <div className="desc">
                  Step into a productive day.
                  <br />
                  Sign in to manage your operations seamlessly.
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-sec-wrp">

                {/* USERNAME */}
                <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="form-control login-v2__input"
                    placeholder="Enter your username"
                    autoComplete="username"
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? 'username-error' : undefined}
                    {...register('username')}
                  />
                  {errors.username && (
                    <span className="error" id="username-error" role="alert">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                {/* PASSWORD */}
                <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control login-v2__input"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...register('password')}
                  />
                  {errors.password && (
                    <span className="error" id="password-error" role="alert">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* COUNTRY */}
                <div className="form-group">
                  <label className="form-label" htmlFor="country_id">
                    Country
                  </label>
                  <select
                    id="country_id"
                    className="form-control login-v2__input"
                    {...register('country_id')}
                  >
                    <option value="">Select Country</option>
                    {countryOptions.map((item) => (
                      <option
                        key={item.country_id ?? item.id}
                        value={item.country_id ?? item.id}
                      >
                        {item.country_name ?? item.name ?? '-'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CENTER */}
                <div className="form-group">
                  <label className="form-label" htmlFor="center_id">
                    Center
                  </label>
                  <select
                    id="center_id"
                    className="form-control login-v2__input"
                    {...register('center_id')}
                  >
                    <option value="">Select Center</option>
                    {centerOptions.map((item) => (
                      <option
                        key={item.center_id ?? item.id}
                        value={item.center_id ?? item.id}
                      >
                        {item.center_name ?? item.name ?? '-'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COUNTER */}
                <div className="form-group">
                  <label className="form-label" htmlFor="counter_id">
                    Counter
                  </label>
                  <select
                    id="counter_id"
                    className="form-control login-v2__input"
                    {...register('counter_id')}
                    disabled={!centerId}
                  >
                    <option value="">Select Counter</option>
                    {counterOptions.map((item) => (
                      <option
                        key={item.counter_id ?? item.id}
                        value={item.counter_id ?? item.id}
                      >
                        {item.counter_name ?? item.name ?? '-'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SIGN IN AS BACK OFFICE STAFF */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      id="signInAsBackOfficeStaff"
                      className="form-check-input"
                      {...register('signInAsBackOfficeStaff')}
                    />
                    Sign in as Back Office Staff
                  </label>
                </div>

                <div className="login-v2__actions" style={{ textAlign: 'right' }}>
                  <Link className="link login-v2__forgot" to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  className="btn btn-rounded login-v2__btn"
                  type="submit"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? (
                    <>
                      <Spinner
                        size="sm"
                        as="span"
                        animation="border"
                        variant="light"
                        aria-hidden="true"
                        className="custom-spinner"
                      />
                      <span style={{ marginLeft: 10 }}>Logging in...</span>
                    </>
                  ) : (
                    'Login'
                  )}
                </button>

                {/* ✅ SIGNUP LINK */}
                <div className="login-v2__signup">
                  Don’t have an account?{' '}
                  <Link className="signup-link" onClick={() => setShowSignUpModal(true)}>
                    Sign up
                  </Link>
                </div>

              </div>
            </form>
          </div>

          <footer className="ftr login-v2__footer">
            <p className="copy">© 2025 ALL RIGHTS RESERVED</p>
          </footer>
        </div>
      </div>
      {showSignUpModal && <SignUp showModal={showSignUpModal} closeModal={() => setShowSignUpModal(false)} onRefreshSignUp={() => setShowSignUpModal(false)} />}
    </div>
  );
};

export default Login;
