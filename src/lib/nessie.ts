import { NessieAccount, NessieTransaction } from '@/types/bioma';

const BASE_URL = process.env.NEXT_PUBLIC_NESSIE_BASE_URL || 'http://api.nessieisreal.com';
const API_KEY = process.env.NEXT_PUBLIC_NESSIE_API_KEY || '';

export async function fetchAccountDetails(accountId: string): Promise<NessieAccount | null> {
  try {
    const res = await fetch(`${BASE_URL}/accounts/${accountId}?key=${API_KEY}`);
    if (!res.ok) throw new Error('Error al obtener la cuenta de Nessie');
    return await res.json();
  } catch (error) {
    console.warn('Usando datos Mock de Nessie para la cuenta:', error);
    return {
      _id: accountId,
      type: 'Checking',
      nickname: 'Cuenta Principal Alex',
      rewards: 120,
      balance: 3450.50,
      customer_id: 'cust_101'
    };
  }
}

export async function fetchTransactions(accountId: string): Promise<NessieTransaction[]> {
  try {
    const res = await fetch(`${BASE_URL}/accounts/${accountId}/purchases?key=${API_KEY}`);
    if (!res.ok) throw new Error('Error al obtener transacciones de Nessie');
    return await res.json();
  } catch (error) {
    console.warn('Usando transacciones Mock de Nessie:', error);
    return [
      { _id: 'tx_1', type: 'merchant', merchant_id: 'm_netflix', amount: 15.99, purchase_date: '2026-09-01', description: 'Suscripción Streaming', category: 'Entertainment' },
      { _id: 'tx_2', type: 'merchant', merchant_id: 'm_gym', amount: 45.00, purchase_date: '2026-09-02', description: 'Gimnasio Inactivo', category: 'Health' },
      { _id: 'tx_3', type: 'merchant', merchant_id: 'm_coffee', amount: 5.50, purchase_date: '2026-09-10', description: 'Cafetería de Especialidad', category: 'Food' },
      { _id: 'tx_4', type: 'merchant', merchant_id: 'm_app', amount: 9.99, purchase_date: '2026-09-11', description: 'Micro-App Inactiva', category: 'Software' }
    ];
  }
}

export async function executeMicroSavings(accountId: string, amount: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/accounts/${accountId}/deposits?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medium: 'balance',
        transaction_date: new Date().toISOString().split('T')[0],
        amount: amount,
        description: 'Auto-Saneamiento Oasis AI'
      })
    });
    return res.ok;
  } catch (error) {
    console.log('Simulación de transferencia ejecutada en Mock Mode');
    return true;
  }
}