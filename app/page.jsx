import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import('./ClientPage'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'sans-serif',
      color: '#0ea5e9',
      fontWeight: 'bold'
    }}>
      Memuat Perpustakaan SMPN 1 Damai...
    </div>
  ),
});

export default function Page() {
  return <ClientPage />;
}
