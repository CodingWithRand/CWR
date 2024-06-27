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

type DurationObject = {
    owner: string,
    // in minute
    duration: number
}

export type RouteStackParamList = {
    Credit: undefined,
    Registration: undefined,
    Dashboard: undefined, 
    UserDashboard?: {
        unit: string,
        plan: string,
        gathering: {
            name: string,
            body?: string[]
        },
        ranges?: RangeObject[],
        durations?: DurationObject[],
        isStrictMode: boolean
    }, 
    GuestDashboard: undefined, 
    UserDashboard2?: {
        unit: string,
        plan: string,
        gathering: {
            name: string,
            body?: string[]
        },
        ranges?: RangeObject[],
        durations?: DurationObject[],
        isStrictMode: boolean
    },
    Menu: {
        guest?: boolean
    }
}