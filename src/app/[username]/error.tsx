'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('GitHub contribution fetch error:', error);
  }, [error]);

  const getErrorMessage = () => {
    if (error.message.includes('token not configured') || error.message.includes('GITHUB_TOKEN')) {
      return 'GitHub token not configured. Please set GITHUB_TOKEN in your .env.local file. See .env.example for instructions.';
    }
    if (error.message.includes('User not found')) {
      return 'GitHub user not found. Please check the username and try again.';
    }
    if (error.message.includes('Invalid GitHub username')) {
      return 'Invalid GitHub username format. Please use a valid GitHub username.';
    }
    if (error.message.includes('rate limit')) {
      return 'GitHub API rate limit exceeded. Please try again later.';
    }
    return 'Failed to load GitHub contributions. Please try again.';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#1a1a1a',
        color: '#fff',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ff6b6b' }}>
        Error Loading Contributions
      </h2>
      <p style={{ marginBottom: '1.5rem', textAlign: 'center', maxWidth: '400px' }}>
        {getErrorMessage()}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
