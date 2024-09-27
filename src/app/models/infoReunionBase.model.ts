export interface InfoReunionBase {
    id?: any;
    titre: string;
    dateReunion: any;
    lieu: string;
    objet: string;
    reunionType: string;
    dateCreation?: any;
    logistique: string[];
    responsablesMail: string[];
    participantsMail: string[];
    observation: string[];
  }