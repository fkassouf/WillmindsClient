export interface User
{
    id: string;
    entityId? : number;
    email: string;
    phoneNumber : string;
    name?: string;
    displayName: string;
    avatar? : string;
    status?: string;
    accessToken? : string;
    refreshToken? : string;
    validTo : Date;
    roles : any[];
}
