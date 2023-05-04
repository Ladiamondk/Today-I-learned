
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tpenyzhfbkjpqfqnfoby.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZW55emhmYmtqcHFmcW5mb2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIwMjUxOTIsImV4cCI6MTk5NzYwMTE5Mn0.sUY9hQb8PN8ISP-WSiLjRbTT2N55zoxps2TXrMM62Mw'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;