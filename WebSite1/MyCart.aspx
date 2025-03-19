<%@ Page Title="" Language="C#" MasterPageFile="~/UserMasterPage.master" AutoEventWireup="true" CodeFile="MyCart.aspx.cs" Inherits="MyCart" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="container">
        <div class="card shadow mx-auto">
            <div class="card-header text-center" style="background-color: pink; color: #5C3D58;">
                <h3>My Cart</h3>
            </div>
            
            <h4 align="center" id="EmptyCartMessage" runat="server" visible="false">
                Your cart is empty.</h4>
            <div class="cart-card-body">
            <!-- Global "Buy Selected Items" Button -->
            <div class="cart-column">
                                <asp:Button ID="btnBuySelected" runat="server" Text="Buy Selected Items"
                        CssClass="btn all-btn my-1" Visible="true" OnClick="btnBuySelected_Click" />
                            </div>
                
                <asp:Repeater ID="CartRepeater" runat="server">
                    <ItemTemplate>
                        <div class="cart-card">
                            <!-- Checkbox for selecting multiple items -->
                            <div class="cart-column">
                               <asp:CheckBox ID="SelectProductCheckBox" runat="server" OnCheckedChanged="SelectProductCheckBox_CheckedChanged" AutoPostBack="true" CssClass="checkbox-large" />

                                <asp:HiddenField ID="SelectedProductID" runat="server" Value='<%# Eval("PId") %>' />
                            </div>
                            <!-- Product Image and Details (same as before) -->
                            <div class="cart-column">
                                <img src='<%# "data:image/png;base64," + Convert.ToBase64String((byte[])Eval("PImg")) %>' alt="<%# Eval("PName") %>" />
                            </div>
                            <div class="cart-column cart-product-details">
                                <div class="product-name">
                                    <asp:Label ID="ProductNameLbl" runat="server" Text='<%# Eval("PName") %>'></asp:Label>
                                </div>
                                <div class="product-brand">
                                    Brand: <%# Eval("PBrand") %>
                                </div>
                                <div class="product-description">
                                    <%# Eval("PDesc") %>
                                </div>
                            </div>
                            <div class="cart-column">
                                <div>
                                    <label>Select Size:</label><br />
                                    <asp:RadioButtonList ID="sizeList" runat="server" RepeatDirection="Horizontal">
                                        <asp:ListItem Text="S" Value="S"></asp:ListItem>
                                        <asp:ListItem Text="M" Value="M"></asp:ListItem>
                                        <asp:ListItem Text="L" Value="L"></asp:ListItem>
                                    </asp:RadioButtonList>
                                </div>
                                <div>
                                    <label>Quantity:</label><br />
                                    <asp:TextBox ID="txtQuantity" runat="server" Text="1" Width="50"></asp:TextBox>
                                </div>
                            </div>
                            <div class="cart-column">
                                <div>
                                    Price: ₹<asp:Label ID="PriceLabel" runat="server" Text='<%# Eval("Price") %>'></asp:Label>
                                </div>
                            </div>
                        </div>
                    </ItemTemplate>
                </asp:Repeater>

                
            </div>
        </div>
    </div>
</asp:Content>
