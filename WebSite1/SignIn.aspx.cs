using System;
using System.Data.SqlClient;
using System.Configuration;
using System.Web;

public partial class SignIn : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            clear();

            // Check if "Remember Me" cookie exists
            if (Request.Cookies["userInfo"] != null)
            {
                txtUsername.Text = Request.Cookies["userInfo"]["username"];
                chkRememberMe.Checked = true;
            }
        }
    }

    protected void clear()
    {
        lblMessage.Text = "";
        txtUsername.Text = string.Empty;
        txtPassword.Text = string.Empty;
        chkRememberMe.Checked = false;
    }

    protected void signIn(object sender, EventArgs e)
    {
        string username = txtUsername.Text.Trim();
        string password = txtPassword.Text.Trim();

        // Validate user credentials and fetch user ID and role
        var userInfo = ValidateUser(username, password);

        if (userInfo != null)
        {
            // Set session for logged-in user
            Session["UID"] = userInfo.UserID; // UID
            Session["UserType"] = userInfo.UserType; // Role (admin/user)
            Session["UNM"] = userInfo.Username;

            // If "Remember Me" is checked, set a persistent cookie
            if (chkRememberMe.Checked)
            {
                HttpCookie cookie = new HttpCookie("userInfo");
                cookie["uid"] = userInfo.UserID.ToString();
                cookie["userType"] = userInfo.UserType;
                cookie["unm"] = userInfo.Username;
                cookie.Expires = DateTime.Now.AddDays(30); // Cookie expires in 30 days
                Response.Cookies.Add(cookie);
            }
            else
            {
                // Clear the cookie if "Remember Me" is unchecked
                if (Request.Cookies["userInfo"] != null)
                {
                    HttpCookie cookie = new HttpCookie("userInfo");
                    cookie.Expires = DateTime.Now.AddDays(-1);
                    Response.Cookies.Add(cookie);
                }
            }

            // Redirect based on user role
            if (userInfo.UserType == "user")
            {
                Response.Redirect("~/HomePage.aspx");
            }
            else if (userInfo.UserType == "admin")
            {
                Response.Redirect("~/AdminHomePage.aspx");
            }
        }
        else
        {
            // Display error message if login fails
            lblMessage.Text = "Invalid username or password.";
            lblMessage.ForeColor = System.Drawing.Color.Red;
        }
    }

    public class UserInfo
    {
        public int UserID { get; set; }
        public string UserType { get; set; }
        public string Username { get; set; }
    }

    private UserInfo ValidateUser(string username, string password)
    {
        string connectionString = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;
        string query = "SELECT uid, user_type FROM user_table WHERE username = @Username AND password = @Password";

        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            try
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Username", username);
                    command.Parameters.AddWithValue("@Password", password);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new UserInfo
                            {
                                UserID = reader.GetInt32(0),
                                UserType = reader.GetString(1),
                                Username = username
                            };
                        }
                        else
                        {
                            return null; // Invalid credentials
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                lblMessage.Text = "Error: " + ex.Message;
                lblMessage.ForeColor = System.Drawing.Color.Red;
                return null;
            }
        }
    }

    protected void ClearFields(object sender, EventArgs e)
    {
        clear();
    }
}
