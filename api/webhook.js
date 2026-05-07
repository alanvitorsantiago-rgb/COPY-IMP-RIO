import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { type, data } = req.body || {};

  console.log('Webhook recebido:', { type, data });

  if (type === 'payment' && data?.id) {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
      });
      const payment = await response.json();

      console.log('Pagamento:', {
        id: payment.id,
        status: payment.status,
        external_ref: payment.external_reference,
      });

      if (payment.status === 'approved') {
        const userId = payment.external_reference;

        if (userId && userId !== 'user_anonymous') {
          // Atualiza o plano para PRO no Supabase
          const { error } = await supabase
            .from('profiles')
            .update({ plan: 'pro' })
            .eq('id', userId);

          if (error) {
            console.error('Erro ao atualizar plano no Supabase:', error);
          } else {
            console.log(`Plano do usuário ${userId} atualizado para PRO.`);
          }
        }
      }
    } catch (err) {
      console.error('Erro processando webhook:', err);
    }
  }

  return res.status(200).json({ received: true });
}

