using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Text.RegularExpressions;

public partial class SignUp : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    // Method to clear all input fields
    protected void ClearFields(object sender, EventArgs e)
    {
        lblMessage.Text = string.Empty;
        txtUsername.Text = string.Empty;
        txtEmail.Text = string.Empty;
        txtPhone.Text = string.Empty;
        txtAddress.Text = string.Empty;
        txtPassword.Text = string.Empty;
        txtConfirmPassword.Text = string.Empty;
        ddlUserType.SelectedIndex = 0;
    }

    // Event handler for Sign Up button click
    protected void signUp(object sender, EventArgs e)
    {
        string username = txtUsername.Text.Trim();
        string email = txtEmail.Text.Trim();
        string phone = txtPhone.Text.Trim();
        string address = txtAddress.Text.Trim();
        string password = txtPassword.Text.Trim();
        string confirmPassword = txtConfirmPassword.Text.Trim();
        string userType = ddlUserType.SelectedValue;

        // Perform validations
        if (ValidateAllFields(username, email, phone, address, password, confirmPassword))
        {
            if (InsertUserIntoDatabase(username, email, phone, address, password, userType))
            {
                lblMessage.Text = "Signup successful!";
                lblMessage.ForeColor = System.Drawing.Color.Green;
                Response.Redirect("~/SignIn.aspx");
                return;
            }
            else
            {
                lblMessage.Text = "Signup failed. Please try again.";
                lblMessage.ForeColor = System.Drawing.Color.Red;
                return;
            }
        }
    }

    // Validate all fields
    private bool ValidateAllFields(string username, string email, string phone, string address, string password, string confirmPassword)
    {
        if (string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(phone) ||
            string.IsNullOrWhiteSpace(address) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(confirmPassword))
        {
            lblMessage.Text = "All fields are required.";
            lblMessage.ForeColor = System.Drawing.Color.Red;
            return false;
        }

        if (!IsValidEmail(email))
        {
            lblMessage.Text = "Invalid email format.";
            lblMessage.ForeColor = System.Drawing.Color.Red;
            return false;
        }

        if (!IsValidPhone(phone))
        {
            lblMessage.Text = "Invalid phone number format.";
            lblMessage.ForeColor = System.Drawing.Color.Red;
            return false;
        }

        if (password != confirmPassword)
        {
            lblMessage.Text = "Passwords do not match.";
            lblMessage.ForeColor = System.Drawing.Color.Red;
            return false;
        }

        if (password.Length < 6)
        {
            lblMessage.Text = "Password must be at least 6 characters long.";
            lblMessage.ForeColor = System.Drawing.Color.Red;
            return false;
        }

        return true;
    }

    // Validate email format
    private bool IsValidEmail(string email)
    {
        string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        return Regex.IsMatch(email, emailPattern);
    }

    // Validate phone number format (assuming 10 digits)
    private bool IsValidPhone(string phone)
    {
        string phonePattern = @"^\d{10}$"; // Adjust this pattern based on the phone format you need
        return Regex.IsMatch(phone, phonePattern);
    }

    // Insert user into the database
    private bool InsertUserIntoDatabase(string username, string email, string phone, string address, string password, string userType)
    {
        string connectionString = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;
        string checkQuery = "SELECT COUNT(*) FROM user_table WHERE email = @Email";
        string insertQuery = "INSERT INTO user_table (username, email, phone, address, password, user_type) VALUES (@Username, @Email, @Phone, @Address, @Password, @UserType)";

        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            try
            {
                connection.Open();

                // Check if the email already exists
                using (SqlCommand checkCommand = new SqlCommand(checkQuery, connection))
                {
                    checkCommand.Parameters.AddWithValue("@Email", email);
                    int existingCount = (int)checkCommand.ExecuteScalar();
                    if (existingCount > 0)
                    {
                        lblMessage.Text = "Email already exists.";
                        lblMessage.ForeColor = System.Drawing.Color.Red;
                        return false;
                    }
                }

                // Insert new user into the database
                using (SqlCommand insertCommand = new SqlCommand(insertQuery, connection))
                {
                    insertCommand.Parameters.AddWithValue("@Username", username);
                    insertCommand.Parameters.AddWithValue("@Email", email);
                    insertCommand.Parameters.AddWithValue("@Phone", phone);
                    insertCommand.Parameters.AddWithValue("@Address", address);
                    insertCommand.Parameters.AddWithValue("@Password", password);
                    insertCommand.Parameters.AddWithValue("@UserType", userType);
                    insertCommand.ExecuteNonQuery();
                }

                return true;
            }
            catch (Exception ex)
            {
                lblMessage.Text = "Error: " + ex.Message;
                lblMessage.ForeColor = System.Drawing.Color.Red;
                return false;
            }
        }
    }
}
