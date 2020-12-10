import FreightFormat from './../../Support/FreightFormat';

export default class JadLogHydrator {
    parse(data: Object) {
        const format = new FreightFormat();
            format.ZipCodeEnd = '';
            format.absoluteMoneyCost = '';
            format.country = '';
            format.polygonName = '';
            format.weightStart = '';
        return format;
    }
}