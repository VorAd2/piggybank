/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const ProfileContext = createContext()

export const ProfileProvider = ({children}) => {
    const [profileData, setData] = useState(null)

    const setProfileData = (data, profileDataType) => {
        const ternary = (profileDataType === 'EntityData' ? 'entity' : 'user')
        localStorage.setItem('profileType', ternary)
        localStorage.setItem(profileDataType, JSON.stringify(data))
        setData(data)
    }

    const clearProfileData = () => {
        localStorage.clear()
        setData(null)
    }

    return (
        <ProfileContext.Provider value={ {profileData, setProfileData, clearProfileData} }>
            {children}
        </ProfileContext.Provider>
    )
}