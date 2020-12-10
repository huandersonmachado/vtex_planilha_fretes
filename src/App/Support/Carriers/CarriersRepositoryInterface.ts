import FreightFormat from '../FreightFormat';

export default interface CarriersRepositoryInterface {
    fetchValueFreight: () => FreightFormat[];
}