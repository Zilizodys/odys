import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const baseUrl = requestUrl.origin

    if (!code) {
      console.error('Pas de code d\'authentification fourni')
      return NextResponse.redirect(`${baseUrl}/auth/error?error=no_code`)
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Erreur lors de l\'échange du code:', error.message)
      return NextResponse.redirect(`${baseUrl}/auth/error?error=${encodeURIComponent(error.message)}`)
    }

    if (!data?.user) {
      console.error('Pas de données utilisateur reçues')
      return NextResponse.redirect(`${baseUrl}/auth/error?error=no_user_data`)
    }

    try {
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || null,
          avatar_url: data.user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString()
        })

      if (upsertError) {
        console.error('Erreur lors de l\'upsert utilisateur:', upsertError)
        // On continue malgré l'erreur d'upsert
      }
    } catch (dbError) {
      console.error('Erreur base de données:', dbError)
      // On continue malgré l'erreur de base de données
    }

    return NextResponse.redirect(`${baseUrl}/?auth-callback=true`)
  } catch (error) {
    console.error('Erreur inattendue:', error)
    return NextResponse.redirect(`${request.url.split('/auth')[0]}/auth/error?error=unexpected_error`)
  }
} 