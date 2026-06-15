import { products as fallbackProducts } from '../data/products'
import { getSupabaseConfigError, supabase } from './supabase'

function normalizeProductRecord(record) {
  const specs = Array.isArray(record.specs)
    ? record.specs
    : typeof record.specs === 'string'
      ? record.specs
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
      : []

  const price = Number(record.price) || 0
  const oldPrice = record.old_price ?? record.oldPrice

  return {
    id: Number(record.id),
    name: record.name,
    animalType: record.animal_type ?? record.animalType ?? 'Питомцы',
    category: record.category ?? 'Товары',
    price,
    oldPrice: oldPrice ? Number(oldPrice) : null,
    rating: Number(record.rating ?? 4.8),
    image: record.image_url ?? record.image ?? '',
    isPopular: Boolean(record.is_popular ?? record.isPopular),
    isPromo: Boolean(record.is_promo ?? record.isPromo ?? (oldPrice && Number(oldPrice) > price)),
    isActive: Boolean(record.is_active ?? record.isActive ?? true),
    description: record.description ?? '',
    specs,
  }
}

function serializeSpecs(specs) {
  if (Array.isArray(specs)) {
    return specs
  }

  return String(specs ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export async function fetchProducts() {
  if (!supabase) {
    return fallbackProducts
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true })

  if (error) {
    console.error('Failed to load products from Supabase, falling back to local data.', error)
    return fallbackProducts
  }

  if (!data?.length) {
    return fallbackProducts
  }

  return data.map(normalizeProductRecord)
}

export async function submitOrder(order) {
  if (!supabase) {
    throw new Error(getSupabaseConfigError())
  }

  const orderId = globalThis.crypto?.randomUUID?.()

  if (!orderId) {
    throw new Error('Unable to generate order ID in this environment.')
  }

  const { items, ...orderPayload } = order
  const { error: orderError } = await supabase
    .from('orders')
    .insert({ id: orderId, ...orderPayload })

  if (orderError) {
    throw orderError
  }

  const orderItems = items.map((item) => ({
    order_id: orderId,
    product_id: item.id,
    product_name: item.name,
    price: item.price,
    quantity: item.quantity,
    image_url: item.image,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    throw itemsError
  }

  return orderId
}

export async function submitContactMessage(message) {
  if (!supabase) {
    throw new Error(getSupabaseConfigError())
  }

  const { error } = await supabase.from('contact_messages').insert(message)

  if (error) {
    throw error
  }
}

export async function fetchAdminProducts() {
  if (!supabase) {
    throw new Error(getSupabaseConfigError())
  }

  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map(normalizeProductRecord)
}

export async function saveAdminProduct(product) {
  if (!supabase) {
    throw new Error(getSupabaseConfigError())
  }

  const payload = {
    ...(product.id ? { id: Number(product.id) } : {}),
    name: product.name.trim(),
    animal_type: product.animalType,
    category: product.category.trim(),
    price: Number(product.price) || 0,
    old_price: product.oldPrice ? Number(product.oldPrice) : null,
    rating: Number(product.rating) || 4.8,
    image_url: product.image.trim(),
    is_popular: Boolean(product.isPopular),
    is_promo: Boolean(product.isPromo),
    is_active: Boolean(product.isActive),
    description: product.description.trim(),
    specs: serializeSpecs(product.specs),
  }

  const { data, error } = await supabase.from('products').upsert(payload).select('*').single()

  if (error) {
    throw error
  }

  return normalizeProductRecord(data)
}

export async function fetchAdminOrders() {
  if (!supabase) {
    throw new Error(getSupabaseConfigError())
  }

  const { data, error } = await supabase
    .from('orders')
    .select(
      'id, customer_name, phone, email, address, delivery_method, payment_method, items_count, subtotal, delivery_fee, total, status, created_at, order_items(id, product_name, price, quantity, image_url)',
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function updateAdminOrderStatus(orderId, status) {
  if (!supabase) {
    throw new Error(getSupabaseConfigError())
  }

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)

  if (error) {
    throw error
  }
}

export async function fetchAdminMessages() {
  if (!supabase) {
    throw new Error(getSupabaseConfigError())
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function updateAdminMessageStatus(messageId, status) {
  if (!supabase) {
    throw new Error(getSupabaseConfigError())
  }

  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', messageId)

  if (error) {
    throw error
  }
}
