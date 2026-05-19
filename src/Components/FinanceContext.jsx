import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebaseConfig';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setTransactions([]);
        setLoading(false);
      }
    });
    return unsubscribe; 
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(records);
      setLoading(false);
    }, (error) => {
      console.error("Firestore initialization sync failure:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Unified Action Providers
  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logoutUser = () => signOut(auth);

  const addTransaction = async (description, amount, type, category, date) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        description,
        amount: parseFloat(amount),
        type, 
        category,
        date,
        createdAt: Date.now()
      });
    } catch (err) {
      console.error("Cloud database transaction insertion failure: ", err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (err) {
      console.error("Document reference removal error: ", err);
    }
  };

  return (
    <FinanceContext.Provider value={{ 
      user, 
      transactions, 
      loading, 
      registerWithEmail,
      loginWithEmail,
      loginWithGoogle, 
      logoutUser, 
      addTransaction, 
      deleteTransaction 
    }}>
      {!loading && children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be wrapped inside a valid FinanceProvider structure.');
  return context;
};
//export const googleProvider = new GoogleAuthProvider();
export default FinanceContext;
