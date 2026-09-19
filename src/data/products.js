import { pixDiscount } from '../utils/format'

/**
 * Fonte única de dados dos produtos.
 *
 * Para trocar por produtos reais:
 *  1. Coloque as imagens em `public/products/` (ex.: `void-1.jpg`).
 *  2. Atualize o array `images` abaixo com os caminhos (`/products/void-1.jpg`).
 *  3. Ajuste nome, categoria, preço, tamanhos, cores e descrição.
 *
 * Nenhum componente precisa ser alterado — tudo é lido a partir daqui.
 */

const RAW_PRODUCTS = [
  {
    id: 1,
    slug: 'void',
    name: 'VOID',
    subtitle: 'Camiseta Oversized',
    category: 'Camisetas',
    price: 249,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Grafite'],
    images: ['/products/void-1.svg', '/products/void-2.svg'],
    description:
      'Camiseta oversized em algodão pesado de toque seco. Modelagem ampla nos ombros, gola reforçada e barra com queda reta. A peça base do guarda-roupa NØCT.',
    details: ['100% algodão pesado 240g', 'Modelagem oversized', 'Gola dupla reforçada', 'Produção nacional'],
    isNew: true,
    sales: 128,
  },
  {
    id: 2,
    slug: 'monolith',
    name: 'MONOLITH',
    subtitle: 'Calça Cargo',
    category: 'Calças',
    price: 329,
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Preto', 'Grafite'],
    images: ['/products/monolith-1.svg', '/products/monolith-2.svg'],
    description:
      'Calça cargo de estrutura firme com bolsos utilitários e cós ajustável. Corte relaxado que acompanha o movimento sem perder a forma.',
    details: ['Twill de algodão resistente', 'Bolsos utilitários laterais', 'Cós com ajuste interno', 'Corte relaxado'],
    isNew: true,
    sales: 94,
  },
  {
    id: 3,
    slug: 'fragment',
    name: 'FRAGMENT',
    subtitle: 'Moletom Com Capuz',
    category: 'Moletons',
    price: 389,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Cinza'],
    images: ['/products/fragment-1.svg', '/products/fragment-2.svg'],
    description:
      'Moletom com capuz em moletinho peluciado de interior macio. Capuz estruturado, bolso canguru e acabamento minimalista sem estampas.',
    details: ['Moletinho peluciado 380g', 'Capuz forrado', 'Bolso canguru', 'Punhos e barra canelados'],
    isNew: false,
    sales: 210,
  },
  {
    id: 4,
    slug: 'ashes',
    name: 'ASHES',
    subtitle: 'Camiseta Manga Longa',
    category: 'Camisetas',
    price: 219,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto'],
    images: ['/products/ashes-1.svg', '/products/ashes-2.svg'],
    description:
      'Manga longa de caimento solto, ideal para composições em camadas. Malha densa e silhueta alongada com punhos discretos.',
    details: ['Malha de algodão 220g', 'Silhueta alongada', 'Punhos discretos', 'Sem estampas'],
    isNew: false,
    sales: 67,
  },
  {
    id: 5,
    slug: 'nocturne',
    name: 'NOCTURNE',
    subtitle: 'Jaqueta Bomber',
    category: 'Jaquetas',
    price: 549,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto'],
    images: ['/products/nocturne-1.svg', '/products/nocturne-2.svg'],
    description:
      'Jaqueta bomber de volume controlado com forro interno e fechamento em zíper metálico. A peça de impacto do editorial NØCT.',
    details: ['Tecido técnico matte', 'Forro interno acetinado', 'Zíper metálico', 'Punhos e barra canelados'],
    isNew: true,
    sales: 51,
  },
  {
    id: 6,
    slug: 'relic',
    name: 'RELIC',
    subtitle: 'Bermuda Sarja',
    category: 'Bermudas',
    price: 279,
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Preto', 'Grafite'],
    images: ['/products/relic-1.svg', '/products/relic-2.svg'],
    description:
      'Bermuda de sarja com comprimento acima do joelho e cintura média. Estrutura limpa, sem lavagens artificiais.',
    details: ['Sarja de algodão', 'Comprimento acima do joelho', 'Passantes largos', 'Bolsos faca + relógio'],
    isNew: false,
    sales: 88,
  },
  {
    id: 7,
    slug: 'obsidian',
    name: 'OBSIDIAN',
    subtitle: 'Camiseta Box Fit',
    category: 'Camisetas',
    price: 259,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Grafite', 'Off-white'],
    images: ['/products/obsidian-1.svg', '/products/obsidian-2.svg'],
    description:
      'Camiseta box fit de ombro reto e comprimento reduzido. Construção em algodão premium com costura aparente no acabamento.',
    details: ['Algodão premium 230g', 'Box fit ombro reto', 'Costura de acabamento aparente', 'Pré-encolhida'],
    isNew: false,
    sales: 143,
  },
  {
    id: 8,
    slug: 'decay',
    name: 'DECAY',
    subtitle: 'Calça Reta',
    category: 'Calças',
    price: 319,
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Preto'],
    images: ['/products/decay-1.svg', '/products/decay-2.svg'],
    description:
      'Calça reta de perna ampla e caimento fluido. Cintura alta, pregas frontais discretas e barra sem acabamento aparente.',
    details: ['Tecido de caimento fluido', 'Cintura alta', 'Pregas frontais', 'Barra reta'],
    isNew: false,
    sales: 76,
  },
  {
    id: 9,
    slug: 'grave',
    name: 'GRAVE',
    subtitle: 'Moletom Zíper',
    category: 'Moletons',
    price: 429,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Cinza'],
    images: ['/products/grave-1.svg', '/products/grave-2.svg'],
    description:
      'Moletom de zíper integral em malha pesada. Gola alta, bolsos embutidos e silhueta limpa para uso em camadas.',
    details: ['Malha pesada 400g', 'Zíper integral', 'Gola alta', 'Bolsos embutidos'],
    isNew: true,
    sales: 39,
  },
]

export const products = RAW_PRODUCTS.map((product) => ({
  ...product,
  pixPrice: pixDiscount(product.price, 0.05),
}))

export const categories = [...new Set(products.map((p) => p.category))]
export const allSizes = [...new Set(products.flatMap((p) => p.sizes))]
export const allColors = [...new Set(products.flatMap((p) => p.colors))]

export const priceRanges = [
  { label: 'Até R$ 250', min: 0, max: 250 },
  { label: 'R$ 250 — R$ 350', min: 250, max: 350 },
  { label: 'R$ 350 — R$ 450', min: 350, max: 450 },
  { label: 'Acima de R$ 450', min: 450, max: Infinity },
]

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id) {
  return products.find((p) => p.id === Number(id))
}
