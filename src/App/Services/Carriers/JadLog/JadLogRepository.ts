/* eslint-disable class-methods-use-this */
import axios from 'axios';

import debugApp from 'debug';

const debug = debugApp('app:ceps');

import CarriersRepositoryInterface from '@src/App/Support/Carriers/CarriersRepositoryInterface';

import JadLogParamsInterface from './JadLogParamsInterface';
import JadLogHydrator from './JadLogHydrator';

export default class JadLogRepository implements CarriersRepositoryInterface {
  private hydrator: JadLogHydrator;

  constructor() {
    this.hydrator = new JadLogHydrator();
  }

  async fetchValueFreight(zipCodeStart: String, zipCodeEnd: String, cepOrigem: String, modalidade: number, weightStart: number, weightEnd: number) {
    
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

    if (hasError) {
        return false;
    } else {
        const lineSheet = this.hydrator.parse({
          response: response.data.frete[0],
          zipCodeStart:  zipCodeStart,
          zipCodeEnd: zipCodeEnd,
          weightEnd: weightEnd,
          weightStart: weightStart,
        });

        return lineSheet;
    }
  }

  async getFreightValue(params: JadLogParamsInterface) {
    const api = axios.create({
      baseURL: 'http://www.jadlog.com.br',
      headers: {
        Authorization: `Bearer ${process.env.JAD_LOG_TOKEN}`,
      },
    });

    return api.post('embarcador/api/frete/valor', params);
  }

  handleResponseData(responseData: any) {
   if (!!responseData.error) {
       return true;
    }
    return false;
  }
}
