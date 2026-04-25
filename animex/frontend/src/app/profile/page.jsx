'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Save,
  LogOut,
  Settings,
  Bookmark,
  History,
  User
} from 'lucide-react';

import { useAuth } from '@/lib/AuthContext';
import { authApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [pw, setPw] = useState({
    current: '',
    newPw: '',
    confirm: ''
  });

  const [loading, setLoading] = useState(false);

  const [avatar] = useLocalStorage(
    'animex_avatar',
    '/avatars/user-1.jpeg'
  );

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const changePw = async (e) => {
    e.preventDefault();

    if (pw.newPw !== pw.confirm) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);

    try {
      await authApi.changePassword({
        currentPassword: pw.current,
        newPassword: pw.newPw
      });

      toast.success('Password changed!');

      setPw({
        current: '',
        newPw: '',
        confirm: ''
      });
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const card = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 22,
    marginBottom: 14
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '28px 24px 48px'
      }}
    >
      <h1
        style={{
          fontFamily: 'Rajdhani,sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--text-1)',
          marginBottom: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}
      >
        <User
          size={22}
          style={{ color: 'var(--accent)' }}
        />
        My Account
      </h1>

      <div
        style={{
          ...card,
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: '2px solid var(--accent)',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--accent-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Rajdhani,sans-serif',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--accent)'
              }}
            >
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-1)'
            }}
          >
            {user.name}
          </p>

          <p
            style={{
              fontSize: 13,
              color: 'var(--text-3)'
            }}
          >
            {user.email}
          </p>

          {user.createdAt && (
            <p
              style={{
                fontSize: 11,
                color: 'var(--text-4)',
                marginTop: 2
              }}
            >
              Member since{' '}
              {new Date(user.createdAt).toLocaleDateString(
                'en-US',
                {
                  month: 'long',
                  year: 'numeric'
                }
              )}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8
          }}
        >
          <Link href="/watchlist">
            Watchlist
          </Link>

          <Link href="/history">
            History
          </Link>

          <Link href="/settings">
            Settings
          </Link>
        </div>
      </div>

      <div style={card}>
        <h2>Change Password</h2>

        <form onSubmit={changePw}>
          <button
            type="submit"
            disabled={loading}
          >
            <Save size={13} />
            {loading
              ? 'Saving…'
              : 'Save Password'}
          </button>
        </form>
      </div>

      <div
        style={{
          ...card,
          borderColor:
            'rgba(248,113,113,0.2)'
        }}
      >
        <h2>Sign Out</h2>

        <button
          onClick={() => {
            logout();
            router.push('/home');
            toast.info('Signed out');
          }}
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
