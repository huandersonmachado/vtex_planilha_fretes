import 'dotenv/config';
import 'module-alias/register';

import debugApp from 'debug';

const debug = debugApp('app:ceps');

import JadLogRepository from './App/Services/Carriers/JadLog/JadLogRepository';

import CepTransform from './App/Services/Cep/Transform';
import PesoTransform from './App/Services/Peso/Transform';
import CalculaFrete from './App/Services/CalculaFrete';

(async () => {
    //handleCep()
    //handlePeso();
    handleTransportadoras();
})();

async function handleCep() {
  const cep = new CepTransform();
  debug(await cep.handlePlanilha());
}

async function handlePeso() {
  const peso = new PesoTransform();
  debug(await peso.handleFaixasDePeso())
}

function handleTransportadoras() {
  const jadLogRepository = new JadLogRepository();

  const calculaFrete = new CalculaFrete(jadLogRepository);

  calculaFrete.getValueFreight({
    cepOrigem: '36900025',
    cnpj: '02482104000105',
    tipoDeFrete: 9,
    valorDaColeta: 0.00
  });

  debug(calculaFrete.getFaixasImportadas());
}
