import { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext(null);

const initialIdentificacion = {
  correo: '',
  nombre: '',
  apellidos: '',
  documento: '',
  telefono: '',
};

const initialEntrega = {
  metodo: 'envio',
  departamento: '',
  provincia: '',
  distrito: '',
  direccion: '',
  referencia: '',
};

export function CheckoutProvider({ children }) {
  const [identificacion, setIdentificacion] = useState(initialIdentificacion);
  const [entrega, setEntrega] = useState(initialEntrega);

  function updateIdentificacion(data) {
    setIdentificacion((prev) => ({ ...prev, ...data }));
  }

  function updateEntrega(data) {
    setEntrega((prev) => ({ ...prev, ...data }));
  }

  return (
    <CheckoutContext.Provider
      value={{
        identificacion,
        updateIdentificacion,
        entrega,
        updateEntrega,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout debe usarse dentro de <CheckoutProvider>');
  return ctx;
}