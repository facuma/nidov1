'use client'
import Image from 'next/image'
import UnworkLogo from '@/../public/unworksm.png'
import HeroImage from '@/../public/hero-image.png'
import BedWorkImage from '@/../public/story4.png'
import FadeInSection from '@/components/ui/FadeInSection'
import { useState } from 'react'
import ModalGracias from '@/components/ui/ModalGracias'


export default function LandingPage() {
const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault()

   const nombre = e.target.nombre.value
  const email = e.target.email.value

  if (!nombre.trim() || !email.includes('@')) {
    alert('Por favor, completá un nombre y un email válido.')
    return
  }

  try {
    const res = await fetch('https://hook.us1.make.com/1nsqlcabw64ial26xeglogeeb8gwcdd6', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email }),
    })

    if (res.ok) {
  setShowModal(true)
  e.target.reset()
}

  } catch (error) {
    console.error('Error al enviar:', error)
    alert('Error inesperado 😢')
  }
}
  return (
    <main className="relative overflow-hidden bg-[#f1f1f1] text-[#0f0f0f]">

      {/* Sección Hero */}
      <FadeInSection>
        <section className="w-full min-h-screen px-6 pb-12 lg:py-10 flex flex-col items-center justify-start">
          <div className="mb-10 lg:mb-16">
            <Image src={UnworkLogo} alt="unwork logo" width={140} height={40} />
          </div>

          {/* Mobile */}

          <div className="w-full lg:hidden flex flex-col items-center gap-6">
            <div className="relative overflow-visible w-full max-w-md">
              <div className="absolute top-0 left-1/2 w-[105%] border border-black/10 -translate-x-1/2 -translate-y-1/3 z-10 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl">
                <h1 className="text-3xl font-black text-black text-center leading-6 tracking-tight">
                  Tu próxima oficina<br />no es una oficina.
                </h1>
              </div>
              <Image src={HeroImage} alt="Trabajando libre" width={600} height={400} className="rounded-xl object-cover w-[80%] mt-10 shadow-md mx-auto h-auto brightness-90" />
            </div>
            <div className="w-full max-w-md text-center space-y-4">
              <p className="text-base text-black">
                Reservá espacios <strong>por hora</strong> para trabajar <strong>donde quieras</strong>.
                <span className="text-yellow-500 font-semibold block">Sin contratos. Sin horarios. Sin drama.</span>
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
                <input name='nombre' type="text" placeholder="Tu nombre" className="px-4 py-3 rounded-full w-2/3 border border-gray-300 text-left" />
                <input name='email' type="email" placeholder="Tu mail" className="px-4 py-3 rounded-full border w-4/5 border-gray-300 text-left" />
                <button type="submit" className="bg-yellow-400 transition cursor-pointer w-full hover:bg-yellow-500 text-black font-semibold py-3 rounded-full shadow">
                  Quiero estar entre los primeros
                </button>
              </form>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden lg:flex w-full max-w-6xl justify-between items-center gap-2">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-5xl font-black text-black leading-10 tracking-tight">
                Tu próxima oficina<br />no es una oficina.
              </h1>
              <p className="text-lg text-black">
                Reservá espacios por hora para trabajar donde quieras.
                <span className="block text-yellow-500 font-semibold">Sin contratos. Sin horarios. Sin drama.</span>
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
                <input name='nombre' type="text" placeholder="Tu nombre" className="px-4 py-3 rounded-full border border-gray-300" />
                <input name='email' type="email" placeholder="Tu mail" className="px-4 py-3 rounded-full border border-gray-300" />
                <button type="submit" className="bg-[#ffc000] transition cursor-pointer hover:bg-yellow-500 text-black font-semibold py-3 rounded-full shadow">
                  Quiero estar entre los primeros
                </button>
              </form>
              <p className="text-sm text-gray-500">Pronto abrimos las puertas. Cupos limitados para testers.</p>
            </div>
            <div className="lg:w-1/2">
              <Image src={HeroImage} alt="Trabajando libre" width={600} height={400} className="rounded-xl object-cover w-full h-auto shadow-md brightness-90" />
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Sección Storytelling */}
      <div className="bgseccion">
        <FadeInSection delay={0.2}>
          <section className="container mx-auto py-20 px-6 text-left">
            <h2 className="text-3xl text-center pb-10 lg:pb-20 font-bold text-white">Trabajar desde casa era libertad… hasta que se volvió encierro.</h2>
            <div className="container mx-auto flex flex-col lg:flex-row items-start gap-12">
              <div className="text-center lg:text-left lg:w-1/2 space-y-6">
                <p className="text-lg text-white">
                  Durante la pandemia, el home office nos dio respiro.<br />
                  Pero hoy, esa libertad se transformó en encierro productivo.<br />
                  Siempre la misma silla. La misma taza. El mismo fondo de Zoom.
                </p>
                <p className="text-lg text-white text-center py-3 px-4 border rounded-lg bg-white/10 backdrop-blur-sm font-extrabold w-full">
                  ¿Y si pudieras cambiar eso con un par de clics?
                </p>
                <p className="text-lg font-medium text-white">
                  Por eso creamos <strong>Unwork</strong>.<br />
                  Una plataforma para reservar espacios de trabajo por hora, cerca tuyo, cuando vos lo necesitás.<br />
                  Cero contratos. Cero oficinas fijas. Cien por ciento libertad.
                </p>
              </div>
              <div className="lg:w-1/2">
                <Image src={BedWorkImage} alt="Trabajando en cama" width={600} height={400} className="rounded-xl shadow-lg object-cover" />
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* Cómo funciona */}
        <FadeInSection delay={0.3}>
          <section className="py-10 px-6">
            <div className="container mx-auto max-w-xl text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">¿Cómo funciona Unwork?</h2>
              <ul className="text-lg text-white space-y-4">
                <li>✓ Encontrá espacios por hora en tu ciudad.</li>
                <li>✓ Reservá 100% online, sin vueltas.</li>
                <li>✓ Entrá, laburá, salí.</li>
                <li>✓ Eso es Unwork.</li>
              </ul>
              <button type="submit" className="bg-[#ffc000] transition cursor-pointer px-4 w-full mt-5 hover:bg-yellow-500 text-black font-semibold py-3 rounded-full shadow">
                Quiero estar entre los primeros
              </button>
            </div>
          </section>
        </FadeInSection>

        {/* Comunidad */}
        <FadeInSection delay={0.4}>
          <section className="text-left py-20 px-6">
            <div className="container mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">Esto es para vos si…</h2>
              <ul className="text-lg text-white space-y-3">
                <li>Sos freelancer y necesitás cambiar de aire.</li>
                <li>Hacés home office pero te cuesta concentrarte.</li>
                <li>Querés un espacio para tener reuniones sin alquilar todo el mes.</li>
                <li>Amás trabajar libre, pero con foco.</li>
              </ul>
              <p className="text-lg text-white text-center py-3 px-4 border rounded-lg bg-white/10 backdrop-blur-sm font-extrabold w-full">
                Queremos que seas parte de la primera comunidad que trabaja desde donde quiere.
              </p>
            </div>
          </section>
        </FadeInSection>
      </div>

      {/* CTA final */}
      <FadeInSection delay={0.2}>
        <section className="py-20 px-6">
          <div className="container mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-black">Los primeros en entrar van a cambiar cómo se trabaja en Argentina.</h2>
            <p className="text-lg text-gray-800">¿Querés ser parte?<br />Anotate gratis en la lista y te avisamos apenas lancemos.</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <input name='nombre' type="text" placeholder="Tu nombre" className="px-4 py-3 rounded-full border border-gray-700 bg-transparent text-black w-64" />
              <input name='nombre' type="email" placeholder="Tu mejor mail" className="px-4 py-3 rounded-full border border-gray-700 bg-transparent text-black w-64" />
              <button type="submit" className="bg-[#ffc000] cursor-pointer text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition">
                🔐 Quiero estar entre los primeros
              </button>
            </form>
            <p className="text-sm text-gray-400">Sin spam. Sin compromiso. Solo libertad.</p>
          </div>
        </section>
      </FadeInSection>
      <ModalGracias show={showModal} onClose={() => setShowModal(false)} />

    </main>
  )
}
