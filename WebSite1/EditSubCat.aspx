<%@ Page Title="" Language="C#" MasterPageFile="~/AdminMasterPage.master" AutoEventWireup="true"
    CodeFile="EditSubCat.aspx.cs" Inherits="EditSubCat" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <!-- Form for editing sub-category -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header text-center" style="background-color: #FAD0C4; color: #5C3D58;">
                        <h3>
                            Edit Sub-Category</h3>
                    </div>
                    <div class="card-body">
                        <!-- Sub-Category Name Field -->
                        <div class="mb-3">
                            <asp:Label ID="Label1" For="txtSubCatName" CssClass="form-label" runat="server" Text="Sub-Category Name" />
                            <asp:TextBox ID="txtSubCatName" runat="server" CssClass="form-control" placeholder="Enter sub-category name" />
                            <asp:HiddenField ID="hfSubCatId" runat="server" />
                            <!-- To store selected sub-category ID -->
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
        <!-- GridView for displaying sub-categories -->
        <div class="row mt-4">
            <div class="col-md-8 offset-md-2">
                <asp:GridView ID="GridViewSubCat" runat="server" AutoGenerateColumns="False" CssClass="table table-bordered text-center"
                    OnSelectedIndexChanged="GridViewSubCat_SelectedIndexChanged">
                    <Columns>
                        <asp:BoundField DataField="SubId" HeaderText="Sub-Category ID" />
                        <asp:BoundField DataField="SubCatName" HeaderText="Sub-Category Name" />
                        <asp:CommandField ShowSelectButton="True" SelectText="Select" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
    </div>
</asp:Content>
