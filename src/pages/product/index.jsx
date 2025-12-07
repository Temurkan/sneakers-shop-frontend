// src/pages/ProductPage.jsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '@/api'
import Button from '@/components/button'
import ProductCard from '@/components/product-card/index.jsx'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])

  // ✅ Загружаем текущий товар
  useEffect(() => {
    if (!id) return

    async function loadProduct() {
      try {
        const res = await api.get(`products/${id}/`)
        setProduct(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    loadProduct()
  }, [id])

  useEffect(() => {
    if (!product) return

    loadRelated()
  }, [product])

  async function loadRelated() {
    try {
      // ✅ Берём ВСЕ товары
      const res = await api.get('/products/')

      // ✅ Убираем:
      // 1. текущий товар
      // 2. ВСЮ его категорию
      const filtered = res.data.filter(
        (item) =>
          item.id !== product.id && item.category.slug !== product.category.slug
      )

      // ✅ Берём по 1 случайному товару из каждой категории
      const randomFromEach = pickRandomFromEachCategory(filtered)

      setRelated(randomFromEach)
    } catch (err) {
      console.error(err)
    }
  }

  function pickRandomFromEachCategory(products) {
    const map = {}

    products.forEach((p) => {
      const slug = p.category.slug

      if (!map[slug]) {
        map[slug] = []
      }

      map[slug].push(p)
    })

    return Object.values(map)
      .map((arr) => arr[Math.floor(Math.random() * arr.length)])
      .filter(Boolean)
  }

  if (!product) return <p>Loading...</p>

  return (
    <div className='container mx-auto px-4 space-y-20'>
      <div className='grid grid-flow-col justify-center items-center gap-0'>
        <div className='flex flex-col w-[600px] items-center'>
          <img
            src={`http://127.0.0.1:8000/${product.images[0].image}`}
            alt={product.name}
            className='w-full max-w-xl h-96 object-contain'
          />
          <p className='underline text-sm'>Смотреть альбом</p>

          <div className='flex mt-6 text-sm justify-between w-[500px]'>
            <span>
              <p className='font-semibold'>Все еще не решили?</p>
              <p>
                Добавьте этот элемент в список и легко вернитесь к нему позже.
              </p>
            </span>

            <img className='size-8' src='/icons/save.svg' alt='save' />
          </div>
        </div>

        <div className='w-[500px] space-y-5'>
          <h1 className='text-3xl font-medium break-word leading-12'>
            {product.brand.name} {product.name}
          </h1>

          <p className='text-2xl'>
            {Math.floor(product.price).toLocaleString()} сум
          </p>

          <div className='flex items-center gap-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <img className='size-6' key={i} src='/star.svg' alt='star' />
            ))}
            <span className='text-xs text-gray-400 ml-1'>
              ({product.rating})
            </span>
          </div>

          <p className='flex flex-wrap gap-2'>
            {product.sizes?.map((s) => (
              <p
                key={s.id}
                className='size-14 bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer'
              >
                {s.size}
              </p>
            ))}
          </p>

          <p className='text-xs underline'>Как измерить размер ноги?</p>

          <Button>Добавить в корзину</Button>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className='text-2xl font-semibold mb-6'>Завершить образ</h2>
          <div className='grid grid-cols-4 gap-4'>
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
