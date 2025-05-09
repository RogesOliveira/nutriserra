import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rddfnbxgquujoeiiimsf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZGZuYnhncXV1am9laWlpbXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTIzNTksImV4cCI6MjA2MDQ4ODM1OX0.Wiwx8UdfdY7UUIcxCJNQgjG3JaRNSh8KWuOsVmZxMFg'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZGZuYnhncXV1am9laWlpbXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDkxMjM1OSwiZXhwIjoyMDYwNDg4MzU5fQ.BtTKvAkQ_Pl6-91vRcbS9ZWAWxq7XEGe6w4DLozbDxI'

// Cria um cliente Supabase usando as variáveis de ambiente
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
)

// Cliente com permissões de admin para operações que exigem mais privilégios
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
)
