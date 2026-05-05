export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userEmail, userName } = req.body || {};
  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    return res.status(500).json({ error: 'MP_ACCESS_TOKEN não configurado na Vercel' });
  }

  try {
    const preference = {
      items: [
        {
          id: 'copyia-pro-mensal',
          title: 'CopyIA PRO — Gerador de Legendas Ilimitado',
          description: 'Assinatura mensal do plano PRO. Gerações ilimitadas de copies com IA.',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 29.90,
        },
      ],
      payer: {
        email: userEmail || '',
        name: userName || '',
      },
      back_urls: {
        success: 'https://copy-imp-rio.vercel.app/?payment=success',
        failure: 'https://copy-imp-rio.vercel.app/?payment=failure',
        pending: 'https://copy-imp-rio.vercel.app/?payment=pending',
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [],
        installments: 1,
      },
      statement_descriptor: 'COPYIA PRO',
      external_reference: userEmail || 'user',
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MP Error:', data);
      return res.status(400).json({ error: 'Erro ao criar preferência', detail: data });
    }

    return res.status(200).json({
      id: data.id,
      init_point: data.init_point, // URL de checkout
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
