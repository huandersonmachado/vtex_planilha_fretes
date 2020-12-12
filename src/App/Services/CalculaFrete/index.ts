import fs from 'fs';
import path from 'path';

import CarriersRepositoryInterface from '@src/App/Support/Carriers/CarriersRepositoryInterface';
import debugApp from 'debug';

const debug = debugApp('app:ceps');

interface EmpresaDadosInterface {
    cepOrigem: String,
    cnpj: String,
    tipoDeFrete: Number,
    valorDaColeta: Number,
}

export default class CalculaFrete {
    private carrier: CarriersRepositoryInterface;

    constructor(carrier: CarriersRepositoryInterface) {
        this.carrier = carrier;
    }

    async getValueFreight({ cepOrigem, cnpj, tipoDeFrete, valorDaColeta }: EmpresaDadosInterface) {
        const { faixasDeCep, faixaDePeso } = await this.getFaixas();
        const faixasCepJson = JSON.parse(faixasDeCep.toString());
        const faixasPesoJson = JSON.parse(faixaDePeso.toString());
    
        const faixasImportadas = []; 
        const faixasNaoImportadas = [];
    
        for (const cep of faixasCepJson) {
          for (const peso of faixasPesoJson) {
            const responseCarrier = await this.carrier.fetchValueFreight(
                cep.ZipCodeStart, 
                cep.ZipCodeEnd, 
                cepOrigem,
                9, 
                peso.weightStart, 
                peso.weightEnd
            );
            if (responseCarrier == false) {
                faixasNaoImportadas.push({
                    zipCodeStart: cep.ZipCodeStart,
                    ZipCodeEnd: cep.ZipCodeEnd
                });
            } else {
                faixasImportadas.push(responseCarrier);
            }
          }
        }
    }

    async getFaixas() {
        const faixasDeCep = fs.readFileSync(
          path.resolve(__dirname, '../../../dataset/faixasDeCep.json'),
        );
        const faixaDePeso = fs.readFileSync(
          path.resolve(__dirname, '../../../dataset/faixaDePeso.json'),
        );
        return {
          faixasDeCep,
          faixaDePeso,
        };
      }
}