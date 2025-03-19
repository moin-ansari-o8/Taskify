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

public partial class MyCart : System.Web.UI.Page
{
    string conStr = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadCartProducts();
        }
    }

    private void LoadCartProducts()
    {
        try
        {
            using (SqlConnection conn = new SqlConnection(conStr))
            {
                string query = @"
                SELECT c.PId, p.PImg, p.PName, p.PBrand, p.PDesc, p.Price, c.CQuantity 
                FROM cart_table c 
                INNER JOIN product_table p ON c.PId = p.PId 
                WHERE c.UId = @UserID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@UserID", Session["UID"]);

                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                Response.Write("<script>alert('Please enter a valid quantity for all selected products.');</script>");
                sda.Fill(dt);

                CartRepeater.DataSource = dt;
                CartRepeater.DataBind();

                EmptyCartMessage.Visible = (CartRepeater.Items.Count == 0);
                btnBuySelected.Visible = (CartRepeater.Items.Count != 0);
                
            }
        }
        catch (Exception ex)
        {
            Response.Write("<script>alert('Error loading cart: " + ex.Message + "');</script>");
        }
    }

    protected void btnBuySelected_Click(object sender, EventArgs e)
    {
        List<Dictionary<string, object>> selectedProducts = new List<Dictionary<string, object>>();

        // Loop through each item in the Repeater
        foreach (RepeaterItem item in CartRepeater.Items)
        {
            CheckBox chkSelect = (CheckBox)item.FindControl("SelectProductCheckBox");
            HiddenField hfProductID = (HiddenField)item.FindControl("SelectedProductID");
            RadioButtonList sizeList = (RadioButtonList)item.FindControl("sizeList");
            TextBox txtQuantity = (TextBox)item.FindControl("txtQuantity");
            Label priceLabel = (Label)item.FindControl("PriceLabel");
            string productName = ((Label)item.FindControl("ProductNameLbl")).Text;

            if (chkSelect != null && chkSelect.Checked)
            {
                int quantity;
                if (!int.TryParse(txtQuantity.Text.Trim(), out quantity) || quantity <= 0)
                {
                    Response.Write("<script>alert('Please enter a valid quantity for all selected products.');</script>");
                    return;
                }

                if (string.IsNullOrEmpty(sizeList.SelectedValue))
                {
                    Response.Write("<script>alert('Please select a size for all selected products.');</script>");
                    return;
                }

                // Check stock availability before adding to cart
                int productID = Convert.ToInt32(hfProductID.Value);
                bool isStockSufficient = CheckStockAvailability(productID, quantity);

                if (!isStockSufficient)
                {
                    Response.Write("<script>alert('Insufficient stock for " + productName + ".');</script>");
                    return;
                }

                // Add product details to the list if stock is sufficient
                Dictionary<string, object> productDetails = new Dictionary<string, object>
            {
                { "ProductID", productID },
                { "ProductName", productName },
                { "Quantity", quantity },
                { "Size", sizeList.SelectedValue },
                { "Price", Convert.ToDecimal(priceLabel.Text) },
                { "TotalPrice", Convert.ToDecimal(priceLabel.Text) * quantity }
            };

                selectedProducts.Add(productDetails);
            }
        }

        if (selectedProducts.Count == 0)
        {
            Response.Write("<script>alert('Please select at least one product to add to the cart.');</script>");
        }
        else
        {
            Session["SelectedProducts"] = selectedProducts;
            Response.Write("<script>alert('Products added to cart successfully.');</script>");
            Response.Redirect("~/Confirm.aspx");
        }
    }

    // Method to check stock availability for a product
    private bool CheckStockAvailability(int productID, int quantity)
    {
        bool isAvailable = false;

        string query = "SELECT PQuantity FROM product_table WHERE PId = @PId";
        using (SqlConnection conn = new SqlConnection(conStr))
        {
            conn.Open();
            SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@PId", productID);

            int availableStock = Convert.ToInt32(cmd.ExecuteScalar());

            // If available stock is greater than or equal to the requested quantity, it's sufficient
            if (availableStock >= quantity)
            {
                isAvailable = true;
            }
        }

        return isAvailable;
    }


    protected void SelectProductCheckBox_CheckedChanged(object sender, EventArgs e)
    {
        // You can handle checkbox state changes here if you need to update some UI element.
    }


}