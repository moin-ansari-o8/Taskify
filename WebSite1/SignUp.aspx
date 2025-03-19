<%@ Page Title="" Language="C#" MasterPageFile="~/UserMasterPage.master" AutoEventWireup="true" CodeFile="SignUp.aspx.cs" Inherits="SignUp" debug="true"%>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header text-center" style="background-color: #FAD0C4; color: #5C3D58;">
                        <h3>Sign Up</h3>
                    </div>
                    <div class="card-body">
                        <!-- Username Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label1" For="txtUsername" CssClass="form-label" runat="server" Text="Username" />
                            <asp:TextBox ID="txtUsername" runat="server" CssClass="form-control" Placeholder="Enter your username"></asp:TextBox>
                        </div>

                        <!-- Email Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label2" For="txtEmail" CssClass="form-label" runat="server" Text="Email" />
                            <asp:TextBox ID="txtEmail" runat="server" CssClass="form-control" Placeholder="Enter your email"></asp:TextBox>
                        </div>

                        <!-- Phone Number Field -->
                        <div class="mb-3">
                            <asp:Label ID="LabelPhone" For="txtPhone" CssClass="form-label" runat="server" Text="Phone Number" />
                            <asp:TextBox ID="txtPhone" runat="server" CssClass="form-control" Placeholder="Enter your phone number"></asp:TextBox>
                        </div>

                        <!-- Address Field -->
                        <div class="mb-3">
                            <asp:Label ID="LabelAddress" For="txtAddress" CssClass="form-label" runat="server" Text="Address" />
                            <asp:TextBox ID="txtAddress" runat="server" CssClass="form-control" TextMode="MultiLine" Placeholder="Enter your address"></asp:TextBox>
                        </div>

                        <!-- Password Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label3" For="txtPassword" CssClass="form-label" runat="server" Text="Password" />
                            <asp:TextBox ID="txtPassword" runat="server" TextMode="Password" CssClass="form-control" Placeholder="Enter your password"></asp:TextBox>
                        </div>

                        <!-- Confirm Password Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label4" For="txtConfirmPassword" CssClass="form-label" runat="server" Text="Confirm Password" />
                            <asp:TextBox ID="txtConfirmPassword" runat="server" TextMode="Password" CssClass="form-control" Placeholder="Confirm your password"></asp:TextBox>
                        </div>

                        <!-- User Type Dropdown -->
                        <div class="mb-3">
                            <asp:Label ID="Label5" For="ddlUserType" CssClass="form-label" runat="server" Text="User Type" />
                            <asp:DropDownList ID="ddlUserType" runat="server" CssClass="form-control">
                                <asp:ListItem Text="User" Value="user"></asp:ListItem>
                                <asp:ListItem Text="Admin" Value="admin"></asp:ListItem>
                            </asp:DropDownList>
                        </div>

                        <!-- Message Label -->
                        <asp:Label CssClass="mb-4" ID="lblMessage" runat="server" />

                        <!-- Buttons -->
                        <div class="d-flex justify-content-between">
                            <asp:Button ID="btnSignUp" runat="server" CssClass="btn all-btn" Text="Sign Up" OnClick="signUp" />
                            <asp:Button ID="btnClear" runat="server" CssClass="btn all-btn" Text="Reset" OnClick="ClearFields" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
