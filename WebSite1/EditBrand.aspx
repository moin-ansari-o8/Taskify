<%@ Page Title="" Language="C#" MasterPageFile="~/AdminMasterPage.master" AutoEventWireup="true"
    CodeFile="EditBrand.aspx.cs" Inherits="EditBrand" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <!-- Form for editing brand -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header text-center" style="background-color: #FAD0C4; color: #5C3D58;">
                        <h3>
                            Edit Brand</h3>
                    </div>
                    <div class="card-body">
                        <!-- Brand Name Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label1" For="txtBrandName" CssClass="form-label" runat="server" Text="Brand Name" />
                            <asp:TextBox ID="txtBrandName" runat="server" CssClass="form-control" placeholder="Enter brand name" />
                            <asp:HiddenField ID="hfBrandId" runat="server" />
                            <!-- To store selected brand ID -->
                        </div>
                        <!-- Button Section -->
                        <div class="d-flex justify-content-between">
                            <asp:Button ID="btnEdit" runat="server" OnClick="btnEdit_Click" CssClass="btn all-btn"
                                Text="Edit" />
                            <asp:Button ID="btnDelete" runat="server" OnClick="btnDelete_Click" CssClass="btn all-btn"
                                Text="Delete" />
                            <asp:Button ID="btnClear" runat="server" OnClick="ClearFields" CssClass="btn all-btn"
                                Text="Clear" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr />
        <!-- GridView for displaying brands -->
        <div class="row mt-4">
            <div class="col-md-8 offset-md-2">
                <asp:GridView ID="GridViewBrand" runat="server" AutoGenerateColumns="False" CssClass="table table-bordered text-center"
                    OnSelectedIndexChanged="GridViewBrand_SelectedIndexChanged">
                    <Columns>
                        <asp:BoundField DataField="BId" HeaderText="Brand ID" />
                        <asp:BoundField DataField="BName" HeaderText="Brand Name" />
                        <asp:CommandField ShowSelectButton="True" SelectText="Select" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
    </div>
</asp:Content>
