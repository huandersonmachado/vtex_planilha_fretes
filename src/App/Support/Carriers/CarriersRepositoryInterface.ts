import FreightFormat from '@src/App/Support/FreightFormat';

export default interface CarriersRepositoryInterface {
    fetchValueFreight: (
        zipCodeStart: String, 
        zipCodeEnd: String, 
        cepOrigem: String, 
        modalidade: Number, 
        weightStart: Number, 
        weightEnd: Number) 
        => Boolean | FreightFormat;
}