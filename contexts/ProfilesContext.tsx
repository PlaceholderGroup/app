import { createContext, Dispatch, SetStateAction, useState } from "react";

import { profileObj } from "@/database/DBHelper";

type ProfilesContextType = {
    profiles: profileObj[];
    setProfiles: Dispatch<SetStateAction<profileObj[]>>;
};

export const ProfilesContext = createContext<ProfilesContextType>({
    profiles: [],
    setProfiles: () => { },
});

type ProfilesProviderType = {
    children: React.ReactNode;
    data: profileObj[];
};

export function ProfilesProvider({ children, data }: ProfilesProviderType) {
    const [profiles, setProfiles] = useState<profileObj[]>([]);

    return (
        <ProfilesContext.Provider value={{
            profiles,
            setProfiles,
        }}>
            {children}
        </ProfilesContext.Provider>
    );
};
