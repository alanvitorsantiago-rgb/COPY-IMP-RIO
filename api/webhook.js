export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
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
        email: payment.payer?.email,
        valor: payment.transaction_amount,
      });

      // Aqui você pode integrar com banco de dados para ativar PRO automaticamente
      // Ex: atualizar usuário no Firebase, Supabase, etc.
    } catch (err) {
      console.error('Erro webhook:', err);
    }
  }

  return res.status(200).json({ received: true });
}
