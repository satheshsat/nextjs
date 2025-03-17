'use client'
import { useEffect, useState } from 'react';
import styles from './register.module.css';
import Link from 'next/link';
import axiosInstance from '@/app/actions';
import { redirect, useRouter } from 'next/navigation'

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<String|null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(()=>{
      if(localStorage.getItem('accessToken')){
        router.replace('/dashboard');
      }
    })

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    // router.push('/dashboard')
    axiosInstance.post('/api/auth/register',{name, email, password}).then((res)=>{
      console.log(res)
      setLoading(false);
      router.push('/api/auth/login')
    }).catch((err) => {
      console.log(err);
      setLoading(false);
      setError(err?.response?.data?.message || 'Something went wrong');  
      // setError(err || 'Something went wrong');
    })
  };

  return (
    <div className={styles.container}>
      {/* <h2 className={styles.header}>Register</h2> */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
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
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          Register</button>
        <Link href="/auth/login">
            <button type="button" className={styles.registerButton}>
            {
            loading? (
              <span className={styles.loader}></span>
            ) : (
              <></>
            )
          }
              Login</button>
        </Link>
      </form>
    </div>
  );
}
