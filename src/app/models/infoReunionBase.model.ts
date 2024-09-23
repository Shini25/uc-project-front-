export interface InfoReunionBase {
    id?: any;
    titre: string;
    dateReunion: string;
    lieu: string;
    objet: string;
    dateCreation?: string;
    logistique: string[];
    responsablesMatricules: string[];
    participantsMatricules: string[];
    observations: string[];
  }