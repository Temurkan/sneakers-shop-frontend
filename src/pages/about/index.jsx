import React from 'react'

export default function AboutPage() {
  return (
    <div className='container flex flex-col mx-auto px-1 md:px-4 gap-y-3'>
      <h2>О KINK</h2>
      <p>
        KINK - интернет-магазин, который никогда не перестанет развиваться.
        Каждый день мы работаем над сайтом, закупками и доставкой, чтобы вы с
        удовольствием занимались покупками в любое время суток. Наши покупатели
        — люди с хорошим вкусом, которые ценят время и выбирают качественные
        товары.
      </p>
      <img className='w-[800px]' src='/kinkloc.jpg' alt='kink' />
    </div>
  )
}
