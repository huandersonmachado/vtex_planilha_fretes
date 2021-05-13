import fs from 'fs';
import path from 'path';

import CarriersRepositoryInterface from '@src/App/Support/Carriers/CarriersRepositoryInterface';
import debugApp from 'debug';
import FreightFormat from '@src/App/Support/FreightFormat';

const debug = debugApp('app:ceps');

interface EmpresaDadosInterface {
    cepOrigem: String,
    cnpj: String,
    tipoDeFrete: Number,
    valorDaColeta: Number,
}

export default class CalculaFrete {

    private faixasImportadas: FreightFormat[] = [];

    private faixasNaoImportadas: [] = []

    private carrier: CarriersRepositoryInterface;

    constructor(carrier: CarriersRepositoryInterface) {
        this.carrier = carrier;
    }

    async getValueFreight({ cepOrigem, cnpj, tipoDeFrete, valorDaColeta }: EmpresaDadosInterface) {
      const { faixasDeCep, faixaDePeso } = await this.getFaixas();
      const faixasCepJson = JSON.parse(faixasDeCep.toString());
      const faixasPesoJson = JSON.parse(faixaDePeso.toString());
    
      for (const cep of faixasCepJson) {
        for (const peso of faixasPesoJson) {
          const responseCarrier = await this.carrier.fetchValueFreight(
              cep.ZipCodeStart, 
              cep.ZipCodeEnd, 
              cepOrigem,
              9, 
              peso.WeightStart, 
              peso.WeightEnd
          );
          //console.log(responseCarrier)
          if (responseCarrier == false) {
            this.setFaixaNaoImportada(cep.ZipCodeStart, cep.ZipCodeEnd)
          } else {
            debug(`Faixa Importada Cep: ${cep.ZipCodeEnd} - Peso ${peso.WeightEnd}`, );
            this.setFaixaImportada(<FreightFormat>responseCarrier);
          }
        }
      }

      fs.writeFileSync('./faixasImportadas.json', JSON.stringify(this.getFaixasImportadas()))
    }

    private setFaixaImportada(lineSheet: FreightFormat) {
      this.faixasImportadas.push(lineSheet);
      return this;
    }

    private setFaixaNaoImportada(zipCodeStart: String, zipCodeEnd: String) {
      this.faixasNaoImportadas.push({
        zipCodeStart: zipCodeStart,
        zipCodeEnd: zipCodeEnd,
      })
      return this;
    }

    getFaixasImportadas() {
      return this.faixasImportadas;
    }

    getFaixasNaoImportadas() {
      return this.faixasNaoImportadas;
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