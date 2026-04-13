/**
 * @description Manages the active profile (dev or netsec) for the dual-profile portfolio.
 *              The selected profile is persisted in localStorage.
 */

import React, { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'portfolio-active-profile'

const PROFILES = [
    {
        id: 'dev',
        faIcon: 'fa-solid fa-code',
        locales: {
            fr: { name: 'Full Stack Dev' },
            en: { name: 'Full Stack Dev' }
        }
    },
    {
        id: 'netsec',
        faIcon: 'fa-solid fa-shield-halved',
        locales: {
            fr: { name: 'Réseau & Sécurité' },
            en: { name: 'Network & Security' }
        }
    }
]

function ProfileProvider({ children }) {
    const [activeProfileId, setActiveProfileId] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) || PROFILES[0].id
    })

    const setProfile = (profileId) => {
        localStorage.setItem(STORAGE_KEY, profileId)
        setActiveProfileId(profileId)
    }

    const getActiveProfile = () => PROFILES.find(p => p.id === activeProfileId) || PROFILES[0]

    const getProfiles = () => PROFILES

    return (
        <ProfileContext.Provider value={{ activeProfileId, setProfile, getActiveProfile, getProfiles }}>
            {children}
        </ProfileContext.Provider>
    )
}

const ProfileContext = createContext(null)

/**
 * @return {{
 *    activeProfileId: string,
 *    setProfile: Function,
 *    getActiveProfile: Function,
 *    getProfiles: Function
 * }}
 */
export const useProfile = () => useContext(ProfileContext)

export default ProfileProvider
