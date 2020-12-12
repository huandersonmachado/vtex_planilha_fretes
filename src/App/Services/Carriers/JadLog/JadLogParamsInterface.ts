export default interface JadLogParamsInterface {
  frete: [
    {
      cepori: String;
      cepdes: String;
      peso: number;
      cnpj: string;
      modalidade: number;
      tpentrega: string;
      tpseguro: string;
      vldeclarado: number;
      vlcoleta: number;
    },
  ];
}
