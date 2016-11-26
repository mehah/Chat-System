package controller;

import java.lang.reflect.Method;

import greencode.kernel.CoreFileJS;
import greencode.kernel.GreenContext;
import greencode.kernel.implementation.BootActionImplementation;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class BootAction implements BootActionImplementation {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void init(String projectName, ClassLoader classLoader,
			ServletContext context, CoreFileJS coreFileJS) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean beforeAction(GreenContext context, Method requestMethod) {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public void afterAction(GreenContext context, Method requestMethod) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onRequest(HttpServletRequest request, HttpServletResponse response) {
		response.setHeader("Cache-Control","no-cache");
		response.setHeader("Pragma","no-cache");
		response.setDateHeader("Expires", -1);
	}

	@Override
	public void initUserContext(GreenContext context) {
		// TODO Auto-generated method stub
		
	}

}
