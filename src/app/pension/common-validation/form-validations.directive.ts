import  {AbstractControl, ValidationErrors } from "@angular/forms";


export function MobileNoValidator(control: AbstractControl): ValidationErrors | null {
    
const mobileNo = (control.value).toString();
            if(mobileNo.length > 10 || mobileNo.length !== 10) {
    
                return { 'NumberNotValid': true}
            }
        return null;
}