import { LanguageLevel } from "./language-level";

export interface MediatorModel
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
    nationality : string;
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
    languageLevel : LanguageLevel[];
    disputeExpertise : any[];
    disputeBackground : any[];
    image : string;
}