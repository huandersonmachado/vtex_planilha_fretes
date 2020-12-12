import FreightFormat from '@src/App/Support/FreightFormat';

export default interface CarriersRepositoryInterface {
    fetchValueFreight: (zipCodeStart: String, zipCodeEnd: String, cepOrigem: String, modalidade: number, weightStart: number, weightEnd: number) => FreightFormat | Boolean;
}