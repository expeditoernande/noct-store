import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { allColors, allSizes, categories, priceRanges } from '../../data/products'
import { colorToHex } from '../../utils/format'

const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'menor', label: 'Menor preço' },
  { value: 'maior', label: 'Maior preço' },
  { value: 'vendidos', label: 'Mais vendidos' },
]

function toggleValue(list, item) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item]
}

function FilterGroup({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] uppercase tracking-label text-muted">{title}</span>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function Check({ checked, onChange, label, swatch }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[11px] text-ink-soft transition-colors duration-200 hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-ink"
      />
      {swatch && (
        <span
          className="h-2.5 w-2.5 rounded-full border border-line"
          style={{ backgroundColor: swatch }}
        />
      )}
      <span>{label}</span>
    </label>
  )
}

export default function ProductFilters({ value, onChange, onClear, resultCount }) {
  const [open, setOpen] = useState(false)

  const activeCount =
    value.categories.length + value.sizes.length + value.colors.length + value.ranges.length

  const update = (partial) => onChange({ ...value, ...partial })

  return (
    <div className="border-b border-line">
      <div className="flex items-center justify-between gap-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-label text-ink transition-opacity duration-200 hover:opacity-50 lg:hidden"
        >
          Filtrar
          {activeCount > 0 && <span className="text-muted">({activeCount})</span>}
          <ChevronDown
            size={14}
            strokeWidth={1.5}
            className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <span className="hidden text-[10px] uppercase tracking-label text-muted lg:block">
          {resultCount} {resultCount === 1 ? 'peça' : 'peças'}
        </span>

        <label className="flex items-center gap-3 text-[10px] uppercase tracking-label text-muted">
          <span className="hidden sm:inline">Ordenar</span>
          <select
            value={value.sort}
            onChange={(event) => update({ sort: event.target.value })}
            className="cursor-pointer border-b border-line bg-transparent py-1 text-[10px] uppercase tracking-label text-ink outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className={`${open ? 'grid' : 'hidden'} grid-cols-2 gap-x-6 gap-y-8 border-t border-line py-6 md:grid-cols-4 lg:grid`}
      >
        <FilterGroup title="Categoria">
          {categories.map((category) => (
            <Check
              key={category}
              label={category}
              checked={value.categories.includes(category)}
              onChange={() => update({ categories: toggleValue(value.categories, category) })}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Tamanho">
          {allSizes.map((size) => (
            <Check
              key={size}
              label={size}
              checked={value.sizes.includes(size)}
              onChange={() => update({ sizes: toggleValue(value.sizes, size) })}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Cor">
          {allColors.map((color) => (
            <Check
              key={color}
              label={color}
              swatch={colorToHex(color)}
              checked={value.colors.includes(color)}
              onChange={() => update({ colors: toggleValue(value.colors, color) })}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Preço">
          {priceRanges.map((range) => (
            <Check
              key={range.label}
              label={range.label}
              checked={value.ranges.includes(range.label)}
              onChange={() => update({ ranges: toggleValue(value.ranges, range.label) })}
            />
          ))}
        </FilterGroup>
      </div>

      {activeCount > 0 && (
        <div className="flex justify-end pb-4">
          <button
            type="button"
            onClick={onClear}
            className="text-[10px] uppercase tracking-label text-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}
