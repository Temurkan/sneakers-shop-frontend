import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/api'
import ProductCard from '@/components/product-card'
import Filters from '@/components/filter'

export default function CategoryPage() {
  const { id } = useParams()

  // Состояния
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(null)
  const [allProducts, setAllProducts] = useState([]) // Все продукты категории
  const [filteredProducts, setFilteredProducts] = useState([]) // Текущие (отображаемые)
  const [allBrands, setAllBrands] = useState([])

  // Загрузка данных
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [catRes, prodRes, brandRes] = await Promise.all([
          api.get(`categories/${id}/`),
          api.get('products/'),
          api.get('/brands/'),
        ])

        setCategory(catRes.data)

        // 1. Берем продукты только этой категории
        const categoryProducts = prodRes.data.filter(
          (p) => p.category?.id === Number(id)
        )
        setAllProducts(categoryProducts)
        setFilteredProducts(categoryProducts) // Изначально показываем все
        setAllBrands(brandRes.data)
      } catch (error) {
        console.error('Ошибка загрузки:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  // --- ВЫЧИСЛЕНИЕ ОПЦИЙ ФИЛЬТРА (useMemo для производительности) ---
  // Мы вычисляем доступные размеры/цвета/бренды на основе ВСЕХ продуктов категории,
  // чтобы фильтры не исчезали, когда вы выбираете один из параметров.
  const filterOptions = useMemo(() => {
    const brandsSet = new Set()
    const sizesSet = new Set()
    const materialsSet = new Set() // <-- Сбор материалов
    const colorsSet = new Set()

    allProducts.forEach((p) => {
      if (p.brand?.id) brandsSet.add(p.brand.id)

      p.sizes?.forEach((s) => {
        if (s.stock > 0) sizesSet.add(s.size)
      })

      if (p.material) materialsSet.add(p.material) // <-- Добавляем материал

      if (p.color_hex) colorsSet.add(p.color_hex)
    })
    const availableBrands = allBrands.filter((b) => brandsSet.has(b.id))

    return {
      brands: availableBrands,
      sizes: Array.from(sizesSet).sort((a, b) => a - b || a.localeCompare(b)),
      materials: Array.from(materialsSet), // <-- Передаем в options
      colors: Array.from(colorsSet),
    }
  }, [allProducts, allBrands])
  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  const handleFilter = (filters) => {
    const result = allProducts.filter((p) => {
      // Пол
      if (filters.gender.length > 0 && !filters.gender.includes(p.gender))
        return false

      // Бренд
      if (filters.brand.length > 0 && !filters.brand.includes(p.brand.id))
        return false
      if (
        filters.material.length > 0 &&
        !filters.material.includes(p.material)
      ) {
        return false
      }

      // Размер (если выбран хоть один размер, у продукта он должен быть в наличии)
      if (filters.size.length > 0) {
        const productHasSize = p.sizes.some(
          (s) => s.stock > 0 && filters.size.includes(s.size)
        )
        if (!productHasSize) return false
      }

      // Цвет
      if (
        filters.color_hex.length > 0 &&
        !filters.color_hex.includes(p.color_hex)
      )
        return false

      // Материал
      if (filters.material.length > 0 && !filters.material.includes(p.material))
        return false

      // Цена
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false

      return true
    })

    setFilteredProducts(result)
  }

  if (loading)
    return <div className='p-10 text-center'>Загрузка товаров...</div>
  if (!category)
    return <div className='p-10 text-center'>Категория не найдена</div>

  return (
    <main className='container mx-auto max-w-7xl px-2 md:px-4 py-8 flex flex-col md:flex-row gap-8 items-start'>
      <div className='w-full md:w-64 shrink-0 md:sticky md:top-4'>
        <Filters onFilter={handleFilter} options={filterOptions} />
      </div>

      <div className='flex-1 w-full'>
        <h1 className='text-2xl font-bold mb-6'>
          {category.name}{' '}
          <span className='text-gray-400 text-sm font-normal'>
            ({filteredProducts.length} товаров)
          </span>
        </h1>

        {filteredProducts.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr'>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className='text-center py-20 text-gray-500 bg-gray-50 rounded-lg'>
            По вашим фильтрам ничего не найдено. Попробуйте сбросить параметры.
          </div>
        )}
      </div>
    </main>
  )
}
