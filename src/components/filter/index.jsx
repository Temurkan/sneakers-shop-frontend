import { useEffect, useState } from 'react'
import Button from '@/components/button'

export default function Filters({ onFilter, options }) {
  // Получаем materials из опций
  const { brands = [], sizes = [], materials = [], colors = [] } = options

  const [filters, setFilters] = useState({
    gender: [],
    brand: [],
    size: [],
    material: [], // Добавлено состояние для материала
    color_hex: [],
    minPrice: '',
    maxPrice: '',
  })

  // Отправляем изменения наверх
  useEffect(() => {
    onFilter(filters)
  }, [filters])

  const toggleFilter = (field, value) => {
    setFilters((prev) => {
      const currentList = prev[field]
      const newList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value]

      return { ...prev, [field]: newList }
    })
  }

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      gender: [],
      brand: [],
      size: [],
      material: [],
      color_hex: [],
      minPrice: '',
      maxPrice: '',
    })
  }

  return (
    <div className='bg-white p-5 space-y-6'>
      {/* --- ЦЕНА --- */}
      <div>
        <h3 className='font-bold text-gray-900 mb-3'>Цена</h3>
        <div className='flex gap-2 items-center'>
          <input
            type='number'
            name='minPrice'
            placeholder='От'
            className='w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-black outline-none'
            value={filters.minPrice}
            onChange={handlePriceChange}
          />
          <span className='text-gray-400'>-</span>
          <input
            type='number'
            name='maxPrice'
            placeholder='До'
            className='w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-black outline-none'
            value={filters.maxPrice}
            onChange={handlePriceChange}
          />
        </div>
      </div>

      <hr className='border-gray-100' />

      {/* --- ПОЛ --- */}
      <div>
        <h3 className='font-bold text-gray-900 mb-3'>Пол</h3>
        <div className='space-y-2'>
          {['male', 'female'].map((g) => (
            <label
              key={g}
              className='flex items-center gap-2 cursor-pointer hover:text-gray-600'
            >
              <input
                type='checkbox'
                className='border-gray-300 text-black focus:ring-black accent-black'
                checked={filters.gender.includes(g)}
                onChange={() => toggleFilter('gender', g)}
              />
              <span className='text-sm'>
                {g === 'male' ? 'Мужской' : 'Женский'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className='border-gray-100' />

      {/* --- БРЕНД --- */}
      {brands.length > 0 && (
        <div>
          <h3 className='font-bold text-gray-900 mb-3'>Бренд</h3>
          <div className='max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar'>
            {brands.map((brand) => (
              <label
                key={brand.id}
                className='flex items-center gap-2 cursor-pointer hover:text-gray-600'
              >
                <input
                  type='checkbox'
                  className='rounded border-gray-300 text-black focus:ring-black accent-black'
                  checked={filters.brand.includes(brand.id)}
                  onChange={() => toggleFilter('brand', brand.id)}
                />
                <span className='text-sm'>{brand.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* --- РАЗМЕР --- */}
      {sizes.length > 0 && (
        <div>
          <h3 className='font-bold text-gray-900 mb-3'>Размер</h3>
          <div className='flex flex-wrap gap-2'>
            {sizes.map((size) => {
              const isActive = filters.size.includes(size)
              return (
                <div
                  key={size}
                  onClick={() => toggleFilter('size', size)}
                  className={`
                    size-8 flex justify-center items-center
                    text-xs cursor-pointer transition-colors
                    ${
                      isActive
                        ? 'bg-gray-200 text-black'
                        : 'bg-gray-50 text-black hover:bg-gray-100'
                    }
                  `}
                >
                  {size}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* --- МАТЕРИАЛ (НОВОЕ) --- */}
      {materials.length > 0 && (
        <>
          <hr className='border-gray-100' />
          <div>
            <h3 className='font-bold text-gray-900 mb-3'>Материал</h3>
            <div className='space-y-2 max-h-40 overflow-y-auto custom-scrollbar'>
              {materials.map((m) => (
                <label
                  key={m}
                  className='flex items-center gap-2 cursor-pointer hover:text-gray-600'
                >
                  <input
                    type='checkbox'
                    className='border-gray-300 text-black focus:ring-black accent-black'
                    checked={filters.material.includes(m)}
                    onChange={() => toggleFilter('material', m)}
                  />
                  <span className='text-sm capitalize'>{m}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* --- ЦВЕТ --- */}
      {colors.length > 0 && (
        <>
          <hr className='border-gray-100' />
          <div>
            <h3 className='font-bold text-gray-900 mb-3'>Цвет</h3>
            <div className='flex gap-2 flex-wrap'>
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleFilter('color_hex', c)}
                  className={`w-6 h-6 border  transition-transform hover:scale-110 ${
                    filters.color_hex.includes(c)
                      ? 'ring-1 ring-offset-1 ring-black scale-110'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <Button
        onClick={resetFilters}
        className='w-full bg-gray-200 text-black hover:bg-gray-300 mt-4'
      >
        Сбросить все
      </Button>
    </div>
  )
}
