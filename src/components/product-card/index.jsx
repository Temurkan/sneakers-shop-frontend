import Button from '@/components/button'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const mainImage = product.images.find((i) => i.is_main) || product.images[0]
  const displayImage = mainImage
    ? `http://127.0.0.1:8000/${mainImage.image}`
    : '/placeholder.png'

  return (
    <Link
      to={`/product/${product.id}`}
      className='group h-full bg-gray-50 overflow-hidden flex flex-col'
    >
      {/* Основной контейнер с flex-col. 
         h-full заставляет карточку тянуться на всю высоту ячейки сетки.
      */}
      <div className='p-3 flex flex-col h-full'>
        {/* --- ВЕРХНЯЯ ЧАСТЬ (Растягивается) --- */}
        <div className='flex-1 flex flex-col'>
          {/* Изображение */}
          <div className='relative h-[200px] w-full flex items-center justify-center mb-3 overflow-hidden'>
            <img
              className='max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300'
              src={displayImage}
              alt={product.name}
            />
          </div>

          {/* Бренд */}
          <span className='text-xs text-gray-400 tracking-wide'>
            {product.brand?.name}
          </span>

          {/* Название (Ограничиваем 2 строками, чтобы высота не прыгала дико) */}
          <h3 className='text-sm font-medium text-gray-900 leading-tight mt-1 mb-2 line-clamp-2 min-h-[2.5em]'>
            {product.name}
          </h3>

          {/* Рейтинг */}
          <div className='flex items-center '>
            {Array.from({ length: 5 }).map((_, i) => (
              <img className='size-3.5' key={i} src='/star.svg' alt='star' />
            ))}
            <span className='text-xs text-gray-400 ml-1'>
              ({product.rating})
            </span>
          </div>

          {/* Блок цены и размера - прижимаем к низу верхней части */}
          <div className='mt-auto flex justify-between items-end border-t pt-2 border-dashed border-gray-100'>
            <span className='text-lg font-bold text-gray-900'>
              {Math.floor(product.price).toLocaleString()}{' '}
              <span className='text-xs font-normal text-gray-500'>сум</span>
            </span>
            {product.sizes?.length > 0 && (
              <span className='text-xs font-medium bg-gray-100 px-1.5 py-0.5 rounded text-gray-600'>
                {product.sizes[0].size}-{product.sizes.slice(-1)[0].size}
              </span>
            )}
          </div>
        </div>

        {/* --- НИЖНЯЯ ЧАСТЬ (Кнопка) --- */}
        <div className='mt-3'>
          <Button className='w-full text-sm py-2'>В корзину</Button>
        </div>
      </div>
    </Link>
  )
}
