<%@ Page Title="" Language="C#" MasterPageFile="~/AdminMasterPage.master" AutoEventWireup="true"
    CodeFile="EditProduct.aspx.cs" Inherits="EditProduct" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header text-center" style="background-color: #FAD0C4; color: #5C3D58;">
                        <h3>
                            Edit Product</h3>
                    </div>
                    <div class="card-body">
                        <!-- Product Name Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label1" For="txtProductName" CssClass="form-label" runat="server"
                                Text="Product Name" />
                            <asp:TextBox ID="txtProductName" runat="server" CssClass="form-control" placeholder="Enter product name" />
                            <asp:HiddenField ID="hfProductId" runat="server" />
                        </div>
                        <!-- Description Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label2" For="txtDescription" CssClass="form-label" runat="server"
                                Text="Description" />
                            <asp:TextBox ID="txtDescription" TextMode="MultiLine" runat="server" CssClass="form-control"
                                placeholder="Enter product description"></asp:TextBox>
                        </div>
                        <!-- Price Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label3" For="txtPrice" CssClass="form-label" runat="server" Text="Price" />
                            <asp:TextBox ID="txtPrice" runat="server" CssClass="form-control" placeholder="Enter product price" />
                        </div>
                        <!-- Quantity Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label4" For="txtQuantity" CssClass="form-label" runat="server" Text="Quantity" />
                            <asp:TextBox ID="txtQuantity" runat="server" CssClass="form-control" placeholder="Enter quantity" />
                        </div>
                        <!-- Size Dropdown -->
                        <div class="mb-3">
                            <asp:Label ID="Label5" For="ddlSize" CssClass="form-label" runat="server" Text="Size" />
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
                        <!-- Upload Image Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label6" For="fuImg01" CssClass="form-label" runat="server" Text="Upload Image" />
                            <asp:FileUpload ID="fuImg01" CssClass="form-control" runat="server" />
                        </div>
                        <div class="mb-3">
                            <asp:Label ID="Label12" For="imgPreview" CssClass="form-label" runat="server" Text="Image Preview" /><br>
                            <asp:Image ID="imgPreview" runat="server" CssClass="img-thumbnail" />
                        </div>

                        <!-- Button Section -->
                        <div class="d-flex justify-content-between">
                            <asp:Button ID="btnEdit" runat="server" OnClick="btnEdit_Click" CssClass="btn all-btn"
                                Text="Edit Product" />
                            <asp:Button ID="btnDelete" runat="server" OnClick="btnDelete_Click" CssClass="btn all-btn"
                                Text="Delete Product" />
                            <asp:Button ID="btnClear" runat="server" OnClick="ClearFields" CssClass="btn all-btn"
                                Text="Reset" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr />
        <!-- GridView for displaying products -->
        <div class="row mt-4">
            <div class="col-md-10 offset-md-1">
                <asp:GridView ID="GridViewProduct" runat="server" AutoGenerateColumns="False" CssClass="table table-bordered text-center"
                    OnSelectedIndexChanged="GridViewProduct_SelectedIndexChanged">
                    <Columns>
                        <asp:BoundField DataField="PId" HeaderText="Product ID" />
                        <asp:BoundField DataField="PName" HeaderText="Product Name" />
                        <asp:BoundField DataField="PDesc" HeaderText="Description" />
                        <asp:BoundField DataField="Price" HeaderText="Price" />
                        <asp:BoundField DataField="PQuantity" HeaderText="Quantity" />
                        <asp:BoundField DataField="PSize" HeaderText="Size" />
                        <asp:BoundField DataField="PCat" HeaderText="Category" />
                        <asp:BoundField DataField="PSubCat" HeaderText="Sub Category" />
                        <asp:CommandField ShowSelectButton="True" SelectText="Edit" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
    </div>
</asp:Content>
