import { Courrier } from "./courrier.model";
import { User_account } from "../user.model";

export class TableauDeBord extends Courrier {
    type: TableauDeBordType;

    constructor(titre: string, contenue: string, typeDeContenue: string, user_account: User_account, type: TableauDeBordType) {
        super(titre, contenue, typeDeContenue, user_account);
        this.type = type;
    }
}

export enum TableauDeBordType {
    TABLEAU_DE_BORD_EXECUTION_BUDGETAIRE,
}