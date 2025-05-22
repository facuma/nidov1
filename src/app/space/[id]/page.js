import { supabase } from '@/lib/supabase'

export async function generateStaticParams() {
  const { data: spaces } = await supabase.from('spaces').select('id')
  return spaces?.map((space) => ({ id: space.id })) || []
}

export default async function SpaceDetail({ params }) {
  const { id } = params
  const { data: space, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !space) {
    return <div className="p-6 text-white">Espacio no encontrado.</div>
  }

  return (
    <div className="p-6 text-white">
      <img src={space.image} alt={space.title} className="w-full h-64 object-cover rounded mb-6" />
      <h1 className="text-3xl font-bold">{space.title}</h1>
      <p className="text-gray-400 mt-2">{space.location}</p>
      <p className="mt-4">{space.description}</p>
      <p className="mt-4 text-xl font-semibold">${space.price} / día</p>
      <button className="mt-6 px-4 py-2 bg-white text-black rounded hover:bg-gray-200">Reservar ahora</button>
    </div>
  )
}
