// src/pages/ProductPage.jsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '@/api'
import Button from '@/components/button'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

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

  if (!product) return <p>Loading...</p>

  return (
    <div className='container mx-auto mt-12'>
      <h1 className='text-2xl font-bold'>
        {product.brand.name} {product.name}
      </h1>
      <img
        src={`http://127.0.0.1:8000/${product.images[0].image}`}
        alt={product.name}
        className='w-full max-w-md my-4'
      />
      <div className='flex flex-wrap gap-2'>
        {product.images.map((img, index) => (
          <img
            key={index}
            src={`http://127.0.0.1:8000/${img.image}`}
            alt={`${product.name} ${index + 1}`}
            className='w-32 h-32 object-contain'
          />
        ))}
      </div>
      <p>Бренд: {product.brand.name}</p>
      <p>Цена: {Math.floor(product.price).toLocaleString()} сум</p>
      <p>Размеры: {product.sizes?.map((s) => s.size).join(', ')}</p>
      <Button>Добавить в корзину</Button>
    </div>
  )
}
