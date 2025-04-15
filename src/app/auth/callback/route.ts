import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const supabase = createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Erreur lors de l\'échange du code:', error.message)
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=${encodeURIComponent(error.message)}`)
      }

      if (data?.user) {
        try {
          const { error: upsertError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || null,
              avatar_url: data.user.user_metadata?.avatar_url || null
            }, {
              onConflict: 'id'
            })

          if (upsertError) {
            console.error('Erreur lors de l\'upsert utilisateur:', upsertError)
          }
        } catch (dbError) {
          console.error('Erreur base de données:', dbError)
        }
      }
    }

    return NextResponse.redirect(`${new URL(request.url).origin}/?auth-callback=true`)
  } catch (error) {
    console.error('Erreur inattendue:', error)
    return NextResponse.redirect(`${new URL(request.url).origin}/auth/error`)
  }
} 