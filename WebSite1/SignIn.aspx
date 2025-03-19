<%@ Page Title="" Language="C#" MasterPageFile="~/UserMasterPage.master" AutoEventWireup="true" CodeFile="SignIn.aspx.cs" Inherits="SignIn" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header text-center" style="background-color: #FAD0C4; color: #5C3D58;">
                        <h3>Sign In</h3>
                    </div>
                    <div class="card-body">

                        <!-- Username Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label1" For="txtUsername" CssClass="form-label" runat="server" Text="Username" />
                            <asp:TextBox ID="txtUsername" runat="server" CssClass="form-control" placeholder="Enter your username"></asp:TextBox>
                        </div>

                        <!-- Password Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label2" For="txtPassword" CssClass="form-label" runat="server" Text="Password" />
                            <asp:TextBox ID="txtPassword" runat="server" TextMode="Password" CssClass="form-control" placeholder="Enter your password"></asp:TextBox>
                        </div>

                        <!-- Remember Me Option -->
                        <div class="form-check mb-3">
                            <asp:CheckBox ID="chkRememberMe" runat="server" CssClass="form-check-input" />
                            <asp:Label ID="Label3" CssClass="form-check-label" For="chkRememberMe" runat="server" Text="Remember Me" Style="color: #5C3D58;" />
                        </div>

                        <br> 
                        <asp:Label CssClass="mb-4" ID="lblMessage" runat="server" />

                        <!-- Buttons -->
                        <div class="d-flex justify-content-between">
                            <asp:Button ID="btnSignIn" runat="server" OnClick="signIn" CssClass="btn all-btn" Text="Sign In" />
                            <asp:Button ID="btnClear" runat="server" OnClick="ClearFields" CssClass="btn all-btn" Text="Reset" />
                        </div>

                        <!-- Redirect Link -->
                        <div class="text-center mt-4">
                            <p style="color: #5C3D58;">
                                Don't have an account? 
                                <asp:HyperLink ID="lnkSignUp" runat="server" NavigateUrl="SignUp.aspx" CssClass="all-link">Sign Up</asp:HyperLink>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
