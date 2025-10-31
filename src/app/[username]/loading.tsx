'use client';

import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.widget}>
        {/* Skeleton for month labels */}
        <div className={styles.month}>
          <div style={{ opacity: 0.3 }}>Loading...</div>
        </div>

        <div className={styles.graph}>
          {/* Skeleton for weekday labels */}
          <div className={styles.week}>
            <div style={{ opacity: 0.3 }}>Mon</div>
            <div style={{ opacity: 0.3 }}>Wed</div>
            <div style={{ opacity: 0.3 }}>Fri</div>
          </div>

          {/* Skeleton grid for contributions */}
          <div className={styles.contributions}>
            {Array.from({ length: 364 }).map((_, i) => (
              <div
                key={i}
                className={styles.contribution}
                style={{
                  background: '#2d3748',
                  opacity: 0.3,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
