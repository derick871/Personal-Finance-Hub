import React, { Children, createContext, useEffect, useState } from 'react'

const financeContext = createContext();
export const financeProvider =({Children}) =>{
    const [user , setUser] = useState(null),
    const [transaction, setTransaction] = useState([]),
    const [loading, setLoading] = useState()

    useEffect(() => {
        const unsubscribe =onAuthStateChanged(auth,(currentUser)=>{
            setUser(currentUser);
          if (!currentUser) {
           setTransactions([]);
            setLoading(false);
        }
        })
        return unsubscribe

    },[]);

    useEffect(() =>{
        if(!user) return

        isLoading(true);
        const q=query(
            collection(db,"transactions"),
            where(uid), "==",(user.uid),
            orderBy("createdAt","desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(records);
      setLoading(false);
    });
    return unsubscribe

    },[user]);
    const loginWithGoogle =() => signInWithPopUp(auth,(googleprovider)),
    const logOutUser = () => signOut(auth),

    // Firestore Engine Operations
  const addTransaction = async (title, amount, type, category) => {
    if (!user) return;
    await addDoc(collection(db, "transactions"), {
      uid: user.uid,
      title,
      amount: parseFloat(amount),
      type, // 'income' or 'expense'
      category,
      createdAt: Date.now()
    });
  };
  const deleteTransaction = (sync) =>{
    awaitdeleteDoc(Doc(db, "transactio", "id"));
  };

function FinanceContext() {
  return (
    <div>FinanceContext</div>
  )
}

export default FinanceContext