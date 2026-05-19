// --- MINI-STATEMENT ENGINE ---
const miniStatement = useMemo(() => {
  //  vector type
  let filtered = [...transactions];
  if (statementType !== 'All') {
    filtered = filtered.filter(tx => tx.type === statementType);
  }

  const sorted = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  //  limit parameters
  const records = sorted.slice(0, statementLimit);

  // real-time aggregate summation 
  let internalSum = 0;
  records.forEach(tx => {
    internalSum += tx.amount;
  });

  return {
    records,
    volume: records.length,
    aggregateValue: internalSum,
    generatedAt: new Date().toLocaleTimeString()
  };
}, [transactions, statementType, statementLimit]);