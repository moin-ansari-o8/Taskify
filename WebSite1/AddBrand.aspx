<%@ Page Title="" Language="C#" MasterPageFile="~/AdminMasterPage.master" AutoEventWireup="true"
    CodeFile="AddBrand.aspx.cs" Inherits="AddBrand" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
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
                            <asp:Label ID="Label1" For="txtBrandName" CssClass="form-label" runat="server" Text="Brand Name" />
                            <asp:TextBox ID="txtBrandName" runat="server" CssClass="form-control" placeholder="Enter brand name" />
                        </div>
                        <!-- Button Section -->
                        <div class="d-flex justify-content-between">
                            <asp:Button ID="btnAdd" runat="server" OnClick="btnAdd_Click" CssClass="btn all-btn"
                                Text="Add Brand" />
                            <asp:Button ID="btnClear" runat="server" OnClick="ClearFields" CssClass="btn all-btn"
                                Text="Reset" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
