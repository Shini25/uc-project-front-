import { Courrier } from "./courrier.model";

export enum TexteType {
    TEXTES_LEGISLATIF
}

export class Texte extends Courrier {
    type: TexteType;

    constructor(titre: string, contenue: string, typeDeContenue: string, userId: string, typeDocument: string, type: TexteType) {
        super(titre, contenue, typeDeContenue, userId, typeDocument);
        this.type = type;
    }
}