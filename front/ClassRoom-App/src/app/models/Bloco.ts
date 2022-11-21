import { Aula } from "./Aula";

export interface Bloco {
  id: number;
  nome: string;
  statusBloco: string;
  local: string;
  imageURL: string;
  aulas: Aula[];
}
