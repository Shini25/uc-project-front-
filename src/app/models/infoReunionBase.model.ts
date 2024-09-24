export interface InfoReunionBase {
    id?: any;
    titre: string;
    dateReunion: string;
    lieu: string;
    objet: string;
    dateCreation?: string;
    logistique: string[];
    responsablesMail: string[];
    participantsMail: string[];
    observation: string[];
  }