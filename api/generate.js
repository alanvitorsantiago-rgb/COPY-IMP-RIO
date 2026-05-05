// /api/generate.js — Vercel Serverless Function
// Centraliza todas as chamadas de IA com segurança

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || 'AIzaSyAfeilT0uiPlU6FomtdqGd1wpcGCuyUVJ4';
  
  if (!API_KEY || API_KEY.includes('sua-chave') || API_KEY.length < 10) {
    return res.status(500).json({ 
      error: 'Gemini API Key não encontrada no servidor.',
      detail: 'Se você estiver usando a Vercel, adicione a variável GEMINI_API_KEY nas configurações do projeto (Environment Variables) no Dashboard da Vercel e faça um novo deploy.'
    });
  }

  const { mode = 'standard', niche, tone, platform, topic, intent } = req.body || {};

  if (!niche || !tone || !platform || !topic) {
    return res.status(400).json({ error: 'Campos obrigatórios: niche, tone, platform, topic' });
  }

  const prompt = buildPrompt({ mode, niche, tone, platform, topic, intent });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini error:', data);
      return res.status(502).json({ error: 'Erro na API do Gemini', detail: data });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const copies = parseResponse(text, mode);

    return res.status(200).json({ copies, mode });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

function buildPrompt({ mode, niche, tone, platform, topic, intent }) {
  const base = `Você é um expert em copywriting e marketing digital brasileiro. Escreva em português brasileiro natural e coloquial.`;

  const platformRules = {
    instagram: 'Use até 5 hashtags no final. Tom visual e aspiracional.',
    whatsapp: 'Direto, conversacional. Sugira CTA com link ou número.',
    tiktok: 'Energético, jovem, com hashtags no final (#).',
    linkedin: 'Tom profissional, sem excesso de emojis. Foco em valor.',
    facebook: 'Tom amigável e acessível, com CTA claro.',
    email: 'Assunto persuasivo + corpo com storytelling. Profissional.',
  };

  const platformRule = platformRules[platform] || '';

  if (mode === 'standard' || mode === 'emotional') {
    const intentLine = intent ? `Intenção emocional: ${intent} — a copy DEVE ativar essa emoção específica.` : '';
    return `${base}

Crie 3 copies DISTINTAS e CRIATIVAS para ${platform} sobre: "${topic}"
Nicho: ${niche}
Tom de voz: ${tone}
${intentLine}

Regras:
- Cada copy: 3 a 7 linhas
- Emojis estratégicos (não exagere)
- CTA poderoso no final de cada uma
- ${platformRule}
- Cada copy ÚNICA em estrutura e abordagem
- Separe APENAS com a linha: ---

Responda SOMENTE as 3 copies separadas por ---, sem numeração, títulos ou explicações.`;
  }

  if (mode === 'multistyle') {
    return `${base}

Reescreva a seguinte copy SOBRE: "${topic}" (Nicho: ${niche}, Plataforma: ${platform}) em 4 estilos distintos:

ESTILO 1 — AGRESSIVO: Direto, imperativo, sem rodeios. Provoca ação imediata.
ESTILO 2 — PERSUASIVO: Argumentos lógicos + emocional. Constrói valor antes de vender.
ESTILO 3 — PREMIUM: Luxuoso, exclusivo. Fala com quem quer o melhor.
ESTILO 4 — SIMPLES: Linguagem simples, humana, como uma conversa entre amigos.

Cada estilo: 3 a 6 linhas, CTA no final, ${platformRule}
Separe APENAS com: ---

Responda SOMENTE os 4 estilos separados por ---, sem rótulos ou títulos.`;
  }

  if (mode === 'score') {
    return `${base}

Crie 3 copies para ${platform} sobre: "${topic}" (Nicho: ${niche}, Tom: ${tone})
${platformRule}
CTA obrigatório. Emojis estratégicos. 3 a 7 linhas cada.

Depois de cada copy, adicione na mesma linha: [SCORE:XX] onde XX é um número de 0 a 100 representando o potencial de conversão.

Formato: copy completa aqui [SCORE:75]
---
próxima copy [SCORE:82]
---
terceira copy [SCORE:68]

Responda SOMENTE as copies com scores, separadas por ---.`;
  }

  if (mode === 'viral') {
    return `${base}

Crie 3 copies com MÁXIMO POTENCIAL VIRAL para ${platform} sobre: "${topic}" (Nicho: ${niche})

Foco em ENGAJAMENTO: salvar, compartilhar, comentar, marcar amigos.
Use gatilhos de viralidade: curiosidade, controvérsia leve, identificação imediata, valor percebido alto.
${platformRule}
Cada copy: 4 a 8 linhas. CTA de engajamento (pergunta, desafio, pedido de compartilhar).
Separe com: ---

Responda SOMENTE as 3 copies, sem títulos ou explicações.`;
  }

  return `${base} Crie 3 copies para ${platform} sobre "${topic}". Separe com ---.`;
}

function parseResponse(text, mode) {
  if (mode === 'score') {
    // Parse [SCORE:XX] tags
    const parts = text.split('---').map(s => s.trim()).filter(Boolean);
    return parts.map(part => {
      const scoreMatch = part.match(/\[SCORE:(\d+)\]/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      const copy = part.replace(/\[SCORE:\d+\]/gi, '').trim();
      return { copy, score };
    });
  }
  // Default: split by ---
  return text.split('---').map(s => s.trim()).filter(Boolean);
}
