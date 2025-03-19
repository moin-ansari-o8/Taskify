using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI.WebControls;


public partial class EditBrand : System.Web.UI.Page
{
    string connectionString = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadBrands(); // Load the brand data into GridView
        }
    }

    private void LoadBrands()
    {
        using (SqlConnection con = new SqlConnection(connectionString))
        {
            string query = "SELECT BId, BName FROM brand_table";
            SqlDataAdapter da = new SqlDataAdapter(query, con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            GridViewBrand.DataSource = dt;
            GridViewBrand.DataBind();
        }
    }

    protected void btnEdit_Click(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(hfBrandId.Value) && !string.IsNullOrEmpty(txtBrandName.Text))
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "UPDATE brand_table SET BName = @BName WHERE BId = @BId";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@BId", hfBrandId.Value);
                cmd.Parameters.AddWithValue("@BName", txtBrandName.Text);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            ClearFields();
            LoadBrands();
        }
    }

    protected void btnDelete_Click(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(hfBrandId.Value))
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "DELETE FROM brand_table WHERE BId = @BId";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@BId", hfBrandId.Value);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            ClearFields();
            LoadBrands();
        }
    }

    protected void ClearFields(object sender = null, EventArgs e = null)
    {
        txtBrandName.Text = string.Empty;
        hfBrandId.Value = string.Empty;
    }

    protected void GridViewBrand_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = GridViewBrand.SelectedRow;
        hfBrandId.Value = row.Cells[0].Text; // Get the Brand ID
        txtBrandName.Text = row.Cells[1].Text; // Get the Brand Name
    }
}
