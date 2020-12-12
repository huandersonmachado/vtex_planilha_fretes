/* eslint-disable class-methods-use-this */
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import CarriersRepositoryInterface from '@src/App/Support/Carriers/CarriersRepositoryInterface';

import JadLogParamsInterface from './JadLogParamsInterface';
import JadLogHydrator from './JadLogHydrator';

export default class JadLogRepository implements CarriersRepositoryInterface {
  private hydrator: JadLogHydrator;

  constructor() {
    this.hydrator = new JadLogHydrator();
  }

  fetchValueFreight() {
    const response = this.fetchData();
    const sheetLine = this.hydrator.parse(response.frete[0]);
    return [sheetLine];
  }

  async fetchData() {
    const { faixasDeCep, faixaDePeso } = await this.getFaixas();
    const faixasCepJson = JSON.parse(faixasDeCep.toString());
    const faixasPesoJson = JSON.parse(faixaDePeso.toString());


    const faixasImportadas = []; 
    const faixasNaoImportadas = [];


    for (const cep of faixasCepJson) {
      for (const peso of faixasPesoJson) {
        const response = await this.getFreightValue({
          frete: [
            {
              cepdes: `${cep.ZipCodeEnd}0`,
              cepori: '36900025',
              cnpj: '02482104000',
              modalidade: 9,
              peso: peso.weightEnd / 1000,
              tpentrega: 'D',
              tpseguro: 'N',
              vlcoleta: 0.0,
              vldeclarado: 0.0,
            },
          ],
        });

        const hasError = this.handleResponseData(response.data);

        if (hasError) {
            faixasNaoImportadas.push({
                zipCodeStart: cep.zipCodeStart,
                ZipCodeEnd: cep.ZipCodeEnd
            });
        } else {
            const sheetLine = this.hydrator.parse({
                response: response.data.frete[0],
                zipCodeStart:  cep.ZipCodeStart + '0',
                zipCodeEnd: cep.ZipCodeEnd + '0',
                weightEnd: peso.weightEnd,
                weightStart: peso.weightStart,
            });
            faixasImportadas.push(sheetLine);
        }
      }
    }
  }

  async getFaixas() {
    const faixasDeCep = fs.readFileSync(
      path.resolve(__dirname, '../../../../dataset/faixasDeCep.json'),
    );
    const faixaDePeso = fs.readFileSync(
      path.resolve(__dirname, '../../../../dataset/faixaDePeso.json'),
    );
    return {
      faixasDeCep,
      faixaDePeso,
    };
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
