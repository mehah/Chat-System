package form;

import form.validation.OnlyLetterValidator;
import form.validation.RequiredLengthValidator;
import form.validation.RequiredValidator;
import greencode.jscript.Form;
import greencode.jscript.form.annotation.ElementValue;
import greencode.jscript.form.annotation.Name;
import greencode.jscript.form.annotation.Validator;

@Name("loginForm")
public class LoginForm extends Form {
	
	@ElementValue(trim=true, validators={
		@Validator(value=RequiredValidator.class, labels="nome"),
		@Validator(value=RequiredLengthValidator.class, labels={"nome", "6"}),
		@Validator(value=OnlyLetterValidator.class, labels="nome")
	})
	private String userName;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
}
