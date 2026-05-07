// ─── App Constants ────────────────────────────────────────────────────────────

export const DAILY_LIMIT = 10;
export const PRO_PRICE = "R$29,90";
export const APP_NAME = "Império Copy";

export const CREDIT_COSTS = {
  standard: 1,
  emotional: 1,
  multistyle: 3,
  score: 2,
  viral: 2,
};

export const NICHES = [
  { id: "dropshipping", label: "📦 Dropshipping", prompt: "loja de dropshipping/e-commerce" },
  { id: "infoproduto", label: "🎓 Infoproduto", prompt: "curso online/infoproduto/mentoria" },
  { id: "moda", label: "👗 Moda", prompt: "loja de moda/roupas/acessórios" },
  { id: "restaurante", label: "🍕 Restaurante", prompt: "restaurante/lanchonete/delivery" },
  { id: "fitness", label: "💪 Fitness", prompt: "academia/personal trainer/nutrição" },
  { id: "beleza", label: "💄 Beleza", prompt: "salão de beleza/estética/cosméticos" },
  { id: "imoveis", label: "🏠 Imóveis", prompt: "imobiliária/corretor de imóveis" },
  { id: "servicos", label: "🔧 Serviços", prompt: "prestador de serviços locais" },
  { id: "saas", label: "💻 SaaS/Tech", prompt: "empresa de tecnologia/software/app" },
  { id: "saude", label: "🏥 Saúde", prompt: "clínica/médico/farmácia/bem-estar" },
  { id: "pet", label: "🐾 Pet Shop", prompt: "pet shop/veterinário/produtos pet" },
  { id: "juridico", label: "⚖️ Jurídico", prompt: "escritório de advocacia/advogado" },
];

export const TONES = [
  { id: "urgente", label: "🔥 Urgente", desc: "Senso de urgência e escassez" },
  { id: "persuasivo", label: "🎯 Persuasivo", desc: "Convence com argumentos sólidos" },
  { id: "emocional", label: "💝 Emocional", desc: "Conexão e empatia profunda" },
  { id: "autoridade", label: "👑 Autoridade", desc: "Expert e referência no mercado" },
  { id: "divertido", label: "😄 Divertido", desc: "Leve, bem-humorado e viral" },
  { id: "premium", label: "💎 Premium", desc: "Luxo, exclusividade e status" },
  { id: "simples", label: "🤝 Direto", desc: "Direto ao ponto, sem rodeios" },
  { id: "inspirador", label: "✨ Inspirador", desc: "Motiva e transforma" },
];

export const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "facebook", label: "Facebook", icon: "👥" },
  { id: "email", label: "E-mail", icon: "📧" },
];

export const MODES = [
  { id: "standard", label: "⚡ Padrão", desc: "3 copies únicas e poderosas", credits: 1, free: true },
  { id: "emotional", label: "🧠 Emocional", desc: "Focado na intenção emocional alvo", credits: 1, free: true },
  { id: "multistyle", label: "🎭 Multi-Estilo", desc: "1 copy em 4 estilos diferentes", credits: 3, free: false },
  { id: "score", label: "📊 Score Mode", desc: "Copies com análise de conversão", credits: 2, free: false },
  { id: "viral", label: "🚀 Viral Mode", desc: "Otimizado para engajamento máximo", credits: 2, free: false },
  { id: "calendar", label: "📅 Calendário 30 Dias", desc: "Plano estratégico completo para o mês", credits: 5, free: false },
  { id: "mirror", label: "🪞 Modo Espelho", desc: "IA que aprende e replica seu estilo", credits: 3, free: false },
];



export const EMOTIONAL_INTENTS = [
  { id: "venda", label: "💰 Venda Direta", desc: "Foco em converter agora" },
  { id: "urgencia", label: "⏰ Urgência", desc: "Cria senso de tempo limitado" },
  { id: "autoridade", label: "🏆 Autoridade", desc: "Posiciona como referência" },
  { id: "escassez", label: "🔒 Escassez", desc: "Produto/vaga limitada" },
  { id: "curiosidade", label: "🤔 Curiosidade", desc: "Instiga a saber mais" },
  { id: "medo_perder", label: "😰 FOMO", desc: "Medo de ficar de fora" },
];

export const TEMPLATES = [
  {
    id: "drop_lancamento",
    niche: "dropshipping",
    tone: "urgente",
    platform: "instagram",
    label: "🚀 Lançamento de Produto",
    topic: "Novo produto chegou! Oferta de lançamento com 40% OFF somente nas primeiras 24h",
    preview: "Lançamento explosivo com oferta relâmpago",
    isPro: false,
  },
  {
    id: "info_webinar",
    niche: "infoproduto",
    tone: "inspirador",
    platform: "instagram",
    label: "🎓 Webinar Gratuito",
    topic: "Webinar gratuito sobre como sair do zero e faturar R$5.000 por mês trabalhando de casa",
    preview: "Copy para divulgar aula online gratuita",
    isPro: false,
  },
  {
    id: "beleza_promo",
    niche: "beleza",
    tone: "emocional",
    platform: "whatsapp",
    label: "💄 Promoção Relâmpago",
    topic: "Promoção de terça-feira: procedimento capilar com 30% de desconto, somente hoje",
    preview: "Promo rápida para WhatsApp Status",
    isPro: false,
  },
  {
    id: "fitness_antes_depois",
    niche: "fitness",
    tone: "inspirador",
    platform: "instagram",
    label: "💪 Antes e Depois",
    topic: "Resultado real de aluna que perdeu 15kg em 3 meses com nosso método exclusivo",
    preview: "Copy de prova social e resultado",
    isPro: true,
  },
  {
    id: "imoveis_exclusivo",
    niche: "imoveis",
    tone: "premium",
    platform: "instagram",
    label: "🏠 Imóvel Exclusivo",
    topic: "Apartamento de alto padrão no Itaim Bibi, 180m², vista panorâmica, pronto para morar",
    preview: "Copy premium para imóvel de luxo",
    isPro: true,
  },
  {
    id: "restaurante_delivery",
    niche: "restaurante",
    tone: "divertido",
    platform: "instagram",
    label: "🍕 Delivery Especial",
    topic: "Promoção de fim de semana: combo familiar com sobremesa grátis e frete grátis acima de R$60",
    preview: "Copy animada para delivery",
    isPro: true,
  },
];
