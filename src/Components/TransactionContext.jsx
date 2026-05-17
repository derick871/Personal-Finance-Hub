import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';

// 1. Initialize Context
const FinanceContext = createContext();

// 2. Main Context Provider Engine
export const FinanceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state cleanly with Firebase Auth observers
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Wipe state data if user logs out
      if (!currentUser) {
        setTransactions([]);
        setLoading(false);
      }
    });
    return unsubscribe; // Clean up listener subscriptions on unmount
  }, []);

  // Listen to Firestore real-time collection streams matching user unique ID (UID)
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Filter database to fetch documents owned by the active user, sorted by date
    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    // Live update snapshot socket
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(records);
      setLoading(false);
    }, (error) => {
      console.error("Firestore database connection failed:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Auth Action Handlers
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logoutUser = () => signOut(auth);

  // Firestore DB Action Handlers
  const addTransaction = async (title, amount, type, category) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        title,
        amount: parseFloat(amount),
        type, // expecting values: 'income' or 'expense'
        category,
        createdAt: Date.now()
      });
    } catch (err) {
      console.error("Failed to commit new entry to the cloud: ", err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (err) {
      console.error("Failed to remove document profile: ", err);
    }
  };

  // Expose system arrays and global action modules to React children components
  return (
    <FinanceContext.Provider value={{ 
      user, 
      transactions, 
      loading, 
      loginWithGoogle, 
      logoutUser, 
      addTransaction, 
      deleteTransaction 
     }}>
      {children}
    </FinanceContext.Provider>
  );
};

// 3. Export Global Custom Consumption Hook 
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be wrapped inside a valid FinanceProvider structural tag.');
  }
  return context;
};
export default FinanceProvider;
