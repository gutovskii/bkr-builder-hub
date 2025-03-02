-- CreateTable
CREATE TABLE "UserEntity" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildEntity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "motherBoardId" TEXT,
    "cpuId" TEXT,

    CONSTRAINT "BuildEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseComponent" (
    "id" TEXT NOT NULL,
    "componentUnifiedName" TEXT NOT NULL,
    "componentType" TEXT NOT NULL,
    "lowestPrice" DECIMAL(65,30),
    "highestRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "warranty" TEXT,
    "isNotAvailableCandidate" BOOLEAN NOT NULL DEFAULT false,
    "isNotAvailable" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BaseComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseComponent" (
    "id" TEXT NOT NULL,
    "color" TEXT,
    "maxVideoCardLength" TEXT,
    "motherBoardFormFactors" TEXT,
    "physicalDimensions" TEXT,
    "maxCoolerHeight" TEXT,
    "expansionSlots" TEXT,
    "caseType" TEXT,
    "material" TEXT,

    CONSTRAINT "CaseComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoolerComponent" (
    "id" TEXT NOT NULL,
    "size" TEXT,
    "weight" TEXT,
    "maxNoiseLevel" TEXT,
    "socker" TEXT,
    "color" TEXT,
    "ratedVoltage" TEXT,

    CONSTRAINT "CoolerComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CpuComponent" (
    "id" TEXT NOT NULL,
    "manufacturer" TEXT,
    "series" TEXT,
    "processorGeneration" TEXT,
    "socket" TEXT,
    "coreCount" TEXT,
    "threadCount" TEXT,
    "tpd" TEXT,
    "maxSupportedMemory" TEXT,
    "lithografy" TEXT,

    CONSTRAINT "CpuComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HddComponent" (
    "id" TEXT NOT NULL,
    "serias" TEXT,
    "formFactor" TEXT,
    "maxRotationSpeed" TEXT,
    "weight" TEXT,
    "physicalDimensions" TEXT,
    "noiseLevel" TEXT,
    "compatability" TEXT,
    "color" TEXT,
    "connectionInterface" TEXT,
    "writingTechnology" TEXT,

    CONSTRAINT "HddComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryComponent" (
    "id" TEXT NOT NULL,
    "memoryType" TEXT,
    "memoryFrequence" TEXT,
    "volume" TEXT,
    "numberOfSlots" TEXT,
    "formFactor" TEXT,
    "effectiveThroughput" TEXT,

    CONSTRAINT "MemoryComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotherboardComponent" (
    "id" TEXT NOT NULL,
    "manufacturer" TEXT,
    "socker" TEXT,
    "formFactor" TEXT,
    "chipset" TEXT,
    "memoryType" TEXT,
    "memoryMax" TEXT,
    "memorySlots" TEXT,
    "physicalDimensions" TEXT,
    "maxFrequencyOfRAM" TEXT,

    CONSTRAINT "MotherboardComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PowerSupplyComponent" (
    "id" TEXT NOT NULL,
    "formFactor" TEXT,
    "weight" TEXT,
    "power" TEXT,
    "physicalDimensions" TEXT,
    "specification" TEXT,

    CONSTRAINT "PowerSupplyComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SsdComponent" (
    "id" TEXT NOT NULL,
    "volume" TEXT,
    "serias" TEXT,
    "readingSpeed" TEXT,
    "writingSpeed" TEXT,
    "connectionInterface" TEXT,
    "physicalDimensions" TEXT,
    "formFactor" TEXT,
    "weight" TEXT,
    "compatability" TEXT,

    CONSTRAINT "SsdComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoCardComponent" (
    "id" TEXT NOT NULL,
    "volume" TEXT,
    "memoryType" TEXT,
    "color" TEXT,
    "chipset" TEXT,
    "connectionInterface" TEXT,
    "bitCapacityOfTheMemoryBus" TEXT,
    "memoryFrequency" TEXT,
    "coreFrequency" TEXT,
    "connectors" TEXT,

    CONSTRAINT "VideoCardComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BuildEntityToSsdComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildEntityToSsdComponent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BuildEntityToHddComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildEntityToHddComponent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BuildEntityToMemoryComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildEntityToMemoryComponent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BuildEntityToVideoCardComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildEntityToVideoCardComponent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BuildEntityToCoolerComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildEntityToCoolerComponent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BuildEntityToPowerSupplyComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildEntityToPowerSupplyComponent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BuildEntityToCaseComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildEntityToCaseComponent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BaseComponentToUserEntity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BaseComponentToUserEntity_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEntity_nickname_key" ON "UserEntity"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "UserEntity_email_key" ON "UserEntity"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BaseComponent_componentUnifiedName_key" ON "BaseComponent"("componentUnifiedName");

-- CreateIndex
CREATE INDEX "_BuildEntityToSsdComponent_B_index" ON "_BuildEntityToSsdComponent"("B");

-- CreateIndex
CREATE INDEX "_BuildEntityToHddComponent_B_index" ON "_BuildEntityToHddComponent"("B");

-- CreateIndex
CREATE INDEX "_BuildEntityToMemoryComponent_B_index" ON "_BuildEntityToMemoryComponent"("B");

-- CreateIndex
CREATE INDEX "_BuildEntityToVideoCardComponent_B_index" ON "_BuildEntityToVideoCardComponent"("B");

-- CreateIndex
CREATE INDEX "_BuildEntityToCoolerComponent_B_index" ON "_BuildEntityToCoolerComponent"("B");

-- CreateIndex
CREATE INDEX "_BuildEntityToPowerSupplyComponent_B_index" ON "_BuildEntityToPowerSupplyComponent"("B");

-- CreateIndex
CREATE INDEX "_BuildEntityToCaseComponent_B_index" ON "_BuildEntityToCaseComponent"("B");

-- CreateIndex
CREATE INDEX "_BaseComponentToUserEntity_B_index" ON "_BaseComponentToUserEntity"("B");

-- AddForeignKey
ALTER TABLE "BuildEntity" ADD CONSTRAINT "BuildEntity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildEntity" ADD CONSTRAINT "BuildEntity_motherBoardId_fkey" FOREIGN KEY ("motherBoardId") REFERENCES "MotherboardComponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildEntity" ADD CONSTRAINT "BuildEntity_cpuId_fkey" FOREIGN KEY ("cpuId") REFERENCES "CpuComponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseComponent" ADD CONSTRAINT "CaseComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoolerComponent" ADD CONSTRAINT "CoolerComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CpuComponent" ADD CONSTRAINT "CpuComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HddComponent" ADD CONSTRAINT "HddComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryComponent" ADD CONSTRAINT "MemoryComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotherboardComponent" ADD CONSTRAINT "MotherboardComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerSupplyComponent" ADD CONSTRAINT "PowerSupplyComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SsdComponent" ADD CONSTRAINT "SsdComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCardComponent" ADD CONSTRAINT "VideoCardComponent_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToSsdComponent" ADD CONSTRAINT "_BuildEntityToSsdComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "BuildEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToSsdComponent" ADD CONSTRAINT "_BuildEntityToSsdComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "SsdComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToHddComponent" ADD CONSTRAINT "_BuildEntityToHddComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "BuildEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToHddComponent" ADD CONSTRAINT "_BuildEntityToHddComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "HddComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToMemoryComponent" ADD CONSTRAINT "_BuildEntityToMemoryComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "BuildEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToMemoryComponent" ADD CONSTRAINT "_BuildEntityToMemoryComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "MemoryComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToVideoCardComponent" ADD CONSTRAINT "_BuildEntityToVideoCardComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "BuildEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToVideoCardComponent" ADD CONSTRAINT "_BuildEntityToVideoCardComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoCardComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToCoolerComponent" ADD CONSTRAINT "_BuildEntityToCoolerComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "BuildEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToCoolerComponent" ADD CONSTRAINT "_BuildEntityToCoolerComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "CoolerComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToPowerSupplyComponent" ADD CONSTRAINT "_BuildEntityToPowerSupplyComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "BuildEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToPowerSupplyComponent" ADD CONSTRAINT "_BuildEntityToPowerSupplyComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "PowerSupplyComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToCaseComponent" ADD CONSTRAINT "_BuildEntityToCaseComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "BuildEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildEntityToCaseComponent" ADD CONSTRAINT "_BuildEntityToCaseComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "CaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseComponentToUserEntity" ADD CONSTRAINT "_BaseComponentToUserEntity_A_fkey" FOREIGN KEY ("A") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseComponentToUserEntity" ADD CONSTRAINT "_BaseComponentToUserEntity_B_fkey" FOREIGN KEY ("B") REFERENCES "UserEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
