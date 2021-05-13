/* eslint-disable class-methods-use-this */
import path from 'path';
import fs from 'fs';
import csvtojson from 'csvtojson';
import { Converter } from 'csvtojson/v2/Converter';

export default class Transform {
  async handleFaixasDePeso() {
    const faixasJson = await this.convertToJson();
    await this.saveFile(faixasJson);
    return true;
  }

  convertToJson(): Converter {
    return csvtojson({ delimiter: ';' }).fromFile(
      path.resolve(__dirname, './../../../dataset/faixaDePeso.csv'),
    );
  }

  async saveFile(faixasParsed: Array<any>) {
    return fs.writeFileSync(
      path.resolve(__dirname, './../../../dataset/faixaDePeso.json'),
      JSON.stringify(faixasParsed),
    );
  }
}
