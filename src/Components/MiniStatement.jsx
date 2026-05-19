// --- MINI-STATEMENT ENGINE ---
const miniStatement = useMemo(() => {
  // 1. Filter based on selected vector type
  let filtered = [...transactions];
  if (statementType !== 'All') {
    filtered = filtered.filter(tx => tx.type === statementType);
  }

  // 2. Sort chronologically (Most recent mutations at the top)
  const sorted = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 3. Constrain by depth limit parameters
  const records = sorted.slice(0, statementLimit);

  // 4. Run real-time aggregate summation for the specific chunk
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