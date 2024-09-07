import { Courrier } from "./courrier.model";

export enum AutreDocumentType {
    CALENDRIER_SOLDE_PENSION,
    REMARQUES_OBSERVATION,
    LETTRES_NOTE 
}

export class AutreDocument extends Courrier {
    type: AutreDocumentType;

    constructor(titre: string, contenue: string, typeDeContenue: string, userId: string, typeDocument: string, type: AutreDocumentType) {
        super(titre, contenue, typeDeContenue, userId, typeDocument);
        this.type = type;
    }
}