export type AddTwoNumbersInput = {
  num1: number;
  num2: number;
};

export type MultiplyTwoNumbersInput = {
  num1: number;
  num2: number;
};

export type RetrieveInsuranceInfoInput = {
  query: string;
};

export type ToolInputMap = {
  add_two_numbers: (args: AddTwoNumbersInput) => string;
  multiply_two_numbers: (args: MultiplyTwoNumbersInput) => string;
  retrieve_insurance_info: (
    args: RetrieveInsuranceInfoInput
  ) => Promise<string>;
};
