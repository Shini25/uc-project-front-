import { User_account } from "../user.model";

export class Courrier {
  idCourrier?: number;
  titre: string;
  dateInsertion?: any;
  contenue: string;
  typeContenue: string;
  user_account: User_account;


  //constructeur
  constructor(titre: string, contenue: string, typeContenue: string, user_account: User_account) {
    this.titre = titre;
    this.contenue = contenue;
    this.typeContenue = typeContenue;
    this.user_account = user_account;
  }
}