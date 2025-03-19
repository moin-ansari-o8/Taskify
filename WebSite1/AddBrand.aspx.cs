using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI;

public partial class AddBrand : System.Web.UI.Page
{
    string conStr = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
    }

    protected void btnAdd_Click(object sender, EventArgs e)
    {
        string brandName = txtBrandName.Text.Trim();

        if (string.IsNullOrEmpty(brandName))
        {
            Response.Write("<script>alert('Please enter a brand name.');</script>");
            return;
        }

        try
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();

                SqlCommand cmd = new SqlCommand("INSERT INTO brand_table (BName) VALUES (@BrandName)", con);
                cmd.Parameters.AddWithValue("@BrandName", brandName);

                int result = cmd.ExecuteNonQuery();

                if (result > 0)
                {
                    Response.Write("<script>alert('Brand added successfully!');</script>");
                    txtBrandName.Text = "";
                    Response.Redirect("~/AddProduct.aspx");
                }
                else
                {
                    Response.Write("<script>alert('Failed to add brand.');</script>");
                }
            }
        }
        catch (Exception ex)
        {
            Response.Write("<script>alert('Error: " + ex.Message + "');</script>");
        }
    }

    protected void ClearFields(object sender, EventArgs e)
    {
        txtBrandName.Text = "";
    }
}
