export interface RegistrationConfig {
  isView: boolean;
  isModified: boolean;
  processId:number;
  registrationType:number;  //1 for new, 2 for Existing,
  isFirstWorkflow: number
}
