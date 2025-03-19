<%@ Page Title="" Language="C#" MasterPageFile="~/UserMasterPage.master" AutoEventWireup="true"
    CodeFile="mwk.aspx.cs" Inherits="men" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
     
    <div class="container mt-5">
        <h2 class="text-center mb-4">Products For<asp:Label ID="lblCategoryHeading" runat="server" Text="Category"></asp:Label> </h2>

        <!-- Row for product cards -->
        <div class="row">
            <asp:Repeater ID="ProductRepeater" runat="server" OnItemCommand="ProductRepeater_ItemCommand">
                <ItemTemplate>
                    <!-- Column for each card -->
                    <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div class="card h-100">
                            <!-- Product Image -->
                            <img src='<%# "data:image/png;base64," + Convert.ToBase64String((byte[])Eval("PImg")) %>'
                                class="card-img-top" alt="Product Image" style="height: 65%; object-fit: cover;">
                            <!-- Product Details -->
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title"><%# Eval("PName") %></h5>
                                <h6 class="card-text">Price: ₹<%# Eval("Price") %></h6>
                                <p class="card-text">Description: <%# Eval("PDesc") %></p>
                                <div class="mt-auto d-flex justify-content-center">
                                    <asp:Button ID="btnAddToCart" runat="server" CssClass="btn all-btn" 
                                        Text="Add to Cart" CommandName="AddToCart" 
                                        CommandArgument='<%# Eval("PID") %>' />
                                </div>
                            </div>
                        </div>
                    </div>
                </ItemTemplate>
            </asp:Repeater>
        </div>
    </div>
</asp:Content>
