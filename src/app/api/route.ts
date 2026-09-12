import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { calculateBiomaState } from '@/lib/biomaAdapter';
import { NessieAccount, NessieTransaction } from '@/types/bioma';

// Esquema de validación estricto con Zod
const BiomaSchema = z.object({
  hydration: z.number().min(0).max(100),
  soilHealth: z.number().min(0).max(100),
  weedCount: z.number().min(0),
  weather: z.enum(['sunny', 'rainy', 'drought', 'storm']),
  score: z.number().min(0).max(100),
  recommendationMessage: z.string(),
  activeLeaks: z.array(
    z.object({
      id: z.string(),
      merchant: z.string(),
      amount: z.number(),
      category: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    body = {};
  }

  const { account, transactions }: { account?: NessieAccount; transactions?: NessieTransaction[] } = body;

  const defaultAccount = account || {
    _id: 'acc_demo',
    type: 'Checking',
    nickname: 'Cuenta Principal',
    rewards: 100,
    balance: 3450.50,
    customer_id: 'cust_1'
  };

  const defaultTransactions = transactions || [
    { _id: 'tx_1', type: 'merchant', merchant_id: 'm_1', amount: 15.99, purchase_date: '2026-09-01', description: 'Suscripción Streaming', category: 'Entertainment' },
    { _id: 'tx_2', type: 'merchant', merchant_id: 'm_2', amount: 45.00, purchase_date: '2026-09-02', description: 'Gimnasio Inactivo', category: 'Health' }
  ];

  // Si está activo el modo MOCK o no hay API Key de OpenAI, se utiliza el adaptador determínico directo
  if (process.env.USE_MOCK_AI === 'true' || !process.env.OPENAI_API_KEY) {
    const fallbackState = calculateBiomaState(defaultAccount, defaultTransactions);
    return NextResponse.json({
      ...fallbackState,
      recommendationMessage: `[Jardinero IA]: Hola Alex. Detecté ${fallbackState.weedCount} malezas parásitas en tu jardín por un total de $${fallbackState.activeLeaks.reduce((acc, l) => acc + l.amount, 0).toFixed(2)} USD. ¿Podamos estas fugas para que vuelva a llover liquidez?`
    });
  }

  try {
    const prompt = `
    Eres "El Jardinero", un copiloto financiero empático para personas neurodivergentes (TDAH) y usuarios con ceguera monetaria.
    Analiza esta cuenta bancaria de Capital One Nessie:
    - Balance actual: $${defaultAccount.balance}
    - Transacciones recientes: ${JSON.stringify(defaultTransactions)}

    Evalúa la salud del bioma 3D:
    - Hydration (0-100): Basado en la liquidez y solvencia.
    - SoilHealth (0-100): Salud general del suelo.
    - WeedCount: Cantidad de suscripciones inactivas o fugas detectadas.
    - Weather: 'sunny' (excelente), 'rainy' (precaución), 'drought' (bajo saldo), 'storm' (múltiples fugas).
    - RecommendationMessage: Mensaje breve, empático y constructivo (máximo 2 oraciones) proponiendo podar las fugas.
    `;

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: BiomaSchema,
      prompt,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.warn('Fallo o latencia en la API de OpenAI. Ejecutando fallback determínico inmediato:', error);
    const fallbackState = calculateBiomaState(defaultAccount, defaultTransactions);
    return NextResponse.json({
      ...fallbackState,
      recommendationMessage: `[Jardinero IA]: Detecté ${fallbackState.weedCount} suscripciones inactivas. Sanearlas aumentará la hidratación de tu ecosistema.`
    });
  }
}