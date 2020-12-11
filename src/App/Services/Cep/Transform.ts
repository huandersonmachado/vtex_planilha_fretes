import { createReadStream } from 'fs';
import { pipeline } from 'stream';
import path from 'path';

import csvtojson from 'csvtojson';


export default class Transform {

    async handlePlanilha() {
      const faixasJson = await this.convertToJson();
      const faixasParsed = this.handleFaixasDeCep(faixasJson);
      console.log(faixasParsed)
    }

    readStream() {
        return createReadStream(path.resolve(__dirname, './../../../dataset/MelhorEnvioFaixas.csv'));
    }

    async convertToJson() {
        return csvtojson({ delimiter: ';' }).fromStream(this.readStream());
    }

    async handleFaixasDeCep(faixasJson: Array<any>) {
        const faixas: any = [];

        for (const faixa of faixasJson) {
            const faixaExistente = faixas.filter((faixa: any) => faixa.ZipCodeStart == faixa.ZipCodeStart);
            if (faixaExistente.length == 0) {
                faixas.push({
                    ZipCodeStart: faixa.ZipCodeStart,
                    ZipCodeEnd: faixa.ZipCodeEnd
                });
            }
        }

        return faixas;
    }
}
