import { NextResponse } from 'next/server'
import { getOrderByNumberAndPhone } from '@/lib/services/orders'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const number = searchParams.get('number')
  const phone = searchParams.get('phone')

  if (!number || !phone) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    const order = await getOrderByNumberAndPhone(number, phone)
    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
