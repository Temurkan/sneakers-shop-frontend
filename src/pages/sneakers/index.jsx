import { api } from '@/api'
import Button from '@/components/button/index.jsx'
import React, { useEffect, useState } from 'react'

export default function SneakersPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadData() {
      const [catRes, prodRes] = await Promise.all([
        api.get('categories/'),
        api.get('products/'),
      ])

      console.log('cats:', catRes.data)
      console.log('products:', prodRes.data)
      setCategories(catRes.data)
      setProducts(prodRes.data)
    }

    loadData()
  }, [])

  return (
    <main className='container mt-24 mx-auto max-w-7xl'>
      <h2 className='mb-6'>Кроссовки</h2>
      <div className='grid grid-cols-5 gap-3'>
        {products
          .filter((p) => p.category.slug === 'sneakers')
          .map((product) => {
            const mainImage =
              product.images.find((i) => i.is_main) || product.images[0]

            return (
              <div key={product.id} className='p-3 bg-gray-50 max-w-[250px]'>
                <div className='h-[150px] flex items-center'>
                  <div className='w-[220px] flex overflow-hidden'>
                    <img
                      className='object-cover'
                      src={`http://127.0.0.1:8000/${mainImage.image}`}
                      alt={product.name}
                    />
                  </div>
                </div>
                <span className='text-xs text-gray-500'>
                  {product.brand.name}
                </span>
                <h3 className='text-sm truncate'>{product.name}</h3>
                <span className='flex my-1'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <img className='w-4' key={i} src='star.svg' alt='star' />
                  ))}
                </span>
                <span className='flex justify-between items-end mb-2'>
                  <span className='text-xl font-medium'>
                    {Math.floor(product.price).toLocaleString()} сум
                  </span>
                  <span className='text-sm'>
                    {product.sizes[0].size}-{product.sizes.slice(-1)[0].size}
                  </span>
                </span>
                <Button>Добавить в корзину</Button>
              </div>
            )
          })}
      </div>
    </main>
  )
}
