import { OtherParty } from "./other-party";

export class UpdateMediationRequest
{
    id : number = null;
    ownerId : number = null;
    languageId : number = null
    statusId : number = null;
    legalRFirmName : string = null;
    requesterSecondaryEmail : string = null;
    legalRTelephone : string = null;
    legalREmail : string = null;
    requesterSecondaryTelephone : string = null;
    legalRLawyerName : string = null;
    legalRAddress : string = null;
    caseNumber : string = null;
    stageClaims : string = null;
    hearingDetails : string = null;
    partiesAgreed : boolean = false;
    notifyParties : boolean = false;
    relevantInfo : string = null;
    fastTrack : boolean = null;
    mediatorByParty : boolean = null;
    datesToAvoid : string = null;
    otherLanguage : string = null;
    otherBackgrounf : string = null;
    monetaryValue : number = null;
    disputeDetails : string = null;
    requestedRelief : string = null;
    otherInfo : string = null;
    isSubmitted : boolean = false;
    disputeList : number[] = [];
    partyList : OtherParty[] = [];
    methodsList : number[] = [];
}