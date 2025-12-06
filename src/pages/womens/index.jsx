import { api } from '@/api'
import ProductCard from '@/components/product-card/index.jsx'
import React, { useEffect, useState } from 'react'

export default function WomensPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadData() {
      const res = await api.get('products/')
      setProducts(res.data)
    }
    loadData()
  }, [])

  return (
    <main className='container mx-auto max-w-7xl px-1 md:px-4'>
      <h2 className='mb-6 text-2xl font-bold'>Женщины</h2>
      <div className='grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-3'>
        {products
          .filter((p) => p.gender === 'female')
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </main>
  )
}
