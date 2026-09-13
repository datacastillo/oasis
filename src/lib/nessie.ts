const API_KEY = process.env.NEXT_PUBLIC_NESSIE_API_KEY;
const BASE_URL = '/nessie-api';
const SAVINGS_ACCOUNT_ID = "95cd998a-c449-4ede-bb80-2a0579538204"; 

// 🚨 CAMBIA A "false" SI LA API DE NESSIE VUELVE A FUNCIONAR
const USE_MOCK_DATA = true;

export async function fetchAccountDetails(accountId: string) {
  if (USE_MOCK_DATA) {
    // Respuesta simulada instantánea para que la UI cargue perfectamente
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      _id: accountId,
      type: "Savings",
      nickname: "Boveda Oasis",
      rewards: 1250,
      balance: 1000.00,
      account_number: "5386591063343974",
      customer_id: "58308617-d25e-469d-8235-64f06ed3211d",
      transactions: []
    };
  }

  // --- CÓDIGO REAL DE CONEXIÓN CON NESSIE ---
  if (!API_KEY) throw new Error("Falta NEXT_PUBLIC_NESSIE_API_KEY en .env.local");
  if (!accountId) throw new Error("No se proporcionó un accountId válido");

  const accountRes = await fetch(`${BASE_URL}/accounts/${accountId}?key=${API_KEY}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  
  if (!accountRes.ok) {
    const errorText = await accountRes.text();
    throw new Error(`Error de Nessie al buscar cuenta: ${errorText}`);
  }
  const accountData = await accountRes.json();

  let purchasesData = [];
  try {
    const purchasesRes = await fetch(`${BASE_URL}/accounts/${accountId}/purchases?key=${API_KEY}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (purchasesRes.ok) purchasesData = await purchasesRes.json();
  } catch (error) {
    console.warn("Consulta de compras omitida para Savings.", error);
  }

  return {
    ...accountData,
    transactions: Array.isArray(purchasesData) ? purchasesData : []
  };
}

export async function executeMicroSavings(payerAccountId: string, amount: number) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      code: 201,
      message: "Transferencia simulada ejecutada con éxito",
      toAccount: SAVINGS_ACCOUNT_ID,
      amount: amount
    };
  }

  // --- CÓDIGO REAL DE TRANSFERENCIA ---
  const transferRes = await fetch(`${BASE_URL}/accounts/${payerAccountId}/transfers?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      medium: "balance",
      payee_id: SAVINGS_ACCOUNT_ID,
      amount: Number(amount.toFixed(2)),
      transaction_date: new Date().toISOString().split('T')[0],
      description: "Oasis AI: Saneamiento y Micro-Ahorro Automático"
    })
  });

  if (!transferRes.ok) {
    const errorText = await transferRes.text();
    throw new Error(`Rechazado por Nessie: ${errorText}`);
  }

  return await transferRes.json();
}