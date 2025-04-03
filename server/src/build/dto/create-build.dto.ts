export class CreateBuildDto {
  name: string;
  price: number;

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
