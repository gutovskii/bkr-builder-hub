export class CreateBuildDto {
  name: string;
  price: number;
  description?: string;

  motherBoardId: string;
  cpuId: string;
  ssdsIds: string[];
  hddsIds: string[];
  memoriesIds: string[];
  videoCardsIds: string[];
  coolersIds: string[];
  powerSuppliesIds: string[];
  casesIds: string[];
}
