using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI.WebControls;

public partial class EditSubCat : System.Web.UI.Page
{
    // Connection string
    private string connStr = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            BindGridView();
        }
    }

    // Bind GridView with data from subCat_table
    private void BindGridView()
    {
        using (SqlConnection conn = new SqlConnection(connStr))
        {
            string query = "SELECT SubId, SubCatName FROM subCat_table";
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                GridViewSubCat.DataSource = dt;
                GridViewSubCat.DataBind();
            }
        }
    }

    // When a row is selected, populate the TextBox with SubCatName
    protected void GridViewSubCat_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = GridViewSubCat.SelectedRow;
        txtSubCatName.Text = row.Cells[1].Text; // Column index for SubCatName
        hfSubCatId.Value = row.Cells[0].Text; // Store SubId for edit/delete operations
    }

    // Edit the selected sub-category
    protected void btnEdit_Click(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(hfSubCatId.Value))
        {
            int subId = Convert.ToInt32(hfSubCatId.Value);
            string newName = txtSubCatName.Text.Trim();

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                string query = "UPDATE subCat_table SET SubCatName = @SubCatName WHERE SubId = @SubId";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@SubCatName", newName);
                    cmd.Parameters.AddWithValue("@SubId", subId);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }

            BindGridView(); // Refresh GridView
            clear(); // Clear input fields
        }
    }

    // Delete the selected sub-category
    protected void btnDelete_Click(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(hfSubCatId.Value))
        {
            int subId = Convert.ToInt32(hfSubCatId.Value);

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                string query = "DELETE FROM subCat_table WHERE SubId = @SubId";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@SubId", subId);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }

            BindGridView(); // Refresh GridView
            clear(); // Clear input fields
        }
    }

    // Clear input fields
    protected void ClearFields(object sender, EventArgs e)
    {
        clear();
    }
    protected void clear()
    {
        txtSubCatName.Text = string.Empty;
        hfSubCatId.Value = string.Empty;
    }
}
