import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { profileApi } from '../db/api';
import { useAuth } from './useAuth';

export const useProfile = () => {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProfile = useCallback(async () => {
        const userId = user?._id || user?.id;
        console.log('[useProfile] Attempting load. User:', user);
        console.log('[useProfile] Derived UserId:', userId);

        if (!userId) {
            console.warn('[useProfile] No userId found in user object.');
            if (user) {
                setError("Authentication session is partially valid but missing ID. Please try logging out and back in.");
            }
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await profileApi.get(userId);
            const data = res.data || {};
            // Ensure skeletal structure
            setProfile({
                ...data,
                personal: data.personal || {},
                skills: data.skills || [],
                experience: data.experience || [],
                education: data.education || [],
                certifications: data.certifications || []
            });
            setError(null);
        } catch (err) {
            console.error("Error loading profile:", err);
            setError(err.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [user?._id, user?.id]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const saveProfile = async (updatedData) => {
        const userId = user?._id || user?.id;
        if (!userId) return;
        try {
            const res = await profileApi.update(userId, updatedData);
            setProfile(res.data);
            // Sync Auth User if personal name changed
            if (res.data.name !== user.name) {
                const newUser = { ...user, name: res.data.name };
                setUser(newUser);
                localStorage.setItem('career_vault_user', JSON.stringify(newUser));
            }
            return { success: true };
        } catch (err) {
            console.error("Error saving profile:", err);
            return { success: false, message: err.response?.data?.message || "Update failed" };
        }
    };

    return {
        profile,
        saveProfile,
        loading,
        error,
        refreshProfile: loadProfile
    };
};
