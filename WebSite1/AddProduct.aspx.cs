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

public partial class AddProduct : System.Web.UI.Page
{  
    string conStr = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            bindBrand();
            bindSubCat();
        }
    }

    protected void btnAdd_Click(object sender, EventArgs e)
    {
        try
        {
            // Ensure that the file upload control contains a file
            if (fuImg01.HasFile)
            {
                // Convert the uploaded image to a byte array
                byte[] imageData;
                using (MemoryStream ms = new MemoryStream())
                {
                    fuImg01.PostedFile.InputStream.CopyTo(ms);
                    imageData = ms.ToArray();
                }

                // Validate price and quantity inputs using TryParse
                decimal price;
                int quantity;

                // Check if price is a valid decimal number
                if (!Decimal.TryParse(txtPrice.Text, out price))
                {
                    Response.Write("<script>alert('Please enter a valid price');</script>");
                    return;
                }

                // Check if quantity is a valid integer
                if (!Int32.TryParse(txtQuantity.Text, out quantity))
                {
                    Response.Write("<script>alert('Please enter a valid quantity');</script>");
                    return;
                }

                // SQL query to insert product details into the product table
                string query = "INSERT INTO product_table (PName, Price, PQuantity, PDesc, PCat, PSubCat, PSize, PBrand, PImg) " +
                               "VALUES (@ProductName, @Price, @Quantity, @Description, @Category, @SubCategory, @Size, @Brand, @ProductImage)";

                // Create the SQL connection and command
                using (SqlConnection conn = new SqlConnection(conStr))
                {
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@ProductName", txtProductName.Text);
                    cmd.Parameters.AddWithValue("@Price", price); // Use validated price
                    cmd.Parameters.AddWithValue("@Quantity", quantity); // Use validated quantity
                    cmd.Parameters.AddWithValue("@Description", txtDescription.Text);
                    cmd.Parameters.AddWithValue("@Category", ddlCategory.SelectedItem.Text);
                    cmd.Parameters.AddWithValue("@SubCategory", ddlSubCategory.SelectedItem.Text);
                    cmd.Parameters.AddWithValue("@Size", ddlSize.SelectedItem.Text);
                    cmd.Parameters.AddWithValue("@Brand", ddlBrandMain.SelectedItem.Text);
                    cmd.Parameters.AddWithValue("@ProductImage", imageData); // Store the image as binary data

                    // Open the connection and execute the query
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    conn.Close();
                }

                // Optionally, clear the form fields after inserting the data
                clear();

                // Display a success message
                Response.Write("<script>alert('Product added successfully');</script>");
            }
            else
            {
                // Handle the case when no image is uploaded
                Response.Write("<script>alert('Please upload an image');</script>");
            }
        }
        catch (Exception ex)
        {
            // Handle any errors that occur during the process
            Response.Write("<script>alert('Error: " + ex.Message + "');</script>");
        }
    }

    protected void ClearFields(object sender, EventArgs e)
    {
        clear();
    }

    protected void clear()
    {
        // Clear textboxes
        txtProductName.Text = "";
        txtPrice.Text = "";
        txtQuantity.Text = "";
        txtDescription.Text = "";

        // Reset dropdowns to the 0th index (default value)
        ddlCategory.SelectedIndex = 0;
        ddlSubCategory.SelectedIndex = 0;
        ddlSize.SelectedIndex = 0;
        ddlBrandMain.SelectedIndex = 0;
    }

    protected void bindBrand()
    {
        try
        {
            ddlBrandMain.Enabled = true;

            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("SELECT BName, BId FROM brand_table", con);
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                if (dt.Rows.Count != 0)
                {
                    ddlBrandMain.DataSource = dt;
                    ddlBrandMain.DataTextField = "BName";  // Display brand name
                    ddlBrandMain.DataValueField = "BId";  // Store brand ID
                    ddlBrandMain.DataBind();
                    ddlBrandMain.Items.Insert(0, new ListItem("-- SELECT --", "0"));  // Default item
                    ddlBrandMain.Items.Add(new ListItem("+ ADD Brand", "-1")); // Add new brand option
                    ddlBrandMain.SelectedIndex = 0;
                }
                else
                {
                    ddlBrandMain.Items.Insert(0, new ListItem("No brands available", "0"));
                }
            }
        }
        catch (Exception ex)
        {
            Response.Write("<script>alert('Error: " + ex.Message + "');</script>");
        }
    }
    protected void bindSubCat()
    {
        try
        {
            ddlSubCategory.Enabled = true;

            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("SELECT SubId, SubCatName FROM subCat_table", con);
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                if (dt.Rows.Count != 0)
                {
                    ddlSubCategory.DataSource = dt;
                    ddlSubCategory.DataTextField = "SubCatName";  // Display brand name
                    ddlSubCategory.DataValueField = "SubId";  // Store brand ID
                    ddlSubCategory.DataBind();
                    ddlSubCategory.Items.Insert(0, new ListItem("-- SELECT --", "0"));  // Default item
                    
                    ddlSubCategory.SelectedIndex = 0;
                }
                else
                {
                    ddlSubCategory.Items.Insert(0, new ListItem("No Sub Category available", "0"));
                }
                ddlSubCategory.Items.Add(new ListItem("+ ADD Sub Category", "-1")); // Add new brand option
            }
        }
        catch (Exception ex)
        {
            Response.Write("<script>alert('Error: " + ex.Message + "');</script>");
        }
    }

    protected void ddlBrandMain_SelectedIndexChanged(object sender, EventArgs e)
    {
        // Check for the special "-1" value, and perform the redirect if necessary.
        if (ddlBrandMain.SelectedValue == "-1")
        {
            Response.Redirect("~/AddBrand.aspx");
        }
    }
    protected void ddlSubCategory_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (ddlSubCategory.SelectedValue == "-1")
        {
            Response.Redirect("~/AddSubCat.aspx");
        }
    }
}
