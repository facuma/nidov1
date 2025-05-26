// src/server/createPreference.js
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preference = new Preference(client);

export async function createPreference({ title, unit_price, quantity = 1, metadata = {} }) {
  const preferenceData = {
    items: [
      {
        title,
        unit_price,
        quantity,
      },
    ],
    back_urls: {
      success: 'https://a909-181-1-62-201.ngrok-free.app/pago-exitoso',
      failure: 'https://a909-181-1-62-201.ngrok-free.app/pago-fallido',
      pending: 'https://a909-181-1-62-201.ngrok-free.app/pago-pendiente',
    },
    auto_return: 'approved',
    metadata,
  };
  console.log('🧾 Creando preferencia con:', preferenceData)

  const response = await preference.create({ body: preferenceData });
  return response.init_point;
}