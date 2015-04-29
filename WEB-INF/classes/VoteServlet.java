
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
public class VoteServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        DBHandle votedb = new DBHandle();
        PrintWriter write = response.getWriter();
        response.setContentType("application/json");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String party = request.getParameter("party");
        try {
          String info =  votedb.performVote(username, password, party);
           write.print(info);
        } catch (SQLException ex) {

            System.out.println("Exception in RegisterServlet doPost Method:" + ex);
        }

    }

}
