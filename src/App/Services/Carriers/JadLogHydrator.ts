import FreightFormat from './../../Support/FreightFormat';

export default class JadLogHydrator {
    parse(data: Object) {
        const format: FreightFormat = {
            zipCodeZtart: 'String',
            ZipCodeEnd: 'String',
            polygonName: 'String',
            weightStart: 'String',
            weightEnd: 'String',
            absoluteMoneyCost: 'String',
            pricePercent: 'String',
            maxVolume: 'String',
            timeCost: 'String',
            country: 'String',
            minimumValueInsurance: 'String',
        }
        return format
    }
}