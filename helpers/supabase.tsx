import { createClient } from '@supabase/supabase-js'
import { Database } from './schema'

const supabaseUrl = 'https://zkoayqyevidrzrxtwlzn.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprb2F5cXlldmlkcnpyeHR3bHpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDkyMTI3MiwiZXhwIjoyMDcwNDk3MjcyfQ.w1AZn2XxAzSB93X2tqNmOvLhytKghaRCiC9PKVM5Jzk'

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)