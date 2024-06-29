export type RangeObject = {
    owner: string,
    startTime: {
        hour?: number,
        minute?: number
    },
    endTime: {
        hour?: number,
        minute?: number
    }
}

export type DurationObject = {
    owner: string,
    // in minute
    duration: number
}

type SettingsObject = {
    unit?: string,
    plan?: string,
    gathering: {
        name: string,
        body?: string[]
    },
    ranges?: RangeObject[],
    durations?: DurationObject[],
    isStrictMode?: boolean
}

export type RouteStackParamList = {
    Credit: undefined,
    Registration: undefined,
    Dashboard: undefined, 
    UserDashboard?: SettingsObject, 
    GuestDashboard: undefined, 
    UserDashboard2?: SettingsObject,
    Menu: {
        guest?: boolean
    },
    SettingsApplied: SettingsObject
}