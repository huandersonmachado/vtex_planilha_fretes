export default interface JadLogParamsInterface {
  frete: [
    {
      cepori: string;
      cepdes: string;
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
