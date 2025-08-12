import { supabase } from './supabase'
import type { Database } from './schema'

// Helper functions to interact with Supabase using the client
export const supabaseDb = {
  // Games table operations
  games: {
    async findAll() {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Map snake_case columns to camelCase to match TypeScript schema
      return data?.map(game => ({
        id: game.id,
        name: game.title,
        description: game.description,
        status: game.status,
        platforms: game.platform ? [game.platform] : null,
        genres: game.genre ? [game.genre] : null,
        released: game.release_date,
        rating: game.rating,
        imageUrl: game.image_url,
        backgroundImage: game.image_url, // Use same image for both
        rawgId: game.rawg_id,
        createdAt: game.created_at,
        updatedAt: game.updated_at,
        // Default values for missing fields
        developers: null,
        publishers: null,
        slug: null
      })) || []
    },
    
    async findById(id: number) {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      if (!data) return null
      
      // Map snake_case columns to camelCase to match TypeScript schema
      return {
        id: data.id,
        name: data.title,
        description: data.description,
        status: data.status,
        platforms: data.platform ? [data.platform] : null,
        genres: data.genre ? [data.genre] : null,
        released: data.release_date,
        rating: data.rating,
        imageUrl: data.image_url,
        backgroundImage: data.image_url, // Use same image for both
        rawgId: data.rawg_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        // Default values for missing fields
        developers: null,
        publishers: null,
        slug: null
      }
    },
    
    async create(game: Database['public']['Tables']['games']['Insert']) {
      const { data, error } = await supabase
        .from('games')
        .insert(game)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    async update(id: number, updates: Database['public']['Tables']['games']['Update']) {
      const { data, error } = await supabase
        .from('games')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    async updateStatus(id: number, status: string) {
      const { data, error } = await supabase
        .from('games')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      if (!data) return null
      
      // Map snake_case columns to camelCase to match TypeScript schema
      return {
        id: data.id,
        name: data.title,
        description: data.description,
        status: data.status,
        platforms: data.platform ? [data.platform] : null,
        genres: data.genre ? [data.genre] : null,
        released: data.release_date,
        rating: data.rating,
        imageUrl: data.image_url,
        backgroundImage: data.image_url, // Use same image for both
        rawgId: data.rawg_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        // Default values for missing fields
        developers: null,
        publishers: null,
        slug: null
      }
    },
    
    async delete(id: number) {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },
  
  // Notes table operations
  notes: {
    async findByGameId(gameId: number) {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    
    async create(note: Database['public']['Tables']['notes']['Insert']) {
      const { data, error } = await supabase
        .from('notes')
        .insert(note)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    async delete(id: number) {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    }
  },
  
  // Solutions table operations
  solutions: {
    async findByGameId(gameId: number) {
      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Map snake_case columns to camelCase to match TypeScript schema
      return data?.map(solution => ({
        id: solution.id,
        gameId: solution.game_id,
        problem: solution.title,
        solution: solution.content,
        difficulty: solution.difficulty,
        aiGenerated: false, // Default to false since column doesn't exist in DB
        createdAt: solution.created_at,
        updatedAt: solution.updated_at
      })) || []
    },
    
    async create(solution: Database['public']['Tables']['solutions']['Insert']) {
      const { data, error } = await supabase
        .from('solutions')
        .insert(solution)
        .select()
        .single()
      
      if (error) throw error
      
      if (!data) return null
      
      // Map snake_case columns to camelCase to match TypeScript schema
      return {
        id: data.id,
        gameId: data.game_id,
        problem: data.title,
        solution: data.content,
        difficulty: data.difficulty,
        aiGenerated: false, // Default to false since column doesn't exist in DB
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },
    
    async delete(id: number) {
      const { error } = await supabase
        .from('solutions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    }
  },
  
  // Dashboard stats
  async getDashboardStats() {
    const [gamesResult, notesResult, solutionsResult] = await Promise.all([
      supabase.from('games').select('status', { count: 'exact' }),
      supabase.from('notes').select('*', { count: 'exact', head: true }),
      supabase.from('solutions').select('*', { count: 'exact', head: true })
    ])
    
    if (gamesResult.error) throw gamesResult.error
    if (notesResult.error) throw notesResult.error
    if (solutionsResult.error) throw solutionsResult.error
    
    // Map database status values to frontend expected keys
    const statusMapping: Record<string, string> = {
      'not_started': 'backlog',
      'in_progress': 'in_progress', 
      'completed': 'completed',
      'on_hold': 'abandoned'
    }
    
    const gamesByStatus = gamesResult.data?.reduce((acc: Record<string, number>, game) => {
      const mappedStatus = statusMapping[game.status] || game.status
      acc[mappedStatus] = (acc[mappedStatus] || 0) + 1
      return acc
    }, {}) || {}
    
    // Ensure all expected status keys exist with default values
    const finalGamesByStatus = {
      backlog: gamesByStatus.backlog || 0,
      in_progress: gamesByStatus.in_progress || 0,
      completed: gamesByStatus.completed || 0,
      abandoned: gamesByStatus.abandoned || 0
    }
    
    const totalGames = gamesResult.count || 0
    const totalNotes = notesResult.count || 0
    const totalSolutions = solutionsResult.count || 0
    
    return {
      totalGames,
      totalNotes,
      totalSolutions,
      gamesByStatus: finalGamesByStatus,
      avgNotesPerGame: totalGames > 0 ? totalNotes / totalGames : 0,
      avgSolutionsPerGame: totalGames > 0 ? totalSolutions / totalGames : 0
    }
  }
}