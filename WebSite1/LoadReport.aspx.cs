using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using Microsoft.Reporting.WebForms;

public partial class LoadReport : System.Web.UI.Page
{
    string conStr = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // Optionally set default values if needed
        }
    }

    protected void Button1_Click(object sender, EventArgs e)
    {
        using (SqlConnection con = new SqlConnection(conStr))
        {
            try
            {
                con.Open();
                // Base query
                string query = "SELECT * FROM product_table WHERE 1=1"; // 1=1 allows appending conditions
                SqlCommand cmd = new SqlCommand(query, con);

                // Quantity filter
                if (!string.IsNullOrEmpty(TextBox2.Text))
                {
                    int quantity;
                    if (!int.TryParse(TextBox2.Text, out quantity))
                    {
                        Response.Write("<script>alert('Please enter a valid number for quantity.');</script>");
                        return;
                    }
                    string comparison = DropDownList1.SelectedValue; // "<" or ">"
                    query = query + " AND PQuantity " + comparison + " @Quantity"; // Concatenation instead of interpolation
                    cmd.Parameters.AddWithValue("@Quantity", quantity);
                }

                // Category filter
                if (DropDownList2.SelectedValue != "All")
                {
                    query = query + " AND PCat = @Category"; // Concatenation
                    cmd.Parameters.AddWithValue("@Category", DropDownList2.SelectedValue);
                }

                cmd.CommandText = query;

                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                if (dt.Rows.Count == 0)
                {
                    Response.Write("<script>alert('No data found for the selected criteria.');</script>");
                    return;
                }

                ReportViewer1.LocalReport.DataSources.Clear();
                ReportDataSource rds = new ReportDataSource("DataSet1", dt);
                ReportViewer1.LocalReport.ReportPath = Server.MapPath("Report.rdlc");
                ReportViewer1.LocalReport.DataSources.Add(rds);
                ReportViewer1.LocalReport.Refresh();
            }
            catch (Exception ex)
            {
                Response.Write("<script>alert('Error loading report: " + ex.Message.Replace("'", "\\'") + "');</script>");
            }
        }
    }
}