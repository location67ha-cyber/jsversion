// ============================================
// CALCUL TARIFAIRE COMPLET
// ============================================

function calculerPrix(vehicule, duree, typeDemande, heureDebut, heureFin, option24h, avecChauffeur, remise = 0) {

  const creneau = validerCreneau(typeDemande, heureDebut, heureFin, option24h)
  const typeApplique = creneau.typeApplique
  const suppl24h = vehicule.supplement_24h ?? SUPPLEMENT_24H_GLOBAL

  // Vérification option chauffeur
  if (avecChauffeur) {
    const prixChauf = {
      'JOUR': vehicule.prix_chauffeur_jour,
      'NUIT': vehicule.prix_chauffeur_nuit,
      '24H':  vehicule.prix_chauffeur_24h
    }
    if (!prixChauf[typeApplique]) {
      return { erreur: `Option avec chauffeur (${typeApplique}) indisponible pour ce véhicule` }
    }
  }

  let prixBase = 0
  let detail = ''

  if (duree === 1) {
    if (!avecChauffeur) {
      if (typeApplique === 'JOUR') {
        prixBase = vehicule.prix_normal
        detail = `JOUR 12H × 1 jour = ${prixBase.toLocaleString()} Ar`
      } else if (typeApplique === 'NUIT') {
        prixBase = vehicule.prix_normal
        detail = `NUIT 12H × 1 nuit = ${prixBase.toLocaleString()} Ar`
      } else {
        prixBase = vehicule.prix_normal + suppl24h
        detail = creneau.upgrade24h
          ? `Upgrade 24H : ${vehicule.prix_normal.toLocaleString()} + ${suppl24h.toLocaleString()} = ${prixBase.toLocaleString()} Ar`
          : `24H : ${vehicule.prix_normal.toLocaleString()} + ${suppl24h.toLocaleString()} = ${prixBase.toLocaleString()} Ar`
      }
    } else {
      const prixMap = {
        'JOUR': vehicule.prix_chauffeur_jour,
        'NUIT': vehicule.prix_chauffeur_nuit,
        '24H':  vehicule.prix_chauffeur_24h
      }
      prixBase = prixMap[typeApplique] || 0
      detail = `Avec chauffeur ${typeApplique} × 1 = ${prixBase.toLocaleString()} Ar`
    }

  } else if (duree === 2) {
    if (!avecChauffeur) {
      const prix24h = vehicule.prix_normal + suppl24h
      prixBase = prix24h * 2
      detail = `2 jours → Prix 24H (${prix24h.toLocaleString()}) × 2 = ${prixBase.toLocaleString()} Ar`
    } else {
      const p = vehicule.prix_chauffeur_24h || 0
      prixBase = p * 2
      detail = `2 jours avec chauffeur → ${p.toLocaleString()} × 2 = ${prixBase.toLocaleString()} Ar`
    }

  } else if (duree >= 3) {
    if (!avecChauffeur) {
      const gain = vehicule.gain_12h || 0
      prixBase = gain * duree
      detail = `${duree} jours → Gain 12H (${gain.toLocaleString()}) × ${duree} = ${prixBase.toLocaleString()} Ar`
    } else {
      const p = vehicule.prix_chauffeur_12h || 0
      prixBase = p * duree
      detail = `${duree} jours avec chauffeur → ${p.toLocaleString()} × ${duree} = ${prixBase.toLocaleString()} Ar`
    }
  }

  const total = Math.max(0, prixBase - remise)

  return {
    typeDemande,
    typeApplique,
    upgrade24h: creneau.upgrade24h,
    motifUpgrade: creneau.motifUpgrade,
    avertissement: creneau.avertissement,
    prixBase,
    remise,
    total,
    detail
  }
}

function diffJours(dateDebut, dateFin) {
  const d1 = new Date(dateDebut)
  const d2 = new Date(dateFin)
  return Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1)
}
