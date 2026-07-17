// ============================================
// CALCUL HORAIRES & VALIDATION CRÉNEAUX
// ============================================

function toMin(heureStr) {
  const [h, m] = heureStr.split(':').map(Number)
  return h * 60 + m
}

function validerJour(heureDebut, heureFin) {
  const dMin = toMin(heureDebut)
  const fMin = toMin(heureFin)

  if (dMin < toMin('06:00')) {
    return {
      typeApplique: '24H', upgrade24h: true,
      motifUpgrade: `Départ à ${heureDebut} — avant 06h00`,
      avertissement: `⚠️ Départ avant 06h00 : tarif 24H appliqué automatiquement.`
    }
  }
  if (fMin > toMin('19:00')) {
    return {
      typeApplique: '24H', upgrade24h: true,
      motifUpgrade: `Retour à ${heureFin} — après 19h00`,
      avertissement: `⚠️ Retour après 19h00 : tarif 24H appliqué automatiquement.`
    }
  }
  return { typeApplique: 'JOUR', upgrade24h: false, motifUpgrade: null, avertissement: null }
}

function validerNuit(heureDebut, heureFin) {
  const dMin = toMin(heureDebut)
  const fMin = toMin(heureFin)

  if (dMin < toMin('19:00')) {
    return {
      typeApplique: '24H', upgrade24h: true,
      motifUpgrade: `Départ à ${heureDebut} — avant 19h00`,
      avertissement: `⚠️ Départ avant 19h00 : tarif 24H appliqué automatiquement.`
    }
  }
  if (fMin > toMin('06:00') && fMin < toMin('19:00')) {
    return {
      typeApplique: '24H', upgrade24h: true,
      motifUpgrade: `Retour à ${heureFin} — après 06h00`,
      avertissement: `⚠️ Retour après 06h00 : tarif 24H appliqué automatiquement.`
    }
  }
  return { typeApplique: 'NUIT', upgrade24h: false, motifUpgrade: null, avertissement: null }
}

function valider24H(heureFin, option24h) {
  const fMin = toMin(heureFin)

  if (option24h === 'MATIN' && fMin > toMin('06:00') && fMin < toMin('19:00')) {
    return {
      typeApplique: '24H', upgrade24h: false,
      motifUpgrade: `Dépassement 24H matin — retour à ${heureFin}`,
      avertissement: `⚠️ Retour après 06h00 sur option 24H matin. Majoration appliquée.`
    }
  }
  if (option24h === 'SOIR' && fMin > toMin('18:00')) {
    return {
      typeApplique: '24H', upgrade24h: false,
      motifUpgrade: `Dépassement 24H soir — retour à ${heureFin}`,
      avertissement: `⚠️ Retour après 18h00 sur option 24H soir. Majoration appliquée.`
    }
  }
  return { typeApplique: '24H', upgrade24h: false, motifUpgrade: null, avertissement: null }
}

function validerCreneau(typeDemande, heureDebut, heureFin, option24h = 'MATIN') {
  if (typeDemande === 'JOUR') return validerJour(heureDebut, heureFin)
  if (typeDemande === 'NUIT') return validerNuit(heureDebut, heureFin)
  if (typeDemande === '24H') return valider24H(heureFin, option24h)
  return { typeApplique: '24H', upgrade24h: true, motifUpgrade: 'Type inconnu', avertissement: null }
}
