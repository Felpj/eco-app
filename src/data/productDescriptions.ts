/**
 * Descrições por produto — texto editorial para a PDP
 */

export const productDescriptions: Record<string, string> = {
  "club-de-nuit-iconic-armaf": `Uma interpretação sofisticada que captura a essência azul e fresca. Club de Nuit Iconic combina notas cítricas vibrantes com um coração floral elegante e uma base amadeirada que prolonga a fragrância por horas. Ideal para quem busca versatilidade e presença sem exageros.`,
  "club-de-nuit-intense-armaf": `A fragrância que conquistou o mundo. Club de Nuit Intense traz a assinatura frutada e amadeirada em uma fórmula concentrada que projeta com intensidade. Bergamota e maçã no topo, um coração de birch e jasmim, e uma base de musk e âmbar que fixa por até 12 horas.`,
  "club-de-nuit-milestone-armaf": `Frescura marinha e sofisticação em uma única fragrância. Club de Nuit Milestone une notas aquáticas salinas a um coração floral delicado, criando uma aura leve e elegante. Perfeito para o dia a dia e climas quentes.`,
  "club-de-nuit-precieux-i-armaf": `A versão mais intensa e refinada. Precieux I. eleva a pirâmide com pimenta rosa e lavanda, um coração mais denso e uma base que prolonga a experiência. Para quem busca impacto e durabilidade.`,
  "club-de-nuit-urban-elixir-armaf": `O elixir urbano que combina especiarias e lavanda em uma composição moderna. Projeção forte e fixação excepcional para quem não passa despercebido.`,
  "yum-yum-armaf": `Doce, cremoso e irresistível. Yum Yum abre com pistache e framboesa, evolui para um coração floral e fecha em baunilha e musk. Uma fragrância gourmand que conquista pelo conforto.`,
  "khamrah-lattafa": `O clássico gourmand árabe. Canela, rum e noz-moscada no topo, flor de laranjeira e heliotrópio no coração, âmbar e baunilha na base. Uma fragrância quente e envolvente para noites especiais.`,
  "khamrah-qahwa-lattafa": `Khamrah com uma dose extra de café. A combinação de café, cardamomo e canela cria uma experiência aromática única — doce, quente e viciante.`,
  "asad-lattafa": `Especiado, intenso e marcante. Asad traz lavanda e pimenta no topo, gerânio e cravo no coração, e uma base de âmbar e vetiver. Projeção forte e personalidade inconfundível.`,
  "fakhar-black-lattafa": `Fresco, versátil e elegante. Fakhar Black equilibra notas cítricas e aromáticas em uma composição que funciona do dia à noite.`,
  "yara-lattafa": `Doce, cremoso e feminino. Yara une pêssego, framboesa e bergamota a um coração floral e uma base de baunilha e musk. Conforto em forma de fragrância.`,
  "yara-moi-lattafa": `A evolução sofisticada. Yara Moi traz lavanda e íris para um perfil mais elegante, mantendo a doçura característica da linha.`,
  "badee-noble-blush-lattafa": `Rosa e pêssego em harmonia. Noble Blush é floral, suave e feminino — ideal para quem busca delicadeza com personalidade.`,
  "ana-a-rouge-lattafa": `Açafrão, jasmim e âmbar em uma composição intensa. Ana A. Rouge é ousada e memorável.`,
  "ana-abiyedh-lattafa": `Frutado, solar e unissex. Bergamota, melão e pêssego abrem para um coração floral e uma base amadeirada.`,
  "al-nashama-caprice-lattafa": `Azul, fresco e versátil. Caprice combina gengibre e lavanda em uma fragrância moderna para o dia a dia.`,
  "al-noble-safeer-lattafa": `Oud, rosa e especiarias em uma composição oriental sofisticada. Safeer é intenso e envolvente.`,
  "royal-blue-orientica": `Premium e versátil. Royal Blue traz a sofisticação de um fougère moderno com projeção equilibrada.`,
  "luxury-royal-amber-orientica": `Frutado, âmbar e solar. Luxury Royal Amber é a assinatura da casa — elegante e memorável.`,
  "velvet-gold-orientica": `Baunilha, âmbar e um toque dourado. Velvet Gold é luxuoso e feminino.`,
  "amber-noir-orientica": `Amadeirado, sândalo e musk. Amber Noir traz profundidade e mistério.`,
  "amber-rouge-orientica": `Açafrão, jasmim e âmbar em uma composição icônica. Amber Rouge é intenso e envolvente.`,
  "watani-purple-al-wataniah-french-avenue": `Floral, elegante e feminino. Watani Purple une cassis, rosa e íris em uma fragrância sofisticada.`,
  "shagaf-al-ward-al-wataniah-french-avenue": `Rosa e pêssego em harmonia. Shagaf Al Ward é floral, doce e memorável.`,
  "durrat-al-aroos-al-wataniah-french-avenue": `Frutado, solar e doce. Durrat Al Aroos traz a assinatura Erba Pura em uma fórmula acessível.`,
  "ameerati-al-wataniah-french-avenue": `Floral e feminino. Ameerati combina elegância e personalidade.`,
  "royal-blend-al-wataniah-french-avenue": `Gourmand e envolvente. Royal Blend une canela, rum e baunilha em uma fragrância quente.`,
  "spectre-ghost-al-wataniah-french-avenue": `Especiado, oud e rosa. Spectre Ghost é intenso e premium.`,
  "vulcan-feu-al-wataniah-french-avenue": `Amadeirado e intenso. Vulcan Feu projeta com presença.`,
  "vulcan-sable-al-wataniah-french-avenue": `Amadeirado e versátil. Vulcan Sable equilibra intensidade e wearability.`,
  "veneno-bianco-al-wataniah-french-avenue": `Premium, intenso e memorável. Veneno Bianco é uma declaração de estilo.`,
};

const DEFAULT_DESCRIPTION = `Perfumaria árabe autêntica com fórmula concentrada, fixação prolongada e projeção equilibrada. Uma fragrância que combina tradição oriental com qualidade acessível.`;

export function getProductDescription(slug: string): string {
  return productDescriptions[slug] ?? DEFAULT_DESCRIPTION;
}
