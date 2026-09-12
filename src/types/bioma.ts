export interface NessieAccount {
  _id: string;
  type: string;
  nickname: string;
  rewards: number;
  balance: number;
  customer_id: string;
}

export interface NessieTransaction {
  _id: string;
  type: string;
  merchant_id: string;
  amount: number;
  purchase_date: string;
  description: string;
  category?: string;
}

export interface BiomaState {
  hydration: number;      // 0 - 100: Nivel de liquidez/ahorro
  soilHealth: number;     // 0 - 100: Estabilidad del flujo
  weedCount: number;      // Cantidad de suscripciones fugadas (maleza 3D)
  weather: 'sunny' | 'rainy' | 'drought' | 'storm';
  score: number;          // 0 - 100: Score de bienestar cognitivo
  activeLeaks: Array<{
    id: string;
    merchant: string;
    amount: number;
    category: string;
  }>;
}