import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const useProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const docRef = doc(db, 'users', user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const updateProfile = async (newData: any) => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.id);
      await updateDoc(docRef, newData);
      setProfileData((prev: any) => ({ ...prev, ...newData }));
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return { profileData, loading, saving, updateProfile, user };
};
