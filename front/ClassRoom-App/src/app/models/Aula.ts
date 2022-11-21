import { Bloco } from "./Bloco";

export interface Aula {
  id: number;
  nome: string;
  curso: string;
  dataAula?: Date;
  nomeProfessor: string;
  blocoId: number;
  bloco: Bloco[];
}
