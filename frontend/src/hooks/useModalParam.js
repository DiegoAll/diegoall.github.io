import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Controla un modal a través de un parámetro de la URL (?job=bold, ?project=k8s-runtime-sec).
//
//  - Abrir  -> agrega una entrada al historial, así el botón "atrás" del teléfono
//              (o del navegador) cierra el modal en vez de salir de la página.
//  - Cerrar -> si se abrió desde dentro de la app, hace "atrás"; si el usuario
//              llegó directo por un link compartido, solo quita el parámetro.
//  - La URL es compartible: /projects?project=k8s-runtime-sec abre ese detalle.
export function useModalParam(key) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeId = new URLSearchParams(location.search).get(key);
  const openedInApp = Boolean(location.state?.modalOpenedInApp);

  const open = useCallback(
    (id) => {
      const next = new URLSearchParams(location.search);
      next.set(key, id);
      navigate({ search: next.toString() }, { state: { modalOpenedInApp: true } });
    },
    [key, location.search, navigate]
  );

  const close = useCallback(() => {
    if (openedInApp) {
      navigate(-1);
      return;
    }
    const next = new URLSearchParams(location.search);
    next.delete(key);
    navigate({ search: next.toString() }, { replace: true });
  }, [key, location.search, openedInApp, navigate]);

  return { activeId, open, close };
}
