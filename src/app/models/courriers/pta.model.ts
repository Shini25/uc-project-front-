import { Courrier } from "./courrier.model";
import { User_account } from "../user.model";

export enum PtaType {
    DSP,
    DGBF,
    MEF,
    SERVICE,
    PROG_130,
    EXECUTION_DAAF,
    EXECUTION_SSB,
    FEUILLE_DE_ROUTE,
    PIP,
    PSMFP,
    EXECUTION_BUDGETAIRE_DSP_DGEAE,
    GRANDES_REALISATIONS,
    CEB,
    AUTRES
}

export class Pta extends Courrier {
    type: PtaType;

    constructor(titre: string, contenue: string, typeDeContenue: string, user_account: User_account, type: PtaType) {
        super(titre, contenue, typeDeContenue, user_account);
        this.type = type;
    }
}
