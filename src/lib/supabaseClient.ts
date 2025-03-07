// Mock supabase client for compatibility
// This file exists to maintain compatibility with code that might still reference supabase
// but we're using local database (Dexie) instead

export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => null,
        data: null,
        error: new Error('Supabase is not used in this version. Using local database instead.')
      }),
      order: () => ({
        data: null,
        error: new Error('Supabase is not used in this version. Using local database instead.')
      })
    }),
    insert: () => ({
      select: () => ({
        single: async () => null,
        data: null,
        error: new Error('Supabase is not used in this version. Using local database instead.')
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => null,
          data: null,
          error: new Error('Supabase is not used in this version. Using local database instead.')
        })
      })
    }),
    delete: () => ({
      eq: () => ({
        data: null,
        error: new Error('Supabase is not used in this version. Using local database instead.')
      })
    })
  }),
  auth: {
    signIn: async () => ({
      data: null,
      error: new Error('Supabase is not used in this version. Using local database instead.')
    }),
    signOut: async () => ({
      error: null
    }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  }
};
