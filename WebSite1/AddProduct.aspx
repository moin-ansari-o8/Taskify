<%@ Page Title="" Language="C#" MasterPageFile="~/AdminMasterPage.master" AutoEventWireup="true"
    CodeFile="AddProduct.aspx.cs" Inherits="AddProduct" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header text-center" style="background-color: #FAD0C4; color: #5C3D58;">
                        <h3>
                            Add Product</h3>
                    </div>
                    <div class="card-body">
                        <!-- Product Name Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label1" For="txtProductName" CssClass="form-label" runat="server"
                                Text="Product Name " />
                            <asp:TextBox ID="txtProductName" runat="server" CssClass="form-control" placeholder="Enter product name" />
                            
                        </div>
                        <!-- Price Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label2" For="txtPrice" CssClass="form-label" runat="server" Text="Price" />
                            <asp:TextBox ID="txtPrice" runat="server" CssClass="form-control" placeholder="Enter product price" />
                            
                        </div>
                        <div class="mb-3">
                            <asp:Label ID="Label4" For="ddlBrandMain" CssClass="form-label" runat="server" Text="Brand" />
                            <asp:DropDownList ID="ddlBrandMain" CssClass="form-control" runat="server" AutoPostBack="true"
                                OnSelectedIndexChanged="ddlBrandMain_SelectedIndexChanged">
                            </asp:DropDownList>
                           
                        </div>
                        <!-- Category Dropdown -->
                        <div class="mb-3">
                            <asp:Label ID="Label5" For="ddlCategory" CssClass="form-label" runat="server" Text="Category" />
                            <asp:DropDownList ID="ddlCategory" CssClass="form-control" AutoPostBack="False" runat="server">
                                <asp:ListItem>-- SELECT --</asp:ListItem>
                                <asp:ListItem>Men</asp:ListItem>
                                <asp:ListItem>Women</asp:ListItem>
                                <asp:ListItem>Kids</asp:ListItem>
                            </asp:DropDownList>
                            
                        </div>
                        <!-- SubCategory Dropdown -->
                        <div class="mb-3">
                            <asp:Label ID="Label6" For="ddlSubCategory" CssClass="form-label" runat="server"
                                Text="SubCategory" />
                            <asp:DropDownList ID="ddlSubCategory" CssClass="form-control" runat="server" 
                                AutoPostBack="True" 
                                OnSelectedIndexChanged="ddlSubCategory_SelectedIndexChanged">
                                
                            </asp:DropDownList>
                        </div>
                        <!-- Size Dropdown -->
                        <div class="mb-3">
                            <asp:Label ID="Label7" For="ddlSize" CssClass="form-label" runat="server" Text="Size" />
                            <asp:DropDownList ID="ddlSize" CssClass="form-control" runat="server" AutoPostBack="False">
                                <asp:ListItem Value="None">-- SELECT --</asp:ListItem>
                                <asp:ListItem Value="XS">XS</asp:ListItem>
                                <asp:ListItem Value="S">S</asp:ListItem>
                                <asp:ListItem Value="M">M</asp:ListItem>
                                <asp:ListItem Value="L">L</asp:ListItem>
                                <asp:ListItem Value="XL">XL</asp:ListItem>
                                <asp:ListItem Value="XXL">XXL</asp:ListItem>
                            </asp:DropDownList>
                        </div>
                        <!-- Quantity Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label20" For="txtQuantity" CssClass="form-label" runat="server" Text="Quantity" />
                            <asp:TextBox ID="txtQuantity" runat="server" CssClass="form-control" placeholder="Enter quantity" />
                        </div>
                        <!-- Description Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label8" For="txtDescription" CssClass="form-label" runat="server"
                                Text="Description" />
                            <asp:TextBox ID="txtDescription" TextMode="MultiLine" runat="server" CssClass="form-control"
                                placeholder="Enter product description"></asp:TextBox>
                        </div>
                        <!-- Upload Image Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label11" For="fuImg01" CssClass="form-label" runat="server" Text="Upload Image" />
                            <asp:FileUpload ID="fuImg01" CssClass="form-control" runat="server" />
                        </div>
                        <!-- Button Section -->
                        <div class="d-flex justify-content-between">
                            <asp:Button ID="btnAdd" runat="server" OnClick="btnAdd_Click" CssClass="btn all-btn"
                                Text="Add Product" />
                            <asp:Button ID="btnClear" runat="server" OnClick="ClearFields" CssClass="btn all-btn"
                                Text="Reset" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
