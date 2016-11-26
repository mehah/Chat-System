package form.validation;

import greencode.jscript.Form;
import greencode.jscript.Window;
import greencode.jscript.form.Validator;

public class OnlyLetterValidator implements Validator {

	@Override
	public boolean validate(Window window, Form form, String name, Object value, String[] labels) {
		
		if(!((String)value).matches("[a-zA-Z\\s]+")) {
			window.alert("Por favor, digite um "+labels[0]+" com apenas letras!");
			return false;
		}
		
		return true;
	}

}
