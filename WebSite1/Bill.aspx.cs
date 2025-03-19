using System;
using System.Collections.Generic;
using System.Web.UI;

public partial class Bill : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            // Check if there are selected products in the session
            if (Session["SelectedProducts"] != null)
            {
                // Retrieve the selected products from the session
                List<Dictionary<string, object>> selectedProducts = (List<Dictionary<string, object>>)Session["SelectedProducts"];
                
                // Display alert for order confirmation
                ShowAlert("Order confirmed!");

                // Bind the selected products list to the repeater
                BillRepeater.DataSource = selectedProducts;
                BillRepeater.DataBind();

                // Calculate the total order price
                decimal totalOrderPrice = CalculateTotalOrderPrice(selectedProducts);

                // Set the total order price
                totalOrderPriceLabel.Text = "₹" + totalOrderPrice.ToString("F2");

                // Set the username label if available in the session
                SetUsernameLabel();

                // Optionally, clear the session after displaying the bill (if needed)
                Session["SelectedProducts"] = null;
            }
            else
            {
                // Handle case when no products are in the session
                ShowAlert("No products in the cart.");
            }
        }
        catch (Exception ex)
        {
            ShowAlert("Error loading bill: {ex.Message}");
        }
    }

    private void ShowAlert(string message)
    {
        // Display a JavaScript alert
        Response.Write("<script>alert('"+message+"');</script>");
    }

    private decimal CalculateTotalOrderPrice(List<Dictionary<string, object>> selectedProducts)
    {
        // Calculate the total order price
        decimal totalOrderPrice = 0;
        foreach (var product in selectedProducts)
        {
            int quantity = Convert.ToInt32(product["Quantity"]);
            decimal price = Convert.ToDecimal(product["Price"]);
            totalOrderPrice += quantity * price;
        }
        return totalOrderPrice;
    }

    private void SetUsernameLabel()
    {
        // Check if the username is available in the session first
        if (Session["UNM"] != null)
        {
            usernameLabel.Text = Session["UNM"].ToString();
        }
        // If not in session, check if it's in the cookies
        else if (Request.Cookies["unm"] != null)
        {
            // Retrieve the username from the cookie and set the label
            usernameLabel.Text = Request.Cookies["unm"].Value;
        }
        else
        {
            // Optionally, set a default message if no username is found
            usernameLabel.Text = "Guest";
        }
    }


    protected string GetValue(object dataItem, string key)
    {
        // Retrieve the value for a given key from the dictionary
        var item = dataItem as Dictionary<string, object>;
        if (item != null && item.ContainsKey(key))
        {
            var value = item[key];
            return value != null ? value.ToString() : string.Empty;
        }
        return string.Empty;
    }
}
