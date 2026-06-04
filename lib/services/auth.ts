// ============================================================
// lib/services/auth.ts
// ============================================================

import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { StaffProfile, StaffRole, ShopConfigValues } from '@/lib/supabase/types'

export async function getCurrentStaff(): Promise<StaffProfile | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !data) return null

  return data as StaffProfile
}

export async function requireOwner(): Promise<StaffProfile> {
  const staff = await getCurrentStaff()

  if (!staff || staff.role !== 'owner') {
    throw new Error('Unauthorized: owner access required')
  }

  return staff
}

export async function createStaffAccount(params: {
  email: string
  password: string
  fullName: string
  role: StaffRole
  createdBy: string
}): Promise<void> {
  await requireOwner()

  const admin = await createAdminClient()

  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email: params.email,
      password: params.password,
      email_confirm: true,
    })

  if (authError) {
    throw new Error(`Failed to create user: ${authError.message}`)
  }

  if (!authData.user) {
    throw new Error('Failed to create auth user')
  }

  const supabase = await createClient()

  const { error: profileError } = await supabase
    .from('staff_profiles')
    .insert({
      id: authData.user.id,
      full_name: params.fullName,
      role: params.role,
      created_by: params.createdBy,
    })

  if (profileError) {
    throw new Error(`Failed to create profile: ${profileError.message}`)
  }
}

export async function toggleStaffActive(
  staffId: string,
  isActive: boolean
): Promise<void> {
  await requireOwner()

  const supabase = await createClient()

  const { error } = await supabase
    .from('staff_profiles')
    .update({
      is_active: isActive,
    })
    .eq('id', staffId)

  if (error) {
    throw new Error(`Failed to update staff: ${error.message}`)
  }
}

// ============================================================
// lib/services/config.ts
// ============================================================

export async function getShopConfig(): Promise<ShopConfigValues> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('shop_config')
    .select('key, value')

  if (error) {
    throw new Error(`Failed to fetch config: ${error.message}`)
  }

  return Object.fromEntries(
    data.map((row) => [row.key, row.value])
  ) as ShopConfigValues
}

export async function updateShopConfig(
  key: keyof ShopConfigValues,
  value: unknown
): Promise<void> {
  await requireOwner()

  const supabase = await createClient()

  const { error } = await supabase
    .from('shop_config')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    throw new Error(`Failed to update config: ${error.message}`)
  }
}