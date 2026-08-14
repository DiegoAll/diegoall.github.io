import { useRouteError, Link } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1>Algo salió mal</h1>
      <p>{error?.statusText || error?.message}</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

export default ErrorPage;