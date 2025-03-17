'use client'
import { useEffect, useState } from 'react';
import styles from './forgetpass.module.css';
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '@/app/actions';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
        if(localStorage.getItem('accessToken')){
          router.replace('/dashboard');
        }
      })
      
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    // router.push('/dashboard')
    axiosInstance.post('/api/auth/resetpass',{email}).then((res)=>{
      console.log(res)
      setLoading(false);
      router.push('/login')
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
        {error && <p className={styles.error}>{error}</p>}
        <button disabled={loading} type="submit" className={styles.submitButton}>
        {
            loading? (
              <span className={styles.loader}></span>
            ) : (
              <></>
            )
          }
          Submit</button>
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
