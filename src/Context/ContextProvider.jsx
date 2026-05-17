import React from 'react';
import { useFinance } from './Components/FinanceContext';

const TransactionList = () => {
    // Destructure exactly what this component needs
    const { transactions, deleteTransaction, loading } = useFinance();

    if (loading) return <p>Loading your finances...</p>;

    return (
        <ul>
            {transactions.map((tx) => (
                <li key={tx.id}>
                    {tx.title} - KES {tx.amount} ({tx.type})
                    <button onClick={() => deleteTransaction(tx.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
};

export default TransactionList;