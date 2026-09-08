// Datos públicos para recibir transferencias.
// No guardar acá contraseñas, tokens ni claves privadas.
export const PAYMENT_INFO = {
  provider: 'Mercado Pago',
  holder: 'Nahuel Dario Sanchez',
  alias: 'dassan.mp',
  cvu: '0000003100063480934070',
  cuit: '23-43241141-9'
};

export const MASKED_PAYMENT_INFO = {
  ...PAYMENT_INFO,
  cvuMasked: '•••• •••• •••• 4070'
};
