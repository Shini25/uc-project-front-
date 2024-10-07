export interface OrganizationalChart {
    id: number;
    createdate?: Date;
    updatedate?: Date;
    content: string[];
    addby: string;
    updateby?: string;
    type: string;
}