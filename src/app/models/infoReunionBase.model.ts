export interface InfoReunionBase {
    id?: any;
    titre: string;
    dateReunion: string;
    lieu: string;
    objet: string;
    dateCreation?: string;
    ordreDuJourDescriptions: string[];
    responsablesMatricules: string[];
    participantsMatricules: string[];
  }