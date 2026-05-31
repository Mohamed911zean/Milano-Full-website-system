"use client"

import Link from 'next/link'
import { Category } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: Category[]
  activeCategoryId?: string
}

export default function CategoryFilter({ categories, activeCategoryId }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
      <Link
        href="/products"
        className={cn(
          "whitespace-nowrap px-6 py-2 rounded-full border transition-all duration-300 font-medium text-sm",
          !activeCategoryId
            ? "bg-gold border-gold text-dark-base shadow-lg shadow-gold/20"
            : "bg-dark-surface border-dark-border text-text-muted hover:border-gold/40 hover:text-gold"
        )}
      >
        الكل
      </Link>
      
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className={cn(
            "whitespace-nowrap px-6 py-2 rounded-full border transition-all duration-300 font-medium text-sm",
            activeCategoryId === category.id
              ? "bg-gold border-gold text-dark-base shadow-lg shadow-gold/20"
              : "bg-dark-surface border-dark-border text-text-muted hover:border-gold/40 hover:text-gold"
          )}
        >
          {category.name_ar}
        </Link>
      ))}
    </div>
  )
}
