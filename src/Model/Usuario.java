package Model;

import java.util.ArrayList;

import GsonModel.GMessage;


public class Usuario {
	private int id;
	private String nome;
	private boolean online = true;
	
	private final transient ArrayList<GMessage> mensagens = new ArrayList<GMessage>();	
	private final transient ArrayList<Usuario> userList = new ArrayList<Usuario>();
	
	public void setNome(String arg0) { this.nome = arg0; }
	public String getNome() { return this.nome; }
	
	public void setId(int arg0) { this.id = arg0; }
	public int getId() { return this.id; }
	
	public ArrayList<GMessage> getMensagens()
	{
		return mensagens; 
	}
	public boolean isOnline() {
		return online;
	}
	public void setOnline(boolean online) {
		this.online = online;
		if(!online)
			Chat.getUsuarios().remove(this);
		else
			Chat.getUsuarios().add(this);
		
		for (Usuario user : Chat.getUsuarios()) {
			if(user.equals(this))
				continue;
			
			if(!user.getUserList().contains(this))
				user.getUserList().add(this);
			
			this.getUserList().add(user);
		}
	}
	public ArrayList<Usuario> getUserList() {
		return userList;
	}
}
