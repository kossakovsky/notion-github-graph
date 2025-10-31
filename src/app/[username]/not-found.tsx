export default function NotFound() {
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
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404</h2>
      <p style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>User Not Found</p>
      <p style={{ color: '#888', textAlign: 'center', maxWidth: '400px' }}>
        The GitHub user you&apos;re looking for doesn&apos;t exist. Please check the
        username and try again.
      </p>
    </div>
  );
}
