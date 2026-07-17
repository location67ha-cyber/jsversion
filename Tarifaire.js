// config.js - Constantes globales
export const GLOBAL_SUPPLEMENT_24H = 30000;

/**
 * Valide les plages horaires et détecte les surcharges automatiques vers le tarif 24H
 */
export function checkHorairesAndType(typeRent, depTime, retTime) {
  let autoUpgrade = false;
  let finalType = typeRent;

  if (typeRent === 'JOUR') {
    // Plage normale : 07h00 à 19h00 (Départ anticipé possible à 06h00)
    if (depTime < '06:00' || retTime > '19:00') {
      autoUpgrade = true;
      finalType = '24H';
    }
  } else if (typeRent === 'NUIT') {
    // Plage normale : 19h00 à 06h00 (lendemain)
    if (depTime < '19:00' || retTime > '06:00') {
      autoUpgrade = true;
      finalType = '24H';
    }
  }

  return { finalType, autoUpgrade };
}

/**
 * Calcule le montant brut d'une location
 */
export function calculateRentalPrice(vehicle, config) {
  const { 
    typeRent, start_date, end_date, departure_time, return_time, with_driver 
  } = config;

  // 1. Analyse et validation des horaires
  const { finalType, autoUpgrade } = checkHorairesAndType(typeRent, departure_time, return_time);

  // 2. Calcul du nombre de jours exact
  const d1 = new Date(start_date);
  const d2 = new Date(end_date);
  const diffTime = Math.abs(d2 - d1);
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 jour

  let price = 0;

  // 3. Application de la grille tarifaire sans chauffeur
  if (!with_driver) {
    const supplement24h = vehicle.supplement_24h_custom !== null ? Number(vehicle.supplement_24h_custom) : GLOBAL_SUPPLEMENT_24H;

    if (totalDays === 1) {
      if (finalType === 'JOUR' || finalType === 'NUIT') {
        price = vehicle.price_normal;
      } else if (finalType === '24H') {
        price = vehicle.price_normal + supplement24h;
      }
    } else if (totalDays === 2) {
      const price24h = vehicle.price_normal + supplement24h;
      price = price24h * 2;
    } else {
      // 3 jours et plus
      price = vehicle.gain_12h * totalDays;
    }
  } 
  // 4. Application des tarifs manuels avec chauffeur
  else {
    if (totalDays === 1) {
      if (finalType === 'JOUR') price = vehicle.driver_jour;
      if (finalType === 'NUIT') price = vehicle.driver_nuit;
      if (finalType === '24H') price = vehicle.driver_24h;
    } else if (totalDays === 2) {
      price = (vehicle.driver_24h || 0) * 2;
    } else {
      // 3 jours et plus avec chauffeur
      price = (vehicle.driver_12h_gain || vehicle.gain_12h) * totalDays;
    }

    // Sécurité si l'option est incomplète en base
    if (!price) {
      return { error: "Option avec chauffeur non disponible pour ce véhicule sur ce créneau." };
    }
  }

  return {
    total_price: price,
    auto_upgraded: autoUpgrade,
    applied_type: finalType,
    days: totalDays
  };
}
