import 'dotenv/config';
import 'module-alias/register';

import JadLogRepository from './App/Services/Carriers/JadLog/JadLogRepository';

(async () => {
  const j = new JadLogRepository();
  console.log(j.fetchData());
})();
