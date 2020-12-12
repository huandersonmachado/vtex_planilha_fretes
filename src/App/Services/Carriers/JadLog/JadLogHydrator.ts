import FreightFormat from '@src/App/Support/FreightFormat';

interface JadLogHydratorInterface {
    response: object, 
    zipCodeStart: String, 
    zipCodeEnd:String,
    weightEnd: number, 
    weightStart: number
}

export default class JadLogHydrator {
    parse({ response, zipCodeStart, zipCodeEnd, weightEnd, weightStart }: JadLogHydratorInterface) {
        const format: FreightFormat = {
            ZipCodeStart: zipCodeStart,
            ZipCodeEnd: zipCodeEnd,
            polygonName: '',
            weightStart,
            weightEnd,
            absoluteMoneyCost: response.vltotal,
            pricePercent: '',
            maxVolume: '',
            timeCost: response.prazo,
            country: 'BR',
            minimumValueInsurance: '',
        }
        return format
    }
}