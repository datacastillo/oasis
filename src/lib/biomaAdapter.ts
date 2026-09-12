import { NessieAccount, NessieTransaction, BiomaState } from '@/types/bioma';

export function calculateBiomaState(account: NessieAccount, transactions: NessieTransaction[]): BiomaState {
  const leaks = transactions.filter(t => 
    t.amount < 50 && (
      t.description.toLowerCase().includes('suscripción') || 
      t.description.toLowerCase().includes('inactivo') || 
      t.description.toLowerCase().includes('micro-app')
    )
  );

  const hydrationScore = Math.min(Math.max((account.balance / 5000) * 100, 10), 100);
  const soilHealth = Math.max(100 - (leaks.length * 20), 15);

  let weather: BiomaState['weather'] = 'sunny';
  if (hydrationScore < 30) weather = 'drought';
  else if (leaks.length >= 3) weather = 'storm';
  else if (hydrationScore < 60) weather = 'rainy';

  return {
    hydration: Math.round(hydrationScore),
    soilHealth: Math.round(soilHealth),
    weedCount: leaks.length,
    weather,
    score: Math.round((hydrationScore + soilHealth) / 2),
    activeLeaks: leaks.map(l => ({
      id: l._id,
      merchant: l.description,
      amount: l.amount,
      category: l.category || 'Varios'
    }))
  };
}