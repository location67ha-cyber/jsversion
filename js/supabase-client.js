// ============================================
// CONFIG SUPABASE
// Remplacer par vos vraies clés
// ============================================

const SUPABASE_URL = 'https://jkovlclyumqfbkbekrel.supabase.co/'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb3ZsY2x5dW1xZmJrYmVrcmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNzgzMzAsImV4cCI6MjA5OTg1NDMzMH0.wtnOUl97eYRfnhbNKRGpsm-Z3tD6qC2SJOk1qUAKIEc'

const { createClient } = supabase
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const GITHUB_IMAGES = 'https://raw.githubusercontent.com/VOTRE_USER/location-voiture-madagascar/main/public/images/voitures/'
const WA_NUMBER = '+261349120726'
const SUPPLEMENT_24H_GLOBAL = 30000
