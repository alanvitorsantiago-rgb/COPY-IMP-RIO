export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userEmail, userName, planType } = req.body || {};
  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    return res.status(500).json({ error: 'MP_ACCESS_TOKEN não configurado' });
  }

  // Configuração do Plano
  const isAnnual = planType === 'annual';
  const planDetails = {
    id: isAnnual ? 'copyia-pro-anual' : 'copyia-pro-mensal',
    title: isAnnual ? 'CopyIA PRO — Plano Anual (Economize 35%)' : 'CopyIA PRO — Plano Mensal',
    price: isAnnual ? 197.00 : 24.90,
    description: isAnnual 
      ? 'Acesso ilimitado por 1 ano às ferramentas de IA da CopyIA.' 
      : 'Acesso ilimitado por 1 mês às ferramentas de IA da CopyIA.'
  };

  try {
    const preference = {
      items: [
        {
          id: planDetails.id,
          title: planDetails.title,
          description: planDetails.description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: planDetails.price,
        },
      ],
      payer: {
        email: userEmail || 'comprador@email.com',
        name: userName || 'Cliente CopyIA',
      },
      back_urls: {
        success: 'https://copy-imp-rio.vercel.app/?payment=success',
        failure: 'https://copy-imp-rio.vercel.app/?payment=failure',
        pending: 'https://copy-imp-rio.vercel.app/?payment=pending',
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [
          { id: 'ticket' } // Excluir boleto se preferir apenas cartão/pix para ativação imediata
        ],
        installments: 1,
      },
      statement_descriptor: 'COPYIA PRO',
      external_reference: userEmail || 'user_anonymous',
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
      init_point: data.init_point, 
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

