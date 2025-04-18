import { SupabaseClient, User } from '@supabase/supabase-js'

export async function syncUser(supabase: SupabaseClient, user: User) {
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Erreur lors de la vérification de l\'utilisateur:', fetchError)
      return
    }

    if (!existingUser) {
      // Créer un nouvel utilisateur
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Erreur lors de la création de l\'utilisateur:', insertError)
      }
    } else {
      // Mettre à jour l'utilisateur existant
      const { error: updateError } = await supabase
        .from('users')
        .update({
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', updateError)
      }
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation de l\'utilisateur:', error)
  }
} 