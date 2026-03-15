# Produtos sem foto no catálogo

> Produtos do eco-app que usam placeholder — não há imagem correspondente em `public/Perfume-Arabe-fotos`

**Atualizado:** Março 2026

---

## Resumo

| Marca | Qtd sem foto |
|------|--------------|
| LATTAFA | 11 |
| ORIENTICA | 5 |
| **Total** | **16** |

---

## LATTAFA (11)

| Produto | Público | Vol | Inspirado em | Estoque |
|---------|---------|-----|--------------|---------|
| Khamrah | Unissex | 100ml | Angel's Share | ✅ |
| Khamrah Qahwa | Unissex | 100ml | — | ✅ |
| Asad | Masculino | 100ml | Sauvage Elixir | ✅ |
| Fakhar Black | Masculino | 100ml | Y Eau de Parfum | ✅ |
| Yara | Feminino | 100ml | Poison Girl | ✅ |
| Yara Moi | Feminino | 100ml | Marc Jacobs Perfect Intense | ✅ |
| Badee Noble Blush | Feminino | 100ml | Good Girl Blush | ✅ |
| Ana A. Rouge | Feminino | 60ml | Baccarat Rouge 540 Extrait | ✅ |
| Ana Abiyedh | Feminino | 60ml | Erba Pura | Esgotado |
| Al Nashama Caprice | Unissex | 100ml | Bleu Electrique | ✅ |
| Al Noble Safeer | Unissex | 100ml | Oud for Happiness | ✅ |

> **Nota:** Não existe pasta `CASA LATTAFA` em `Perfume-Arabe-fotos`. Ao adicionar as fotos, criar a pasta e atualizar o mapeamento em `src/data/productImages.ts`.

---

## ORIENTICA (5)

| Produto | Público | Vol | Inspirado em | Estoque |
|---------|---------|-----|--------------|---------|
| Royal Blue | Masculino | 80ml | Layton | ✅ |
| Luxury Royal Amber | Unissex | 80ml | Erba Pura | ✅ |
| Velvet Gold | Feminino | 80ml | Gentle Fluidity Gold | ✅ |
| Amber Noir | Unissex | 80ml | Santal 33 | Esgotado |
| Amber Rouge | Feminino | 80ml | Baccarat Rouge 540 Extrait | Esgotado |

> **Nota:** Não existe pasta `CASA ORIENTICA` em `Perfume-Arabe-fotos`. Ao adicionar as fotos, criar a pasta e atualizar o mapeamento em `src/data/productImages.ts`.

---

## Como adicionar fotos

1. Incluir as imagens em `public/Perfume-Arabe-fotos/`:
   - Criar `CASA LATTAFA/` para produtos Lattafa
   - Criar `CASA ORIENTICA/` para produtos Orientica

2. Padrão de nome sugerido: `[NOME] [PÚBLICO]([INSPIRADO])_01.ext`
   - Ex.: `KHAMRAH UNI(ANGELS SHARE)_01.webp`

3. Atualizar `src/data/productImages.ts` com as novas entradas no `PRODUCT_IMAGE_MAP`.

4. Após adicionar, remover o produto desta lista.
