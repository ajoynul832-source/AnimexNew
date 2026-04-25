'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Monitor,
  Trash2,
  User
} from 'lucide-react';

import { useAuth } from '@/lib/AuthContext';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/Toast';

// Ported from Zoro: files/avatar/ (12 avatars)
const AVATARS = Array.from(
  { length: 12 },
  (_, i) => `/avatars/user-${i + 1}.jpeg`
);

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const {
    clearAll: clearProgress
  } = useWatchProgress();

  const [defaultCat, setDefaultCat] =
    useLocalStorage(
      'animex_default_cat',
      'sub'
    );

  const [defaultSrv, setDefaultSrv] =
    useLocalStorage(
      'animex_default_srv',
      'hd-1'
    );

  const [autoNext, setAutoNext] =
    useLocalStorage(
      'animex_auto_next',
      true
    );

  const [skipIntro, setSkipIntro] =
    useLocalStorage(
      'animex_skip_intro',
      false
    );

  const [avatar, setAvatar] =
    useLocalStorage(
      'animex_avatar',
      AVATARS[0]
    );

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const card = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 22,
    marginBottom: 14
  };

  const row = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottom: '1px solid var(--border)',
    marginBottom: 12
  };

  const Toggle = ({ val, set }) => (
    <button
      onClick={() => set(!val)}
      style={{
        width: 42,
        height: 22,
        borderRadius: 11,
        background: val
          ? 'var(--accent)'
          : 'var(--bg-card-alt)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: val ? 20 : 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: val
            ? '#111'
            : 'var(--text-3)'
        }}
      />
    </button>
  );

  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '28px 24px 48px'
      }}
    >
      <h1>
        <Settings size={22} />
        Settings
      </h1>

      <div style={card}>
        <h2>
          <Monitor size={15} />
          Player Defaults
        </h2>

        <div style={row}>
          <div>
            <div>
              Default Category
            </div>
          </div>

          <div>
            {['sub', 'dub'].map(
              (c) => (
                <button
                  key={c}
                  onClick={() =>
                    setDefaultCat(c)
                  }
                >
                  {c}
                </button>
              )
            )}
          </div>
        </div>

        <div style={row}>
          <div>
            <div>
              Default Server
            </div>
          </div>

          <select
            value={defaultSrv}
            onChange={(e) =>
              setDefaultSrv(
                e.target.value
              )
            }
          >
            {[
              'hd-1',
              'hd-2',
              'hd-3',
              'StreamSB',
              'StreamTape'
            ].map((s) => (
              <option
                key={s}
                value={s}
              >
                {s}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            ...row,
            borderBottom: 'none',
            marginBottom: 0,
            paddingBottom: 0
          }}
        >
          <div>
            Auto-play Next Episode
          </div>

          <Toggle
            val={autoNext}
            set={setAutoNext}
          />
        </div>
      </div>

      <div style={card}>
        <h2>
          <User size={15} />
          Avatar
        </h2>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10
          }}
        >
          {AVATARS.map((src) => (
            <button
              key={src}
              onClick={() => {
                setAvatar(src);
                toast.success(
                  'Avatar updated!'
                );
              }}
            >
              <img
                src={src}
                alt="avatar"
                width={52}
                height={52}
              />
            </button>
          ))}
        </div>
      </div>

      <div style={card}>
        <h2>
          <Trash2 size={15} />
          Data
        </h2>

        <button
          onClick={() => {
            clearProgress();
            toast.success(
              'Watch progress cleared'
            );
          }}
        >
          <Trash2 size={13} />
          Clear Watch Progress
        </button>
      </div>
    </div>
  );
}
