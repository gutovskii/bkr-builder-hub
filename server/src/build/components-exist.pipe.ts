import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateBuildDto } from './dto/create-build.dto';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import {
  CaseComponent,
  CoolerComponent,
  CpuComponent,
  HddComponent,
  MemoryComponent,
  MotherboardComponent,
  PowerSupplyComponent,
  PrismaClient,
  SsdComponent,
  VideoCardComponent,
} from '@prisma/client';

export class CreateFullBuildDto {
  name: string;
  price: number;
  description?: string;

  motherBoard?: MotherboardComponent;
  cpu?: CpuComponent;
  ssds?: SsdComponent[];
  hdds?: HddComponent[];
  memories?: MemoryComponent[];
  videoCards?: VideoCardComponent[];
  coolers?: CoolerComponent[];
  powerSupplies?: PowerSupplyComponent[];
  cases?: CaseComponent[];
}

@Injectable()
export class ComponentsExistPipe implements PipeTransform {
  constructor(@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaClient) {}

  async transform(buildDto: CreateBuildDto): Promise<CreateFullBuildDto> {
    console.log(buildDto);

    const fullBuildDto: CreateFullBuildDto = {
      name: buildDto.name,
      price: buildDto.price,
      description: buildDto.description,
    };

    if (buildDto.motherBoardId) {
      const motherBoard = await this.prisma.motherboardComponent.findFirst({
        where: { id: buildDto.motherBoardId },
      });
      if (!motherBoard) {
        throw new BadRequestException(
          `Motherboard ${buildDto.motherBoardId} not found`,
        );
      }
      fullBuildDto.motherBoard = motherBoard;
    }

    if (buildDto.cpuId) {
      const cpu = await this.prisma.cpuComponent.findFirst({
        where: { id: buildDto.cpuId },
      });
      if (!cpu) {
        throw new BadRequestException(`CPU ${buildDto.cpuId} not found`);
      }
      fullBuildDto.cpu = cpu;
    }

    if (typeof buildDto.ssdsIds === 'string')
      buildDto.ssdsIds = [buildDto.ssdsIds];
    if (Array.isArray(buildDto.ssdsIds) && buildDto.ssdsIds.length) {
      const ssds = await Promise.all(
        buildDto.ssdsIds.map((ssdId) =>
          this.prisma.ssdComponent.findFirst({
            where: { id: ssdId },
          }),
        ),
      );
      if (ssds.some((ssd) => ssd === null)) {
        throw new BadRequestException(`Some SSD was not found`);
      }
      fullBuildDto.ssds = ssds;
    }

    if (typeof buildDto.hddsIds === 'string')
      buildDto.hddsIds = [buildDto.hddsIds];
    if (Array.isArray(buildDto.hddsIds) && buildDto.hddsIds.length) {
      const hdds = await Promise.all(
        buildDto.hddsIds.map((hddId) =>
          this.prisma.hddComponent.findFirst({
            where: { id: hddId },
          }),
        ),
      );
      if (hdds.some((hdd) => hdd === null)) {
        throw new BadRequestException(`Some HDD was not found`);
      }
      fullBuildDto.hdds = hdds;
    }

    if (typeof buildDto.memoriesIds === 'string')
      buildDto.memoriesIds = [buildDto.memoriesIds];
    if (Array.isArray(buildDto.memoriesIds) && buildDto.memoriesIds.length) {
      const memories = await Promise.all(
        buildDto.memoriesIds.map((memoryId) =>
          this.prisma.memoryComponent.findFirst({
            where: { id: memoryId },
          }),
        ),
      );
      if (memories.some((memory) => memory === null)) {
        throw new BadRequestException(`Some Memory was not found`);
      }
      fullBuildDto.memories = memories;
    }

    if (typeof buildDto.videoCardsIds === 'string')
      buildDto.videoCardsIds = [buildDto.videoCardsIds];
    if (
      Array.isArray(buildDto.videoCardsIds) &&
      buildDto.videoCardsIds.length
    ) {
      const videoCards = await Promise.all(
        buildDto.videoCardsIds.map((videoCardId) =>
          this.prisma.videoCardComponent.findFirst({
            where: { id: videoCardId },
          }),
        ),
      );
      if (videoCards.some((videoCard) => videoCard === null)) {
        throw new BadRequestException(`Some VideoCard was not found`);
      }
      fullBuildDto.videoCards = videoCards;
    }

    if (typeof buildDto.coolersIds === 'string')
      buildDto.coolersIds = [buildDto.coolersIds];
    if (Array.isArray(buildDto.coolersIds) && buildDto.coolersIds.length) {
      const coolers = await Promise.all(
        buildDto.coolersIds.map((coolerId) =>
          this.prisma.coolerComponent.findFirst({
            where: { id: coolerId },
          }),
        ),
      );
      if (coolers.some((cooler) => cooler === null)) {
        throw new BadRequestException(`Some Cooler was not found`);
      }
      fullBuildDto.coolers = coolers;
    }

    if (typeof buildDto.powerSuppliesIds === 'string')
      buildDto.powerSuppliesIds = [buildDto.powerSuppliesIds];
    if (
      Array.isArray(buildDto.powerSuppliesIds) &&
      buildDto.powerSuppliesIds.length
    ) {
      const powerSupplies = await Promise.all(
        buildDto.powerSuppliesIds.map((powerSupplyId) =>
          this.prisma.powerSupplyComponent.findFirst({
            where: { id: powerSupplyId },
          }),
        ),
      );
      if (powerSupplies.some((powerSupply) => powerSupply === null)) {
        throw new BadRequestException(`Some PowerSupply was not found`);
      }
      fullBuildDto.powerSupplies = powerSupplies;
    }

    if (typeof buildDto.casesIds === 'string')
      buildDto.casesIds = [buildDto.casesIds];
    if (Array.isArray(buildDto.casesIds) && buildDto.casesIds.length) {
      const cases = await Promise.all(
        buildDto.casesIds.map((caseId) =>
          this.prisma.caseComponent.findFirst({
            where: { id: caseId },
          }),
        ),
      );
      if (cases.some((theCase) => theCase === null)) {
        throw new BadRequestException(`Some Case was not found`);
      }
      fullBuildDto.cases = cases;
    }

    return fullBuildDto;
  }
}
