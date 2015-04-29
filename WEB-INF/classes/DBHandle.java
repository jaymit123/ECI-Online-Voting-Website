

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.PreparedStatement;
import java.util.UUID;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author VJ
 */
public class DBHandle {

    private Connection con;
    private PreparedStatement RegUserPS;
    private PreparedStatement LoginUserPS;
    private PreparedStatement CheckUserEx;
    private PreparedStatement GenerateUIDPS;
    private PreparedStatement GetUserFromUIDPS;
    private PreparedStatement DeleteUIDPS;
    private PreparedStatement CookieLoginPS;
    private PreparedStatement VotePS;
    private PreparedStatement UserVotePS;
    private PreparedStatement ResultPS;

    public DBHandle() {
        try {
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            con = DriverManager.getConnection("jdbc:mysql://localhost/test", "root", "JDvb04!@#");
            RegUserPS = con.prepareStatement("Insert into ECI_LoginData (username,password,Full_Name,State,Latest_Election) values(?,?,?,?,?)");
            LoginUserPS = con.prepareStatement("Select password,Full_Name,State,Latest_Election from ECI_LoginData where username=?");
            CheckUserEx = con.prepareStatement("Select * from ECI_LoginData where username=?");
            GenerateUIDPS = con.prepareStatement("Update ECI_LoginData set Unique_ID = ? where username = ?");
            GetUserFromUIDPS = con.prepareStatement("Select username from ECI_LoginData where Unique_ID=?");
            DeleteUIDPS = con.prepareStatement("Update ECI_LoginData set Unique_ID=null where username=?");
            CookieLoginPS = con.prepareStatement("Select Full_Name,State,Latest_Election from ECI_LoginData where username = ?");
            ResultPS = con.prepareStatement("Select aap,bjp,inc from ECI_Election where Election_Name= ? ");
            UserVotePS = con.prepareStatement("Update ECI_LoginData set Latest_Election = ? where username = ? and password=?");
        } catch (SQLException | ClassNotFoundException | InstantiationException | IllegalAccessException ex) {
            System.out.println("Exception in DBHandle Constructor Occured:" + ex);
        }
    }

    public boolean RegisterUser(String username, String password, String FullName, String State) throws SQLException {

        boolean ans = false;
        if (CheckUserExistence(username)) {
            try {
                RegUserPS.setString(1, username);
                RegUserPS.setString(2, password);
                RegUserPS.setString(3, FullName);
                RegUserPS.setString(4, State);
                RegUserPS.setBoolean(5, false);
                int rows = RegUserPS.executeUpdate();
                if (rows == 1) {
                    ans = true;
                } else {
                    RegUserPS.clearParameters();
                }
            } catch (SQLException sqle) {
                System.out.println("Exception in RegisterUser Method : " + sqle);
            }
        }
        return ans;
    }

    public String LoginUser(String username, String password) throws SQLException {
        Map<String, String> storeData = null;
        String sendAns = "null";
        try {
            LoginUserPS.setString(1, username);
            ResultSet rs = LoginUserPS.executeQuery();
            if (rs.first()) {

                String dbpass = rs.getString(1);
                if (dbpass.equals(password)) {
                    storeData = new HashMap<>();
                    storeData.put("Authentication", "PASS");
                    storeData.put("Username", username);
                    storeData.put("Name", rs.getString(2));
                    storeData.put("State", rs.getString(3));
                    boolean vote = rs.getBoolean(4);

                    if (!vote) {
                        storeData.put("Vote", "false");
                    } else {
                        storeData.put("Vote", "true");
                    }
                    sendAns = new Gson().toJson(storeData);
                }

            }
        } catch (SQLException sqle) {
            System.out.println("Exception in RegisterUser Method : " + sqle);
        }
        LoginUserPS.clearParameters();
        return sendAns;

    }

    private boolean CheckUserExistence(String username) throws SQLException {
        boolean ans = false;
        CheckUserEx.setString(1, username);
        ResultSet rows = CheckUserEx.executeQuery();

        if (!rows.isBeforeFirst()) {
            ans = true;
        }
        CheckUserEx.clearParameters();
        return ans;
    }

    public String GenerateUserUID(String username) throws SQLException {

        String uniqueid = UUID.randomUUID().toString();
        GenerateUIDPS.setString(1, uniqueid);
        GenerateUIDPS.setString(2, username);
        int rows = GenerateUIDPS.executeUpdate();
        if (rows == 0) {
            uniqueid = "null";
        }
        GenerateUIDPS.clearParameters();
        return uniqueid;
    }

    private String getUserFromUID(String UniqueId) throws SQLException {
        String username = "null";
        GetUserFromUIDPS.setString(1, UniqueId);
        ResultSet db_data = GetUserFromUIDPS.executeQuery();
        if (db_data.next()) {
            username = db_data.getString(1);
        }
        GetUserFromUIDPS.clearParameters();
        return username;
    }

    public boolean deleteUID(String UID) throws SQLException {
        boolean ans = false;
        String username = getUserFromUID(UID);
        if (!username.equals("null")) {
            DeleteUIDPS.setString(1, username);
            int rows = DeleteUIDPS.executeUpdate();
            if (rows != 0) {
                ans = true;
            }
            DeleteUIDPS.clearParameters();
        }
        return ans;
    }

    public String cookieLogin(String Unique_ID) throws SQLException {
        String giveAns = "null";
        String username;
        if (!(username = getUserFromUID(Unique_ID)).equals("null")) {
            CookieLoginPS.setString(1, username);
            ResultSet cookieRS = CookieLoginPS.executeQuery();
            if (cookieRS.next()) {
                Map<String, String> giveData = new HashMap<>();
                giveData.put("Authentication", "PASS");
                giveData.put("Username", username);
                giveData.put("Name", cookieRS.getString(1));
                giveData.put("State", cookieRS.getString(2));
                boolean vote = cookieRS.getBoolean(3);
                if (!vote) {
                    giveData.put("Vote", "false");
                } else {
                    giveData.put("Vote", "true");
                }
                giveAns = new Gson().toJson(giveData);
            }
        }
        return giveAns;
    }

    public String performVote(String username, String password, String party) throws SQLException {

        String sendAns = "null";

        UserVotePS.setBoolean(1, true);
        UserVotePS.setString(2, username);
        UserVotePS.setString(3, password);
        int rows = UserVotePS.executeUpdate();
        if (rows != 0) {
            VotePS = con.prepareStatement("Update ECI_Election set " + party + " = " + party + " + 1 where Election_Name = ? ");
            VotePS.setString(1, "DelhiElection2015");
            VotePS.executeUpdate();
            sendAns = ("{\"VOTE\":\"SUCCESS\"}");
            VotePS.close();
        } else {
            sendAns = ("{\"VOTE\":\"FAILED\"}");
        }
        UserVotePS.clearParameters();

        return sendAns;

    }

    public String getResults() throws SQLException {
     String ResultSend;
    ResultPS.setString(1,"DelhiElection2015");
    ResultSet ResultRS = ResultPS.executeQuery();
    if(ResultRS.next()){
     ResultSend = "{\"DATA\":\"AVAILABLE\",\"AAP\":\""+ResultRS.getString(1)+"\",\"BJP\":\""+ResultRS.getString(2)+"\",\"INC\":\""+ResultRS.getString(3)+"\"}";   
    }else{
        ResultSend = "{\"DATA\":\"UNAVIALBLE\"}";
    }
    ResultPS.clearParameters();
    return ResultSend;
    }

}
