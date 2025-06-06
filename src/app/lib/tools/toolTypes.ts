// Input Types
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

// Mapping tool name to input shape only
export type ToolInputMap = {
  add_two_numbers: AddTwoNumbersInput;
  multiply_two_numbers: MultiplyTwoNumbersInput;
  retrieve_insurance_info: RetrieveInsuranceInfoInput;
};
