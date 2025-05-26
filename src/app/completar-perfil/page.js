'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

export default function CompletarPerfil() {
  const router = useRouter()
  const [userId, setUserId] = useState(null)
  const [form, setForm] = useState({ first_name: '', last_name: '', bio: '', pid: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()
      if (authError || !user) return router.push('/login')

      setUserId(user.id)
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('first_name, last_name, bio, pid')
        .eq('id', user.id)
        .single()

      if (profileError) {
        toast({ title: 'Error', description: 'No pudimos cargar tu perfil.' })
      } else if (profile) {
        setForm({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          bio: profile.bio || '',
          pid: profile.pid || ''
        })
      }

      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('users')
      .update({ ...form })
      .eq('id', userId)

    if (error) {
      toast({ title: 'Error', description: 'No pudimos guardar tu perfil.' })
      setSaving(false)
    } else {
      toast({ title: 'Éxito', description: 'Perfil actualizado correctamente.' })
      router.push('/')
    }
  }

  return (
    <div className="max-w-lg mx-auto pb-20 my-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Completa tu perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Tu nombre"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Tu apellido"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Cuéntanos sobre ti"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="pid">DNI o Pasaporte</Label>
                <Input
                  id="pid"
                  name="pid"
                  placeholder="Documento de identidad"
                  value={form.pid}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" disabled={saving} className="w-full accent py-2 rounded-full">
                {saving ? 'Guardando...' : 'Guardar Perfil'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
