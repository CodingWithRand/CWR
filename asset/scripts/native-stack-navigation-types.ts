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
        ranges?: RangeObject[]
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
        isStrictMode: boolean
    },
    Menu: {
        guest?: boolean
    }
}