/**
 * Gera imagens placeholders (SVG) para os produtos em `public/products/`.
 *
 * Uso: `npm run generate:placeholders`
 *
 * Substitua os arquivos gerados pelas fotos reais mantendo o mesmo nome
 * (ex.: `void-1.svg` -> `void-1.jpg`) e atualize `src/data/products.js`.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '../public/products')

const BG_FRONT = '#f2f2f2'
const BG_BACK = '#e9e9e9'
const INK = '#171717'

const poly = (points) => `M${points.map(([x, y]) => `${x} ${y}`).join(' L')} Z`

const SHAPES = {
  tee: {
    layers: [
      {
        d: poly([
          [300, 180],
          [352, 178],
          [400, 208],
          [448, 178],
          [500, 180],
          [556, 232],
          [586, 322],
          [508, 322],
          [494, 348],
          [494, 812],
          [306, 812],
          [306, 348],
          [292, 322],
          [214, 322],
          [244, 232],
        ]),
      },
    ],
  },
  longsleeve: {
    layers: [
      {
        d: poly([
          [300, 180],
          [352, 178],
          [400, 208],
          [448, 178],
          [500, 180],
          [556, 230],
          [566, 650],
          [500, 650],
          [494, 352],
          [494, 812],
          [306, 812],
          [306, 352],
          [300, 650],
          [234, 650],
          [244, 230],
        ]),
      },
    ],
  },
  hoodie: {
    layers: [
      {
        d: 'M330 192 C330 120 360 92 400 92 C440 92 470 120 470 192 C450 176 425 168 400 168 C375 168 350 176 330 192 Z',
      },
      {
        d: poly([
          [300, 190],
          [352, 188],
          [400, 215],
          [448, 188],
          [500, 190],
          [560, 236],
          [572, 660],
          [500, 660],
          [496, 360],
          [496, 800],
          [304, 800],
          [304, 360],
          [300, 660],
          [228, 660],
          [240, 236],
        ]),
      },
      { d: poly([[330, 610], [470, 610], [470, 712], [430, 736], [370, 736], [330, 712]]), cut: true },
    ],
  },
  ziphoodie: {
    layers: [
      {
        d: 'M330 192 C330 120 360 92 400 92 C440 92 470 120 470 192 C450 176 425 168 400 168 C375 168 350 176 330 192 Z',
      },
      {
        d: poly([
          [300, 190],
          [352, 188],
          [400, 215],
          [448, 188],
          [500, 190],
          [560, 236],
          [572, 660],
          [500, 660],
          [496, 360],
          [496, 800],
          [304, 800],
          [304, 360],
          [300, 660],
          [228, 660],
          [240, 236],
        ]),
      },
      { rect: [393, 196, 14, 604], cut: true },
      { d: 'M360 200 L396 250 L440 200', cut: true, stroke: true },
    ],
  },
  jacket: {
    layers: [
      {
        d: poly([
          [300, 190],
          [352, 188],
          [400, 220],
          [448, 188],
          [500, 190],
          [562, 232],
          [574, 640],
          [500, 640],
          [496, 356],
          [496, 790],
          [304, 790],
          [304, 356],
          [300, 640],
          [226, 640],
          [238, 232],
        ]),
      },
      { d: 'M356 200 L400 258 L444 200', cut: true, stroke: true },
      { rect: [394, 200, 12, 560], cut: true },
      { rect: [304, 752, 192, 10], cut: true },
    ],
  },
  pants: {
    layers: [
      {
        d: poly([
          [300, 170],
          [500, 170],
          [516, 300],
          [506, 850],
          [428, 850],
          [400, 560],
          [372, 850],
          [294, 850],
          [284, 300],
        ]),
      },
      { rect: [300, 196, 200, 10], cut: true },
    ],
  },
  cargo: {
    layers: [
      {
        d: poly([
          [300, 170],
          [500, 170],
          [516, 300],
          [506, 850],
          [428, 850],
          [400, 560],
          [372, 850],
          [294, 850],
          [284, 300],
        ]),
      },
      { rect: [300, 196, 200, 10], cut: true },
      { rect: [296, 380, 58, 104], cut: true, stroke: true },
      { rect: [446, 380, 58, 104], cut: true, stroke: true },
    ],
  },
  shorts: {
    layers: [
      {
        d: poly([
          [300, 170],
          [500, 170],
          [516, 310],
          [512, 520],
          [430, 520],
          [400, 410],
          [370, 520],
          [288, 520],
          [284, 310],
        ]),
      },
      { rect: [300, 196, 200, 12], cut: true },
    ],
  },
}

function shapeSvg(shape, bg) {
  const paths = shape.layers
    .map((layer) => {
      if (layer.rect) {
        const [x, y, w, h] = layer.rect
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}" rx="4"/>`
      }
      if (layer.stroke) {
        return `<path d="${layer.d}" fill="none" stroke="${bg}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>`
      }
      if (layer.cut) {
        return `<path d="${layer.d}" fill="${bg}"/>`
      }
      return `<path d="${layer.d}" fill="${INK}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img"><rect width="800" height="1000" fill="${bg}"/>${paths}</svg>\n`
}

const PRODUCT_SHAPES = {
  'void-1': 'tee',
  'void-2': 'tee',
  'monolith-1': 'cargo',
  'monolith-2': 'cargo',
  'fragment-1': 'hoodie',
  'fragment-2': 'hoodie',
  'ashes-1': 'longsleeve',
  'ashes-2': 'longsleeve',
  'nocturne-1': 'jacket',
  'nocturne-2': 'jacket',
  'relic-1': 'shorts',
  'relic-2': 'shorts',
  'obsidian-1': 'tee',
  'obsidian-2': 'tee',
  'decay-1': 'pants',
  'decay-2': 'pants',
  'grave-1': 'ziphoodie',
  'grave-2': 'ziphoodie',
}

mkdirSync(OUT_DIR, { recursive: true })

for (const [name, shapeKey] of Object.entries(PRODUCT_SHAPES)) {
  const isSecond = name.endsWith('-2')
  const shape = SHAPES[shapeKey]
  const bg = isSecond ? BG_BACK : BG_FRONT

  const svg = isSecond
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img"><rect width="800" height="1000" fill="${bg}"/><g transform="translate(800,0) scale(-1,1)">${shapeSvg(shape, bg)
        .replace(/^<svg[^>]*>/, '')
        .replace(/<\/svg>\n?$/, '')}</g></svg>\n`
    : shapeSvg(shape, bg)

  writeFileSync(resolve(OUT_DIR, `${name}.svg`), svg)
}

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#111111"/><text x="32" y="43" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="#ffffff" text-anchor="middle">Ø</text></svg>\n`
writeFileSync(resolve(__dirname, '../public/favicon.svg'), favicon)

console.log(`Gerados ${Object.keys(PRODUCT_SHAPES).length} placeholders + favicon em public/.`)
