using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI.WebControls;

public partial class men : System.Web.UI.Page
{
    string conStr = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            string category = Request.QueryString["category"];
            if (!string.IsNullOrEmpty(category))
            {

                lblCategoryHeading.Text = " " + char.ToUpper(category[0]) + category.Substring(1); // Capitalize category


                LoadProducts(category);
            }
            else
            {
                Response.Write("<script>alert('Invalid category');</script>");
            }
        }
    }


    private void LoadProducts(string category)
    {
        try
        {
            using (SqlConnection conn = new SqlConnection(conStr))
            {
                string query = "SELECT PID, PName, Price, PDesc, PImg FROM product_table WHERE PCat = @Category";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Category", category);

                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                ProductRepeater.DataSource = dt;
                ProductRepeater.DataBind();
            }
        }
        catch (Exception ex)
        {
            Response.Write("<script>alert('Error loading products: " + ex.Message + "');</script>");
        }
    }

    protected void ProductRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
    {
        if (e.CommandName == "AddToCart")
        {
            int productId = Convert.ToInt32(e.CommandArgument);
            if (Session["UID"] != null)
            {
                int userId = Convert.ToInt32(Session["UID"]); // Replace with actual session logic

                AddToCart(userId, productId);
            }
            else
            {
                // Response.Write("<script>alert('Log In first')</script>");
                Response.Redirect("~/SignIn.aspx");
            }
        }
    }

    private void AddToCart(int userId, int productId)
    {
        try
        {
            using (SqlConnection conn = new SqlConnection(conStr))
            {
                conn.Open();

                // Check if product already exists in the cart
                string checkQuery = "SELECT COUNT(*) FROM cart_table WHERE uid = @UserId AND pid = @ProductId";
                SqlCommand checkCmd = new SqlCommand(checkQuery, conn);
                checkCmd.Parameters.AddWithValue("@UserId", userId);
                checkCmd.Parameters.AddWithValue("@ProductId", productId);

                int count = Convert.ToInt32(checkCmd.ExecuteScalar());

                if (count > 0)
                {
                    // Update quantity if product already in cart
                    string updateQuery = "UPDATE cart_table SET cquantity = cquantity + 1 WHERE uid = @UserId AND pid = @ProductId";
                    SqlCommand updateCmd = new SqlCommand(updateQuery, conn);
                    updateCmd.Parameters.AddWithValue("@UserId", userId);
                    updateCmd.Parameters.AddWithValue("@ProductId", productId);
                    updateCmd.ExecuteNonQuery();
                }
                else
                {
                    // Insert new product into cart
                    string insertQuery = "INSERT INTO cart_table (UId, PId, CQuantity) VALUES (@UserId, @ProductId, @Quantity)";
                    SqlCommand insertCmd = new SqlCommand(insertQuery, conn);
                    insertCmd.Parameters.AddWithValue("@UserId", userId);
                    insertCmd.Parameters.AddWithValue("@ProductId", productId);
                    insertCmd.Parameters.AddWithValue("@Quantity", 1);
                    insertCmd.ExecuteNonQuery();
                }

                Response.Write("<script>alert('Product added to cart successfully!');</script>");
            }
        }
        catch (Exception ex)
        {
            Response.Write("<script>alert('Error adding product to cart: " + ex.Message + "');</script>");
        }
    }
}
