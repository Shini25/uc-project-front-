export interface UcPhoto {
  photo: string; 
}

export interface UcAttribution {
  attribution: string;
}

export interface UcMotDuChef {
  paragraphe: string;
}

export interface Uc {
  matricule: string;
  nom: string;
  prenoms: string;
  email: string;
  contact: string;
  photos: string[]; // Change to string array to hold base64 photos
  attributions: UcAttribution[];
  motDuChefs: UcMotDuChef[];
}