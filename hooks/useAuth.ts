import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase-config";
import { User, onAuthStateChanged } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      setTimeout(() => {
        setLoading(false);
      }, 2800);
    });

    return unsubscribe;
  }, []);

  console.log(user);

  return { user, loading };
};
