package Model;

import greencode.jscript.DOMHandle;
import greencode.jscript.Window;

import java.util.ArrayList;

public final class Chat {
	private final static ArrayList<Usuario> usuarios = new ArrayList<Usuario>();
	public static int ultimoId = -1;
	
	public static void exec(Window window, Usuario usuario) {
		DOMHandle.execCommand(window, "chatInstance = new Chat", usuario);
	}
	
	public static Usuario getUsuarioById(int id) {
		return getUsuarios().get(id);
	}

	public static ArrayList<Usuario> getUsuarios() {
		return usuarios;
	}
}
