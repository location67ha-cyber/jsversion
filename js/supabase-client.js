// ============================================
// CONFIG SUPABASE
// Remplacer par vos vraies clés
// ============================================

const SUPABASE_URL = 'https://VOTRE_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'VOTRE_ANON_KEY'

const { createClient } = supabase
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const GITHUB_IMAGES = 'https://raw.githubusercontent.com/VOTRE_USER/location-voiture-madagascar/main/public/images/voitures/'
const WA_NUMBER = '+261349120726'
const SUPPLEMENT_24H_GLOBAL = 30000
