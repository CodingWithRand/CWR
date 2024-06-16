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
        isStrictMode: boolean
    }
}