import JadLogHydrator from './JadLogHydrator';
import CarriersRepositoryInterface from '../../Support/Carriers/CarriersRepositoryInterface';

export default class JadLogRepository implements CarriersRepositoryInterface {

    public mockReturn = '{"frete":[{"cepdes":"17213580","cepori":"06233200","conta":"005487","contrato":"258","frap":"N","modalidade":3,"peso":13.78,"“prazo”":99,"tpentrega":"D","tpseguro":"N","vldeclarado":149.97,"vltotal":23.95}]}'
    
    private hydrator: JadLogHydrator;

    constructor() {
        this.hydrator = new JadLogHydrator();
    }

    fetchValueFreight() {
        const response = this._fetchData();
        const sheetLine = this.hydrator.parse(response.frete[0]);
        return [sheetLine];
    }   

    _fetchData() {
        return JSON.parse(this.mockReturn);
    }
}