
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
public class RegisterServlet extends HttpServlet {

    DBHandle regdb = new DBHandle();

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        PrintWriter write = response.getWriter();
        response.setContentType("application/json");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String fullname = request.getParameter("firstname") + " " + request.getParameter("lastname");
        String state = request.getParameter("state");
        Cookie[] checkCookie = request.getCookies();

        try {
            
                    if (regdb.RegisterUser(username, password, fullname, state)) {
                        Cookie regCookie = new Cookie("ECI_User", regdb.GenerateUserUID(username));
                        regCookie.setMaxAge(60 * 60 * 24);
                        regCookie.setPath("/");
                        response.addCookie(regCookie);
                        write.print("{\"STATUS\":\"SUCCESS\"}");

                    } else if(!(username == null && password == null)){
                        write.print("{\"STATUS\":\"FAILURE\"}");
                    }
                
            
        } catch (SQLException ex) {

            System.out.println("Exception in RegisterServlet doPost Method:" + ex);
        }

    }

}
