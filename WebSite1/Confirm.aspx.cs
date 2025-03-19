using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Collections.Generic;


public partial class Confirm : System.Web.UI.Page
{
    string conStr = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        FetchUserDetails(Convert.ToInt16(Session["UID"]));
        // Check if there are selected products in the session
        if (Session["SelectedProducts"] != null)
        {
            List<Dictionary<string, object>> selectedProducts = (List<Dictionary<string, object>>)Session["SelectedProducts"];

            // Bind the selected products list to the repeater
            CartRepeater.DataSource = selectedProducts;
            CartRepeater.DataBind();
        }
        else
        {
            // Handle the case where there are no products in the cart
            Response.Write("<script>alert('No products in the cart.');</script>");
        }
    }

    protected string GetValue(object dataItem, string key)
    {
        // Cast dataItem to Dictionary<string, object> and retrieve the value for the key
        var item = dataItem as Dictionary<string, object>;
        if (item != null && item.ContainsKey(key))
        {
            // Check if the value is null, return an empty string if it is null
            var value = item[key];
            return value != null ? value.ToString() : string.Empty;
        }
        return string.Empty; // Return empty string if key is not found
    }



    private void FetchUserDetails(int userID)
    {
        try
        {
            using (SqlConnection conn = new SqlConnection(conStr))
            {
                conn.Open();
                string query = "SELECT email, address, phone FROM user_table WHERE uid = @UserID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@UserID", userID);

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    txtPhoneNumber.Text = reader["phone"].ToString();
                    txtEmail.Text = reader["email"].ToString();
                    txtAddress.Text = reader["address"].ToString();
                }
            }
        }
        catch (Exception ex)
        {
            Response.Write("<script>alert('Error fetching user details: " + ex.Message + "');</script>");
        }
    }

    protected void ConfirmOrder(object sender, EventArgs e)
    {
        try
        {
            // Check if there are selected products in the session
            if (Session["SelectedProducts"] != null)
            {
                List<Dictionary<string, object>> selectedProducts = (List<Dictionary<string, object>>)Session["SelectedProducts"];

                using (SqlConnection conn = new SqlConnection(conStr))
                {
                    conn.Open();
                    SqlTransaction transaction = conn.BeginTransaction(); // Start a transaction

                    try
                    {
                        foreach (var product in selectedProducts)
                        {
                            int productID = Convert.ToInt32(product["ProductID"]);
                            int quantity = Convert.ToInt32(product["Quantity"]);
                            string productName = product["ProductName"].ToString();

                            

                            // Deduct stock quantity
                            string updateStockQuery = "UPDATE product_table SET PQuantity = PQuantity - @Quantity WHERE PId = @PId";
                            SqlCommand updateStockCmd = new SqlCommand(updateStockQuery, conn, transaction);
                            updateStockCmd.Parameters.AddWithValue("@Quantity", quantity);
                            updateStockCmd.Parameters.AddWithValue("@PId", productID);
                            updateStockCmd.ExecuteNonQuery();

                            // Delete the product from the cart after the order is confirmed
                            string deleteCartQuery = "DELETE FROM cart_table WHERE PId = @PId and UId = @UId";
                            SqlCommand deleteCartCmd = new SqlCommand(deleteCartQuery, conn, transaction);
                            deleteCartCmd.Parameters.AddWithValue("@PId", productID);
                            deleteCartCmd.Parameters.AddWithValue("@UId", Convert.ToInt16(Session["UID"]));
                            deleteCartCmd.ExecuteNonQuery();
                        }

                        // Commit the transaction
                        transaction.Commit();

                        // Clear the session after successful purchase
                        

                        // Show success message and redirect to Bill page
                        
                        Response.Redirect("~/Bill.aspx");
                    }
                    catch (Exception ex)
                    {
                        // If any exception occurs, rollback the transaction
                        transaction.Rollback();
                        Response.Write("<script>alert('Error processing order: " + ex.Message + "');</script>");
                    }
                    finally
                    {
                        conn.Close(); // Close the connection
                    }
                }
            }
            else
            {
                // If no products are selected, alert the user
                Response.Write("<script>alert('No products selected.');</script>");
            }
        }
        catch (Exception ex)
        {
            // Global exception handling
            Response.Write("<script>alert('Error processing order: " + ex.Message + "');</script>");
        }
    }


    protected void ClearFields(object sender, EventArgs e)
    {
        // Clear user input fields
        txtPhoneNumber.Text = "";
        txtEmail.Text = "";
        txtAddress.Text = "";
    }
}
