import path from 'path';
import fs from 'fs';

import csvtojson from 'csvtojson';

export default class Transform {
  async handlePlanilha() {
    const faixasJson = await this.convertToJson();
    const faixasParsed = this.handleFaixasDeCep(faixasJson);
    await this.saveFile(faixasParsed);
    return true;
  }

  convertToJson() {
    return csvtojson({ delimiter: ';' }).fromFile(
      path.resolve(__dirname, './../../../dataset/MelhorEnvioFaixas.csv'),
    );
  }

  handleFaixasDeCep(faixasJson: Array<any>) {
    const faixas: any = [];

    for (const faixa of faixasJson) {
      const faixaExistente = faixas.filter(
        (faixaImportada: any) => {
          const faixaAtualTratada = (faixa.ZipCodeStart.length == 7) ? `${faixa.ZipCodeStart}0` : faixa.ZipCodeStart
          return faixaAtualTratada == faixaImportada.ZipCodeStart
        });
      console.log(faixaExistente);
      if (faixaExistente.length === 0) {
        faixas.push({
          ZipCodeStart: (faixa.ZipCodeStart.length == 7) ? `${faixa.ZipCodeStart}0` : faixa.ZipCodeStart,
          ZipCodeEnd: (faixa.ZipCodeEnd.length == 7) ? `${faixa.ZipCodeEnd}0` : faixa.ZipCodeEnd,
        });
      }
    }

    return faixas;
  }

  async saveFile(faixasParsed: Array<any>) {
    return fs.writeFileSync(
      path.resolve(__dirname, './../../../dataset/faixasDeCep.json'),
      JSON.stringify(faixasParsed),
    );
  }
}
