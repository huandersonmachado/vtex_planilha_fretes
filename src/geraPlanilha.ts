import path from 'path';
import fs from 'fs';
import debug from 'debug';

(async () => {
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


  const requests = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../example.response.json'),
    ));

    try {
      const dadosPlanilha = requests.map(request => {
        if (request.data == undefined || request.data.frete == undefined) {
          return;
        };
    
        const frete = request.data.frete[0];
    
        const faixaPeso = faixasPesoJson.find(peso => {
          return (peso.WeightEnd / 1000) == frete.peso;
        });
    
        const faixaCep = faixasCepJson.find(cep => {
          return cep.ZipCodeEnd == frete.cepdes
        });

        return {
          ZipCodeStart: faixaCep.ZipCodeStart,
          ZipCodeEnd: faixaCep.ZipCodeEnd,
          WeightStart: faixaPeso.WeightStart,
          WeightEnd: faixaPeso.WeightEnd,
          PolygonName: '',
          AbsoluteMoneyCost: frete.vltotal,
          PricePercent: '0,66',
          PriceByExtraWeight: '0,00',
          MaxVolume: '1,00',
          TimeCost: `${frete.prazo}.00:00:00`,
          Country: 'BRA',
          MinimumValueInsurance: '0,00',
        }
      }).filter(el => el != null && el.AbsoluteMoneyCost != undefined);

      fs.writeFileSync('planilha.json', JSON.stringify(dadosPlanilha), {
        encoding: 'utf8'
      });
    } catch(err) {
      throw new Error(err)
    } 
    console.log('terminou')
})()