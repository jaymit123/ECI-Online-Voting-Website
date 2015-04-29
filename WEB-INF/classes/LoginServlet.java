

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.http.Cookie;

/**
 *
 * @author VJ
 */
public class LoginServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter write = response.getWriter();
        DBHandle CheckDB = new DBHandle();
        String loginData;
        String cookieLoginData;
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        Cookie[] oldCookie = request.getCookies();
        
        try {
            if (oldCookie != null) {
                for (Cookie checkData : oldCookie) {
                    if (checkData.getName().equals("ECI_User")) {
                        if (!(cookieLoginData = CheckDB.cookieLogin(checkData.getValue())).equals("null")) {

                            write.print(cookieLoginData);
                        } else {
                            checkData.setMaxAge(0);
                            checkData.setPath("/");
                            response.addCookie(checkData);
                        }
                    }

                }
            } else if (!(loginData = CheckDB.LoginUser(username, password)).equals("null")) {
                Cookie newcookie = new Cookie("ECI_User", CheckDB.GenerateUserUID(username));
                newcookie.setMaxAge(60 * 60 * 24);
                newcookie.setPath("/");
                response.addCookie(newcookie);
                write.print(loginData);

            } else if (!username.equals("") && !password.equals("")) {

                write.print("{\"Authentication\":\"FAIL\"}");
            }else {
write.print("{\"Authentication\":\"LoginCheckFail\"}");
}
        } catch (SQLException sqle) {
            System.out.println("Exception in doPost Method of LoginServlet : " + sqle);

        }
    }

}
