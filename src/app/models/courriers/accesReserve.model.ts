import { Courrier } from "./courrier.model";

export class AccesReserve extends Courrier {
    type: AccesReserveType;

    constructor(titre: string, contenue: string, typeDeContenue: string, userId: string, typeDocument: string, type: AccesReserveType) {
        super(titre, contenue, typeDeContenue, userId, typeDocument);
        this.type = type;
    }
}

export enum AccesReserveType {
    TABLEAU_DE_BORD_EXECUTION_BUDGETAIRE,
}