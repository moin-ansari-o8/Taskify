using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class AdminMasterPage : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Check if the current page is SignIn.aspx
        string currentPage = System.IO.Path.GetFileName(Request.Path);
        //Response.Write("<script>alert('Error loading cart: " + Session["UID"] + "');</script>");
        if (currentPage.Equals("SignIn.aspx", StringComparison.OrdinalIgnoreCase))
        {
            btnSignOut.Visible = false;
            btnSignIn.Visible = false;
            btnSignUp.Visible = false;
        }
        else if (currentPage.Equals("SignUp.aspx", StringComparison.OrdinalIgnoreCase))
        {
            btnSignOut.Visible = false;
            btnSignIn.Visible = true;
            btnSignUp.Visible = false;
        }
        else
        {
            if (Session["UID"] != null || Request.Cookies["userInfo"] != null)
            {
                // Check cookies for persistent login if session is not set
                if (Session["UID"] == null && Request.Cookies["userInfo"] != null)
                {
                    int uid = int.Parse(Request.Cookies["userInfo"]["uid"]);
                    string userType = Request.Cookies["userInfo"]["userType"];

                    // Restore session from cookie
                    Session["UID"] = uid;
                    Session["UserType"] = userType;
                }

                btnSignOut.Visible = true;
                btnSignIn.Visible = false;
                btnSignUp.Visible = false;
            }
            else
            {
                btnSignOut.Visible = false;
                btnSignIn.Visible = true;
                btnSignUp.Visible = true;
            }
        }
    }

    protected void signOut(object sender, EventArgs e)
    {
        // Clear the session and cookies
        Session.Clear();

        if (Request.Cookies["userInfo"] != null)
        {
            HttpCookie cookie = new HttpCookie("userInfo");
            cookie.Expires = DateTime.Now.AddDays(-1);
            Response.Cookies.Add(cookie);
        }

        // Redirect to SignIn page
        Response.Redirect("~/SignIn.aspx");
    }

    protected void signUp(object sender, EventArgs e)
    {
        Response.Redirect("~/SignUp.aspx");
    }

    protected void signIn(object sender, EventArgs e)
    {
        Response.Redirect("~/SignIn.aspx");
    }
}
