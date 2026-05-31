import { createClient } from '@/lib/supabase/server'
import { ShopConfigValues } from '@/lib/supabase/types'

export async function getShopConfig(): Promise<ShopConfigValues> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('shop_config')
    .select('key, value')

  if (error) throw new Error(`Failed to fetch shop config: ${error.message}`)

  // Convert array of {key, value} to object
  const config = data.reduce((acc, curr) => {
    acc[curr.key as keyof ShopConfigValues] = curr.value as any
    return acc
  }, {} as ShopConfigValues)

  return config
}
