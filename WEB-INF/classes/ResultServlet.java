
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
public class ResultServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        DBHandle resultdb = new DBHandle();
        PrintWriter write = response.getWriter();
        response.setContentType("application/json");

        try {
          String info =  resultdb.getResults();
         
           write.print(info);
        } catch (SQLException ex) {

            System.out.println("Exception in RegisterServlet doPost Method:" + ex);
        }

    }

}
