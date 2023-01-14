import { LanguageLevel } from "./language-level";

export interface RegisterMediator
{
    title : string;
    fullName : string;
    jobTitle : string;
    firm : string;
    address : string;
    telephone : string;
    email : string;
    accrediation : string;
    nationalityId : number;
    jurisdiction : string;
    linkedInUrl : string;
    conductMediation : boolean;
    experienceYears : number;
    mediationNumber : number;
    mediationHours : number;
    mediationMembership : string;
    otherExperience : string;
    trainingDev : string;
    otherMatters : string;
    otherMediationsAreas : string;
    otherDisputeAreas : string;
    languageLevels : LanguageLevel[];
    disputes : number[];
    expertise : number[];
    image : File | null;
}