export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const formatCamelCaseToSentence = (str: string): string => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .replace(/^./, (char) => char.toUpperCase());
};
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
};
export const componentTypeToUkranian = (componentType: string) => {
    return {
        cpuComponent: 'Процесори',
        motherboardComponent: 'Материнські плати',
        ssdComponent: 'ССД диски',
        hddComponent: 'Жорсткі диски',
        memoryComponent: 'Оперативна пам\'ять',
        powerSupplyComponent: 'Джерела живлення',
        coolerComponent: 'Кулери',
        caseComponent: 'Кейси',
        videoCardComponent: 'Відеокарти',
    }[componentType];
}