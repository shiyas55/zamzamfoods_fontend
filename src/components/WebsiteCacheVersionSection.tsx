import React, { useState } from 'react';
import {
  RefreshCw,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Sparkles,
  Zap,
  Trash2,
  Server,
} from 'lucide-react';

export const WebsiteCacheVersionSection: React.FC = () => {
  const [clearingCache, setClearingCache] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // App Build & Release Metadata
  const appVersion = 'v3.2.0 Enterprise';
  const buildDate = 'October 1, 2026, 03:15 PM IST';
  const releaseChannel = 'Production (Railway Cloud + Supabase)';

  const handleClearCacheAndReload = async () => {
    try {
      setClearingCache(true);
      setFeedback(null);

      // 1. Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // 2. Delete all CacheStorage caches
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        for (const key of cacheKeys) {
          await caches.delete(key);
        }
      }

      // 3. Clear temporary sessionStorage
      sessionStorage.clear();

      setFeedback({
        type: 'success',
        message: 'Cache successfully cleared! Reloading fresh application...',
      });

      // 4. Force reload with cache-busting timestamp
      setTimeout(() => {
        window.location.href = window.location.pathname + '?reload=' + Date.now();
      }, 1000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to clear application cache.',
      });
      setClearingCache(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          padding: '1.25rem 1.75rem',
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
            }}
          >
            <Globe size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Website & Application Deployment Telemetry
              </h3>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  backgroundColor: 'rgba(16, 185, 129, 0.25)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                LIVE & SYNCED
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Real-time build version, deployment timestamps, and one-click browser cache purging.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearCacheAndReload}
          disabled={clearingCache}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1.1rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          <Trash2 size={15} className={clearingCache ? 'spinner' : ''} />
          <span>{clearingCache ? 'Purging Cache...' : 'Purge Cache & Update'}</span>
        </button>
      </div>

      <div style={{ padding: '1.75rem' }}>
        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              color: feedback.type === 'success' ? '#166534' : '#991b1b',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Telemetry Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Card 1: Last Website Update */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>LAST WEBSITE UPDATE</span>
              <Clock size={16} color="#0284c7" />
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
              {buildDate}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={13} />
              <span>Latest code deployed to production</span>
            </div>
          </div>

          {/* Card 2: Release Version */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>APP RELEASE BUILD</span>
              <Zap size={16} color="#dc2626" />
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', marginBottom: '0.35rem' }}>
              {appVersion}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {releaseChannel}
            </div>
          </div>

          {/* Card 3: Cache Invalidation Engine */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>CACHE BUSTING ENGINE</span>
              <HardDrive size={16} color="#059669" />
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginBottom: '0.35rem' }}>
              Automatic No-Cache
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              HTTP no-store headers + Service Worker v3.0
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            fontSize: '0.84rem',
            color: '#1e40af',
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
          }}
        >
          <Server size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#2563eb' }} />
          <div>
            <strong>Need to see immediate changes after an update?</strong> Click the{' '}
            <strong>"Purge Cache & Update"</strong> button above, or press{' '}
            <kbd style={{ background: '#ffffff', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #93c5fd', fontWeight: 700 }}>
              Cmd + Shift + R
            </kbd>{' '}
            (Mac) or{' '}
            <kbd style={{ background: '#ffffff', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #93c5fd', fontWeight: 700 }}>
              Ctrl + Shift + R
            </kbd>{' '}
            (Windows) in your browser.
          </div>
        </div>
      </div>
    </div>
  );
};
