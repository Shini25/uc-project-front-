export interface InfoMeetingBase {
    id?: any;
    meetingDate: any;
    location: string;
    objet: string;
    meetingType: string;
    dateCreation?: any;
    ModificationDate?: any;
    logistics: string[];
    organizersMail: string[];
    participantsMail: string[];
    observations: string[];
    attendanceSheet: string;
    fileType?: any;
    addby?: string;
    modifyby?: string;
}