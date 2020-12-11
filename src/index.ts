import 'module-alias/register';

import fs from 'fs';

import Transform from './App/Services/Cep/Transform';

(async() => {
   const t = new Transform()
   console.log(await t.handlePlanilha());
})()