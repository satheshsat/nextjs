'use client'
import { useEffect, useState } from 'react';
import styles from './login.module.css';
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '@/app/actions';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()

  useEffect(()=>{
        if(localStorage.getItem('accessToken')){
          router.replace('/dashboard');
        }
      })

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // router.push('/dashboard')
    axiosInstance.post('/api/auth/login',{email, password}).then((res)=>{
      console.log(res)
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      localStorage.setItem('userData', JSON.stringify(res.data.data))
      setLoading(false);
      router.push('/dashboard')
    }).catch((err) => {
      console.log(err);
      setLoading(false);
      setError(err?.response?.data?.message || 'Something went wrong');  
      // setError(err || 'Something went wrong');
    })
  };

  return (
    <div className={styles.container}>
      {/* <h2 className={styles.header}>Login</h2> */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button disabled={loading} type="submit" className={styles.submitButton}>
        {
            loading? (
              <span className={styles.loader}></span>
            ) : (
              <></>
            )
          }
          Login</button>
        <Link href={loading ? '#' : "/auth/register"}>
            <button type="button" className={styles.registerButton}>
            {
            loading? (
              <span className={styles.loader}></span>
            ) : (
              <></>
            )
          }
              Register</button>
        </Link>
        <Link href={loading ? '#' : "/auth/forgetpass"}>
            <button type="button" className={styles.registerButton}>
            {
            loading? (
              <span className={styles.loader}></span>
            ) : (
              <></>
            )
          }
              Forget Password</button>
        </Link>
      </form>
    </div>
  );
}
