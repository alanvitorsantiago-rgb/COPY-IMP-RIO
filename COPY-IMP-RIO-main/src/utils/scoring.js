// ─── Premium Conversion Score Engine ─────────────────────────────────────────────

export function calcScore(text, platform = "instagram") {
  let score = 25; // Base lower for premium feeling
  const lower = text.toLowerCase();

  // 1. Call to Action (CTA) - Vital para conversão
  const ctaWords = [
    "clique", "acesse", "compre", "aproveite", "garanta", "entre em contato",
    "saiba mais", "link na bio", "manda mensagem", "fale conosco", "cadastre", 
    "baixe", "inscreva-se", "reserve", "garanta sua vaga"
  ];
  const hasCTA = ctaWords.some(w => lower.includes(w));
  if (hasCTA) score += 25;

  // 2. Emotional Hooks & Power Words
  const powerWords = [
    "transforme", "conquiste", "sonho", "liberdade", "sucesso", "mude sua vida",
    "resultados", "incrível", "poderoso", "exclusivo", "especial", "secreto",
    "revelado", "finalmente", "estratégia", "lucro", "escassez"
  ];
  const powerWordCount = powerWords.filter(w => lower.includes(w)).length;
  score += Math.min(powerWordCount * 4, 16);

  // 3. Urgência e Escassez
  const urgency = [
    "hoje", "agora", "últimas", "vagas", "limitado", "promoção", "só até",
    "não perca", "última chance", "restam", "encerra", "imediato"
  ];
  if (urgency.some(w => lower.includes(w))) score += 12;

  // 4. Emojis (Equilíbrio Premium)
  const emojiCount = (text.match(/\p{Emoji}/gu) || []).length;
  if (emojiCount >= 2 && emojiCount <= 6) score += 10;
  else if (emojiCount > 10) score -= 10; // Excesso tira o ar "Premium"

  // 5. Estrutura e Escaneabilidade
  if (text.includes("\n\n")) score += 8; // Parágrafos curtos ajudam na leitura
  if (text.includes("?")) score += 5; // Perguntas aumentam engajamento

  // 6. Prova Social e Números
  if (/\d+%|\d+ dias|\d+ clientes|\d+ anos|\d+x/i.test(text)) score += 7;

  // 7. Otimização por Plataforma
  const len = text.length;
  const platformBonus = {
    instagram: (len >= 120 && len <= 450),
    whatsapp: (len >= 60 && len <= 250),
    linkedin: (len >= 300 && len <= 800),
    tiktok: (len >= 40 && len <= 180),
    email: (len >= 500),
  };

  if (platformBonus[platform]) score += 12;

  return Math.min(100, Math.max(0, score));
}

export function scoreLabel(score) {
  if (score >= 85) return { label: "Elite", color: "#10B981" };
  if (score >= 70) return { label: "Alta Conversão", color: "#3B82F6" };
  if (score >= 50) return { label: "Média", color: "#F59E0B" };
  return { label: "Baixa", color: "#F43F5E" };
}
