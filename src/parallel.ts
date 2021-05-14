import 'dotenv/config';
import 'module-alias/register';
import fs from 'fs';
import path from 'path';
import debugApp from 'debug';
import axiosParallel from 'axios-parallel';
import { performance } from 'perf_hooks';

const debug = debugApp('app:ceps');


(async () => {

  debug("Start ...");

  const requests = [];
  const start = performance.now();

  const getFaixas = async () => {
    const faixasDeCep = fs.readFileSync(
      path.resolve(__dirname, './dataset/faixasDeCep.json'),
    );
    const faixaDePeso = fs.readFileSync(
      path.resolve(__dirname, './dataset/faixaDePeso.json'),
    );
    return {
      faixasDeCep,
      faixaDePeso,
    };
  }

  const { faixasDeCep, faixaDePeso } = await getFaixas();
  const faixasCepJson = JSON.parse(faixasDeCep.toString());
  const faixasPesoJson = JSON.parse(faixaDePeso.toString());

  

  for (const cep of faixasCepJson) {
    for (const peso of faixasPesoJson) {
      const params = {
        frete: [
          {
            cepdes: cep.ZipCodeEnd,
            cepori: "36900025",
            cnpj: '02482104000',
            modalidade: 3,
            peso: (peso.WeightEnd / 1000),
            tpentrega: 'D',
            tpseguro: 'N',
            vlcoleta: 0.0,
            vldeclarado: 0.0,
          },
        ],
      }

      requests.push({
        url:  'http://www.jadlog.com.br/embarcador/api/frete/valor',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.JAD_LOG_TOKEN}`,
        },
        data: params
      });
    }
  }

  try {
    const MAX_PARALLEL_REQUEST_PER_CPU = 30;
    const response = await axiosParallel(requests, MAX_PARALLEL_REQUEST_PER_CPU);

    fs.writeFileSync('example.response.json', JSON.stringify(response), {
      encoding: 'utf8'
    });
  } catch (error) {
    throw new Error(error);
  }

  const end = performance.now() - start;
  debug(`Execution time: ${end}ms`);
  
    
})();



