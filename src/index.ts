import 'module-alias/register';

import Transform from './App/Services/Peso/Transform';

(async () => {
  const t = new Transform();
  console.log(await t.handleFaixasDePeso());
})();
