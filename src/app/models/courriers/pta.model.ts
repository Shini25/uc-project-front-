import { Courrier } from "./courrier.model";
import { User_account } from "../user.model";

export enum PtaType {
    SERVICE,
    GLOBAL
}
export enum SousType {
    SLP = "SLP",
    SODP = "SODP",
    SSDO = "SSDO",
    SVSP = "SVSP",
    SMSA = "SMSA",
    SCS = "SCS",
    SCPAE = "SCPAE",
    SISP = "SISP",
    DIGIT = "DIGIT",
    DGBF = "DGBF",
    DSP = "DSP",
    MEF = "MEF",
    PROG_130 = "PROG_130"

}

export class Pta extends Courrier {
    type!: PtaType;
    sousType!: SousType;
    valide: boolean;
    constructor(titre: string, contenue: string, typeDeContenue: string, user_account: User_account, type: PtaType, sousType: SousType ,valide: boolean) {
        super(titre, contenue, typeDeContenue, user_account);
        this.type = type ;
        this.sousType = sousType;
        this.valide = valide;
    }
}
