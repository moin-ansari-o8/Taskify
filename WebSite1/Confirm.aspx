<%@ Page Title="" Language="C#" MasterPageFile="~/UserMasterPage.master" AutoEventWireup="true"
    CodeFile="Confirm.aspx.cs" Inherits="Confirm" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow">
                    <div class="card-header text-center" style="background-color: #FAD0C4; color: #5C3D58;">
                        <h3>Order Confirmation</h3>
                    </div>
                    <div class="card-body">
                        
                        <!-- Table for Cart Items -->
                        <div class="table-responsive mb-4">
                            <table class="table table-bordered">
                                <thead style="background-color: #FAD0C4; color: #5C3D58;">
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Price (₹)</th>
                                        <th>Total (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <asp:Repeater ID="CartRepeater" runat="server">
                                        <ItemTemplate>
                                            <tr>
                                                <!-- Access dictionary values by key using GetValue -->
                                                <td><%# GetValue(Container.DataItem, "ProductName")%></td>
                                                <td><%# GetValue(Container.DataItem, "Quantity") %></td>
                                                <td><%# GetValue(Container.DataItem, "Price") %></td>
                                                <td><%# GetValue(Container.DataItem, "TotalPrice")%></td>
                                            </tr>
                                        </ItemTemplate>
                                    </asp:Repeater>
                                </tbody>
                            </table>
                        </div>

                        <!-- User Details Section -->
                        <div class="mb-3">
                            <asp:Label ID="LabelPhoneNumber" For="txtPhoneNumber" CssClass="form-label" runat="server" Text="Phone Number" />
                            <asp:TextBox ID="txtPhoneNumber" runat="server" CssClass="form-control" placeholder="Enter your phone number"></asp:TextBox>
                        </div>
                        <div class="mb-3">
                            <asp:Label ID="LabelEmail" For="txtEmail" CssClass="form-label" runat="server" Text="Email" />
                            <asp:TextBox ID="txtEmail" runat="server" CssClass="form-control" placeholder="Enter your email"></asp:TextBox>
                        </div>
                        <div class="mb-3">
                            <asp:Label ID="LabelAddress" For="txtAddress" CssClass="form-label" runat="server" Text="Address" />
                            <asp:TextBox ID="txtAddress" runat="server" CssClass="form-control" TextMode="MultiLine" placeholder="Enter your address" Rows="4"></asp:TextBox>
                        </div>

                        <!-- Buttons -->
                        <asp:Label CssClass="mb-4" ID="lblMessage" runat="server" />
                        <div class="d-flex justify-content-between">
                            <asp:Button ID="btnConfirm" runat="server" OnClick="ConfirmOrder" CssClass="btn all-btn" Text="Confirm Order" />
                            <asp:Button ID="btnClear" runat="server" OnClick="ClearFields" CssClass="btn all-btn" Text="Reset" />
                        </div>

                        <!-- Redirect Link -->
                        <div class="text-center mt-4">
                            <p style="color: #5C3D58;">
                                Need help? 
                                <asp:HyperLink ID="lnkSupport" runat="server" NavigateUrl="Support.aspx" CssClass="all-link">Contact Support</asp:HyperLink>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
