package form.validation;

import greencode.jscript.Form;
import greencode.jscript.Window;
import greencode.jscript.form.Validator;

public class RequiredLengthValidator implements Validator {

	@Override
	public boolean validate(Window window, Form form, String name, Object value, String[] labels) {
		
		if(((String)value).length() < Integer.parseInt(labels[1])) {
			window.alert("Por favor, digite um "+labels[0]+" com "+labels[1]+" caracteres ou mais!");
			return false;
		}
		
		return true;
	}

}
