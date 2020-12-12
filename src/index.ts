import 'dotenv/config';
import 'module-alias/register';

import debugApp from 'debug';

const debug = debugApp('app:ceps');

import JadLogRepository from './App/Services/Carriers/JadLog/JadLogRepository';
import CepTransform from './App/Services/Cep/Transform';

(async () => {
    //handleCep()
    handleJadLog();
})();

function handleCep() {
  const cep = new CepTransform();
  debug(cep.handlePlanilha());
}

function handleJadLog() {
  const j = new JadLogRepository();
  console.log(j.fetchData());
}
