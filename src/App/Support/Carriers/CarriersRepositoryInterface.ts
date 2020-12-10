import FreightFormat from '@src/App/Support/FreightFormat';

export default interface CarriersRepositoryInterface {
    fetchValueFreight: () => FreightFormat[];
}