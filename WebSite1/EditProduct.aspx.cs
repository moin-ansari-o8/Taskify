using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.IO;


public partial class EditProduct : System.Web.UI.Page
{
    string connectionString = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadProducts();
        }
    }

    private void LoadProducts()
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            string query = "SELECT PId, PName, PDesc, Price, PQuantity, PSize,PCat,PSubCat, PImg FROM product_table";
            SqlDataAdapter da = new SqlDataAdapter(query, conn);
            DataTable dt = new DataTable();
            da.Fill(dt);

            GridViewProduct.DataSource = dt;
            GridViewProduct.DataBind();
        }
    }

    protected void GridViewProduct_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = GridViewProduct.SelectedRow;

        hfProductId.Value = row.Cells[0].Text; // PId
        txtProductName.Text = row.Cells[1].Text; // PName
        txtDescription.Text = row.Cells[2].Text; // PDesc
        txtPrice.Text = row.Cells[3].Text; // Price
        txtQuantity.Text = row.Cells[4].Text; // PQuantity
        ddlSize.SelectedValue = row.Cells[5].Text; // PSize

        // Retrieve image from database (VARBINARY)
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            string query = "SELECT PImg FROM product_table WHERE PId = @PId";
            SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@PId", hfProductId.Value);
            conn.Open();

            SqlDataReader reader = cmd.ExecuteReader();
            if (reader.Read() && !reader.IsDBNull(0))
            {
                byte[] imgData = (byte[])reader["PImg"];
                string base64String = Convert.ToBase64String(imgData, 0, imgData.Length);
                imgPreview.ImageUrl = "data:image/png;base64," + base64String;
            }
            conn.Close();
        }
    }

    protected void btnEdit_Click(object sender, EventArgs e)
    {

        // Upload image as VARBINARY
        if (fuImg01.HasFile)
        {
            // Convert the uploaded image to a byte array
            byte[] imageData;
            using (MemoryStream ms = new MemoryStream())
            {
                fuImg01.PostedFile.InputStream.CopyTo(ms);
                imageData = ms.ToArray();
            }
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "UPDATE product_table SET PName = @PName, PDesc = @PDesc, Price = @Price, " +
                       "PQuantity = @PQuantity, PSize = @PSize, PImg = @PImg WHERE PId = @PId";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@PId", hfProductId.Value);
                cmd.Parameters.AddWithValue("@PName", txtProductName.Text);
                cmd.Parameters.AddWithValue("@PDesc", txtDescription.Text);
                cmd.Parameters.AddWithValue("@Price", txtPrice.Text);
                cmd.Parameters.AddWithValue("@PQuantity", txtQuantity.Text);
                cmd.Parameters.AddWithValue("@PSize", ddlSize.SelectedValue);
                cmd.Parameters.AddWithValue("@PImg", imageData);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }

        }
        else
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "UPDATE product_table SET PName = @PName, PDesc = @PDesc, Price = @Price, " +
                               "PQuantity = @PQuantity, PSize = @PSize WHERE PId = @PId";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@PId", hfProductId.Value);
                cmd.Parameters.AddWithValue("@PName", txtProductName.Text);
                cmd.Parameters.AddWithValue("@PDesc", txtDescription.Text);
                cmd.Parameters.AddWithValue("@Price", txtPrice.Text);
                cmd.Parameters.AddWithValue("@PQuantity", txtQuantity.Text);
                cmd.Parameters.AddWithValue("@PSize", ddlSize.SelectedValue);

                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }
        LoadProducts();
        clear();

    }

    protected void btnDelete_Click(object sender, EventArgs e)
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            string query = "DELETE FROM product_table WHERE PId = @PId";
            SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@PId", hfProductId.Value);

            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();
            LoadProducts();
            clear();
        }
    }
    protected void ClearFields(object sender, EventArgs e)
    {
        clear();
    }
    protected void clear()
    {
        hfProductId.Value = string.Empty;
        txtProductName.Text = string.Empty;
        txtDescription.Text = string.Empty;
        txtPrice.Text = string.Empty;
        txtQuantity.Text = string.Empty;
        ddlSize.SelectedIndex = 0;
        imgPreview.ImageUrl = string.Empty; // Clear the image preview
    }
}
