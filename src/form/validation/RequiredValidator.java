package form.validation;

import greencode.jscript.Form;
import greencode.jscript.Window;
import greencode.jscript.form.Validator;

public class RequiredValidator implements Validator {

	@Override
	public boolean validate(Window window, Form form, String name, Object value, String[] labels) {
		
		if(value == null || ((String)value).isEmpty()) {
			window.alert("Por favor, digite um "+labels[0]+"!");
			return false;
		}
		
		return true;
	}

}
