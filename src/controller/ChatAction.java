package controller;

import form.LoginForm;
import greencode.http.ViewSession;
import greencode.http.ViewSessionContext;
import greencode.jscript.DOMHandle;
import greencode.jscript.FunctionHandle;
import greencode.jscript.Window;
import greencode.jscript.elements.ButtonElement;
import greencode.jscript.elements.InputTextElement;
import greencode.jscript.event.Events;
import greencode.jscript.form.annotation.Name;
import greencode.jscript.window.annotation.Form;
import greencode.jscript.window.annotation.Page;
import greencode.jscript.window.annotation.Validate;
import greencode.kernel.GreenContext;

import java.util.Enumeration;
import java.util.HashMap;

import GsonModel.GMessage;
import Model.Chat;
import Model.Usuario;

import com.jqueryui.widget.dialog.Dialog;
import com.jqueryui.widget.dialog.DialogMethods;

/**
 * Servlet implementation class EditorColaborativo
 */
@Page(name = "index", path = "index.html")
public class ChatAction extends Window {

	private final LoginForm form = document.forms(LoginForm.class);
	private Usuario usuario;
	private Dialog dialogLogin;

	public void init() {
		GreenContext context = GreenContext.getInstance();
		this.usuario = (Usuario) context.getRequest().getSession().getAttribute("usuario");

		if (this.usuario != null) {
			this.usuario.setOnline(false);
			
			ViewSession viewSession = context.getRequest().getViewSession();
			ViewSessionContext viewContext = viewSession.getViewSessionContext();
			Enumeration<Integer> ids = viewSession.getViewSessionContext().getIds();
			
			while(ids.hasMoreElements()) {
				int id = ids.nextElement();
				if(id != viewSession.getId())
					viewContext.getViewSession(id).invalidate();
			}
			
			entrar(context);			
			return;
		}

		ButtonElement button = document.createElement(ButtonElement.class);
		button.type("button");
		button.textContent("Entrar");

		FunctionHandle _buttonEvent = new FunctionHandle("login");
		button.addEventListener(Events.CLICK, _buttonEvent);
		

		InputTextElement input = document.createElement(InputTextElement.class);
		input.setAttribute("maxlength", "25");
		input.setAttribute("size", "20");
		input.name("userName");
		input.addEventListener(Events.ENTER, _buttonEvent);

		LoginForm form = document.createElement(LoginForm.class);
		form.name(LoginForm.class.getAnnotation(Name.class).value());
		form.appendChild(input);
		form.appendChild(button);
		form.setAttribute("onsubmit", "return false;");

		this.dialogLogin = new Dialog(document.createElement("div"));
		this.dialogLogin.css("text-align", "right").attr("maxlength", "25").attr("size", "20").append(form);

		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("title", "Digite um nome!");
		param.put("width", "260px");
		param.put("height", 70);
		param.put("resizable", false);
		param.put("removeButtonClose", true);
		param.put("randomPosition", false);

		DOMHandle.execCommand(this.dialogLogin, "showDialog", param);

		input.focus();

		//history.replaceState(null, "Chat", location.href+"?viewId="+GreenContext.getInstance().getRequest().getViewSession().getId());
	}
	
	private void entrar(GreenContext context) {
		this.usuario.getUserList().clear();
		this.usuario.setOnline(true);
		
		Chat.exec(context.currentWindow(), this.usuario);
		
		setTimeout(new FunctionHandle("receberMessage"), 15);
	}

	@Validate
	@Form(LoginForm.class)
	public void login(GreenContext context) {
		for (Usuario usuario : Chat.getUsuarios()) {
			if (usuario.getNome().equals(form.getUserName())) {
				alert("Este nome já esta sendo usado!");
				return;
			}
		}

		this.usuario = new Usuario();
		this.usuario.setId(++Chat.ultimoId);
		this.usuario.setNome(form.getUserName());
		context.getRequest().getSession().setAttribute("usuario", this.usuario);		
		this.dialogLogin.dialog(DialogMethods.close);
		entrar(context);
	}

	public void receberMessage(GreenContext context) {
		try {
			while(context.getRequest().getViewSession().isValid()) {								
				if(this.usuario.getMensagens().size() > 0 || this.usuario.getUserList().size() > 0) {
					DOMHandle.execCommand(window, "chatInstance.receberMessage", this.usuario.getUserList(), this.usuario.getMensagens());
					flush();
					this.usuario.getUserList().clear();
					this.usuario.getMensagens().clear();
				}else
					flush();			
				
				Thread.sleep(500);
			}
			
			HashMap<String, Boolean> op = new HashMap<String, Boolean>();
			op.put("createButtonOK", false);
			op.put("removeButtonClose", true);
			
			DOMHandle.execCommand(window, "alert", "Sessão expirada.", "", op);
		}catch(Exception e) {
			this.usuario.setOnline(false);			
			e.printStackTrace();
		}
	}

	public void enviarMessage() {
		try {
			GreenContext context = GreenContext.getInstance();
			
			Usuario usuario = Chat.getUsuarioById(Integer.parseInt(context.getRequest().getParameter("id")));

			GMessage message = new GMessage();
			message.setId(this.usuario.getId());
			message.setMsg(context.getRequest().getParameter("msg"));

			usuario.getMensagens().add(message);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	 
}
