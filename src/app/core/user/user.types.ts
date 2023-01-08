export interface User
{
    id: string;
    email: string;
    name?: string;
    displayName: string;
    avatar? : string;
    status?: string;
    accessToken? : string;
    refreshToken? : string;
    validTo : Date;
}
