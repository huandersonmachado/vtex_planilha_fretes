/* eslint-disable class-methods-use-this */
import axios from 'axios';

import rax from 'retry-axios';

import debugApp from 'debug';

const debug = debugApp('app:ceps');

import CarriersRepositoryInterface from '@src/App/Support/Carriers/CarriersRepositoryInterface';
import FreightFormat from '@src/App/Support/FreightFormat';

import JadLogParamsInterface from './JadLogParamsInterface';
import JadLogHydrator from './JadLogHydrator';

export default class JadLogRepository implements CarriersRepositoryInterface {
  private hydrator: JadLogHydrator;

  constructor() {
    this.hydrator = new JadLogHydrator();
  }

  async fetchValueFreight(zipCodeStart: String, zipCodeEnd: String, cepOrigem: String, modalidade: Number, weightStart: Number, weightEnd: Number) {
    rax.attach();
    try {
      const response = await this.getFreightValue({
        frete: [
          {
            cepdes: zipCodeEnd,
            cepori: cepOrigem,
            cnpj: '02482104000',
            modalidade: modalidade,
            peso: (weightEnd / 1000),
            tpentrega: 'D',
            tpseguro: 'N',
            vlcoleta: 0.0,
            vldeclarado: 0.0,
          },
        ],
      });
      const hasError = this.handleResponseData(response.data);
      if (hasError)
          return <Boolean>false;
  
      return <FreightFormat>this.hydrator.parse({
        response: response.data.frete[0],
        zipCodeStart:  zipCodeStart,
        zipCodeEnd: zipCodeEnd,
        weightEnd: weightEnd,
        weightStart: weightStart,
      });
    } catch(err) {
      debug('Erro na requisição', err);
      return false;
    }

  }

  async getFreightValue(params: JadLogParamsInterface) {
    const api = axios.create({
      baseURL: 'http://www.jadlog.com.br',
      headers: {
        Authorization: `Bearer ${process.env.JAD_LOG_TOKEN}`,
      },
    });

    return api.post('embarcador/api/frete/valor', {...params, 
      raxConfig: {
        retry: 5, // number of retry when facing 4xx or 5xx
        noResponseRetries: 5, // number of retry when facing connection error
        onRetryAttempt: err => {
          const cfg = rax.getConfig(err);
          console.log(`Retry attempt #${cfg.currentRetryAttempt}`); // track current trial
        }
      },
      timeout: 50
    });
  }

  handleResponseData(responseData: any) {
   if (!!responseData.error) {
      debug('Erro', responseData)
      return true;
    }
    return false;
  }
}
