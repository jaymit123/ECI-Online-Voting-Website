/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import java.io.PrintWriter;
import java.io.IOException;
import java.sql.SQLException;

/**
 *
 * @author VJ
 */
public class LogoutServlet extends HttpServlet {
    
    DBHandle dbcheck = new DBHandle();
    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        PrintWriter write = response.getWriter();
        response.setContentType("text/html");
        Cookie[] getData = request.getCookies();
        if (getData != null) {
            for (Cookie checkData : getData) {
                if (checkData.getName().equals("ECI_User")) {
                    try {
                        if (dbcheck.deleteUID(checkData.getValue())) {
                            
                          
                            checkData.setMaxAge(0);
                            checkData.setPath("/");
                            response.addCookie(checkData);
                            write.print("Successfully Logged Out!");
                        }
                    } catch (SQLException ex) {
                        System.out.println("SQL Exception in doPost method of LogoutServlet" + ex);
                    }
                }
            }
        }
        
    }
}
