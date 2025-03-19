using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

public partial class AddSubCat : System.Web.UI.Page
{
    // Connection string
    string conStr = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        // Any code you want to run on page load
    }

    protected void btnAdd_Click(object sender, EventArgs e)
    {
        // Get the brand name entered by the user
        string subName = txtSub.Text.Trim();

        if (string.IsNullOrEmpty(subName))
        {
            // Display an alert if the brand name is empty
            Response.Write("<script>alert('Please enter a brand name.');</script>");
            return;
        }

        try
        {
            // Insert the new brand into the brand_table
            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();

                // Create the SQL command to insert the new brand
                SqlCommand cmd = new SqlCommand("INSERT INTO subCat_table (SubCatName) VALUES (@SubName)", con);

                // Add the parameter to avoid SQL injection
                cmd.Parameters.AddWithValue("@SubName", subName);

                // Execute the command
                int result = cmd.ExecuteNonQuery();

                // Check if the insert was successful
                if (result > 0)
                {
                    // Display a success message
                    Response.Write("<script>alert('Sub Category added successfully!');</script>");
                    txtSub.Text = ""; // Clear the input field after adding

                    // Check if the page was redirected from AddProduct page

                    // Redirect back to the AddProduct page
                    Response.Redirect("~/AddProduct.aspx");

                }
                else
                {
                    // Display an error message if the insertion failed
                    Response.Write("<script>alert('Failed to add Sub category.');</script>");
                }
            }
        }
        catch (Exception ex)
        {
            // Handle any errors that may have occurred during the database operation
            Response.Write("<script>alert('Error: " + ex.Message + "');</script>");
        }
    }

    protected void ClearFields(object sender, EventArgs e)
    {
        // Clear the input field for brand name
        txtSub.Text = "";
    }
}