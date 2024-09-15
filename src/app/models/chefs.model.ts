export interface UcPhoto {
  photo: string; 
}

export interface UcAttribution {
  attribution: string;
}

export interface UcMotDuChef {
  paragraphe: string;
}

export interface Chefs {
  numero: string;
  nom: string;
  prenoms: string;
  email: string;
  contact: string;
  typeDeChef: string;
  photos: string[];
  attributions: UcAttribution[];
  motDuChefs: UcMotDuChef[];
}