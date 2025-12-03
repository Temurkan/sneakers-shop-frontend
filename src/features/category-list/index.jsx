import { useEffect, useState } from 'react'
import { api } from '@/api'
import { Link } from 'react-router-dom'

const colors = ['#75C973', '#D4B45F', '#B86868', '#77589D', '#87BBDF']

export default function CategoriesList() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get('categories/')
        console.log('API cat:', response.data)

        setCategories(response.data)
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()
  }, [])
  return (
    <section className='container mt-24 mx-auto max-w-7xl'>
      <h2 className='mb-6'>Купить по категориям</h2>
      <div className='grid grid-cols-5 gap-3'>
        {categories.map((category, i) => (
          <Link key={category.id} to={`/${category.slug}`}>
            <div
              className='h-45 flex items-center justify-center'
              style={{ backgroundColor: colors[i % colors.length] }}
            >
              <div className='w-40'>
                <img
                  className='object-contain'
                  src={`http://127.0.0.1:8000/${category.image}`}
                  alt={category.name}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
