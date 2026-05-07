import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || 'AIzaSyAfeilT0uiPlU6FomtdqGd1wpcGCuyUVJ4';
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  if (!API_KEY || API_KEY.includes('sua-chave') || API_KEY.length < 10) {
    return res.status(500).json({ 
      error: 'Gemini API Key não encontrada no servidor.'
    });
  }

  const { mode = 'standard', niche, tone, platform, topic, intent, userId } = req.body || {};

  let trainingExamples = [];
  if (mode === 'mirror' && userId) {
    const { data, error } = await supabase
      .from('user_training')
      .select('content')
      .eq('user_id', userId)
      .limit(5);
    
    if (!error && data) {
      trainingExamples = data.map(d => d.content);
    }
  }

  if (!niche || !tone || !platform || !topic) {
    return res.status(400).json({ error: 'Campos obrigatórios: niche, tone, platform, topic' });
  }

  const prompt = buildPrompt({ mode, niche, tone, platform, topic, intent, trainingExamples });


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

function buildPrompt({ mode, niche, tone, platform, topic, intent, trainingExamples = [] }) {
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

  if (mode === 'mirror') {
    const examplesText = trainingExamples.length > 0 
      ? `\n\nEXEMPLOS DO ESTILO DO USUÁRIO (REPLIQUE ESSE TOM):\n${trainingExamples.join('\n---\n')}\n`
      : '';

    return `${base}
    
Você deve agir como um "Espelho de Escrita". Seu objetivo é aprender o tom de voz, o vocabulário e a estrutura das copies abaixo e gerar novas variações para ${platform} sobre: "${topic}".
Nicho: ${niche}
Tom base: ${tone}
${examplesText}

Regras:
1. Analise os exemplos acima (se houver) e mimetize o estilo.
2. Gere 3 copies novas seguindo esse padrão.
3. Se não houver exemplos, siga o tom "${tone}" de forma ultra-personalizada.
4. ${platformRule}
5. Separe as 3 copies com: ---

Responda SOMENTE as 3 copies.`;
  }


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
    
Crie 3 variações de copy para ${platform} sobre: "${topic}" (Nicho: ${niche}, Tom: ${tone}).

Para cada variação, você deve realizar uma análise técnica de sentimento e conversão.
${platformRule}
CTA obrigatório. Emojis estratégicos. 3 a 7 linhas cada.

Após cada copy, adicione EXATAMENTE este bloco de dados: 
[SENTIMENT:Total|Psi,Urg,Cla,Val,Pro|Dica]

Onde:
- Total: Score geral de 0 a 100.
- Psi, Urg, Cla, Val, Pro: Scores de 0 a 100 para Psicologia, Urgência, Clareza, Valor e Prova Social.
- Dica: Uma frase curta (máx 10 palavras) de como melhorar essa copy específica.

Exemplo de formato:
Conteúdo da copy aqui [SENTIMENT:85|80,90,70,85,60|Dica: Adicione um depoimento real para aumentar a prova social]
---
Próxima copy...

Responda SOMENTE as copies com os blocos de sentimento, separadas por ---.`;
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

  if (mode === 'calendar') {
    return `${base}

Você deve criar um PLANEJAMENTO ESTRATÉGICO DE 30 DIAS para ${platform} sobre: "${topic}" (Nicho: ${niche}).

ESTRUTURA DA RESPOSTA (OBRIGATÓRIA):
1. Uma tabela/lista com 30 ideias rápidas (uma para cada dia do mês). Formato: "Dia X: [Tema/Hook]"
2. 4 copies COMPLETAS e DETALHADAS para os 4 dias mais importantes do mês (ex: Início, Meio, Antecipação e Venda).

Regras das 4 copies:
- Devem seguir o nicho ${niche} e o tom ${tone}.
- Cada uma com 5 a 10 linhas, emojis e CTA poderoso.
- ${platformRule}

Separe a tabela das copies e as copies entre si usando exatamente: ---

Responda SOMENTE o conteúdo solicitado, começando direto pelo Dia 1.`;
  }


  return `${base} Crie 3 copies para ${platform} sobre "${topic}". Separe com ---.`;
}

function parseResponse(text, mode) {
  if (mode === 'score') {
    // Parse [SENTIMENT:Total|Psi,Urg,Cla,Val,Pro|Dica] tags
    const parts = text.split('---').map(s => s.trim()).filter(Boolean);
    return parts.map(part => {
      const match = part.match(/\[SENTIMENT:(\d+)\|([\d,]+)\|(.*?)\]/i);
      
      if (match) {
        const totalScore = parseInt(match[1]);
        const metrics = match[2].split(',').map(m => parseInt(m));
        const tip = match[3].trim();
        const copy = part.replace(/\[SENTIMENT:.*?\]/gi, '').trim();

        const radarData = [
          { subject: 'PSICOLOGIA', A: metrics[0] || 50, fullMark: 100 },
          { subject: 'URGÊNCIA', A: metrics[1] || 50, fullMark: 100 },
          { subject: 'CLAREZA', A: metrics[2] || 50, fullMark: 100 },
          { subject: 'VALOR', A: metrics[3] || 50, fullMark: 100 },
          { subject: 'PROVA', A: metrics[4] || 50, fullMark: 100 },
        ];

        return { copy, score: totalScore, radarData, tip };
      }

      return { copy: part.replace(/\[SENTIMENT:.*?\]/gi, '').trim(), score: 50 };
    });
  }

  // Default: split by ---
  return text.split('---').map(s => s.trim()).filter(Boolean);
}
