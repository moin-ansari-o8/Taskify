<%@ Page Title="" Language="C#" MasterPageFile="~/UserMasterPage.master" AutoEventWireup="true" CodeFile="HomePage.aspx.cs" Inherits="HomePage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div id="carouselImg" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            <!-- First Slide -->
            <div class="carousel-item active">
                <img src="Images/ImgSlider/1.png" class="d-block w-100" alt="Image 1">
            </div>
            <!-- Second Slide -->
            <div class="carousel-item">
                <img src="Images/ImgSlider/2.webp" class="d-block w-100" alt="Image 2">
            </div>
            <!-- Third Slide -->
            <div class="carousel-item">
                <img src="Images/ImgSlider/3.webp" class="d-block w-100" alt="Image 3">
            </div>
        </div>
        <!-- Controls -->
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselImg" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselImg" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>

    <!---image slider End---->

    <!---Middle Contents start---->
   
    <asp:Panel ID="MiddleContent" runat="server" CssClass="container my-5">
    <asp:Panel ID="RowPanel" runat="server" CssClass="row justify-content-start g-4">
        <!-- Men's Clothing Card -->
        <asp:Panel ID="MenClothingCard" runat="server" CssClass="col-12 col-sm-6 col-md-4"> <!-- Responsive grid classes -->
            <asp:Panel ID="MenCardPanel" runat="server" CssClass="card shadow-sm h-100">
                <asp:Panel ID="MenImagePanel" runat="server" CssClass="card-img-container">
                    <asp:Image ID="MenImage" runat="server" CssClass="card-img-top" ImageUrl="Images/men.webp" AlternateText="Men's Clothing" />
                </asp:Panel>
                <asp:Panel ID="MenCardBody" runat="server" CssClass="card-body men">
                    <asp:Label ID="MenTitle" runat="server" CssClass="card-title text-center" Text="Men's Clothing"></asp:Label>
                    <asp:Label ID="MenDescription" runat="server" CssClass="card-text" Text="Discover the latest trends in men's clothing. From casual wear to formal attire, shop premium-quality outfits for every occasion."></asp:Label>
                    <div class="text-center"> 
                        <asp:HyperLink ID="MenShopNow" runat="server" CssClass="btn all-btn" NavigateUrl="mwk.aspx?category=men" Text="Shop Now"></asp:HyperLink>
                    </div>
                </asp:Panel>
            </asp:Panel>
        </asp:Panel>

        <!-- Women's Clothing Card -->
        <asp:Panel ID="WomenClothingCard" runat="server" CssClass="col-12 col-sm-6 col-md-4">
            <asp:Panel ID="WomenCardPanel" runat="server" CssClass="card shadow-sm h-100">
                <asp:Panel ID="WomenImagePanel" runat="server" CssClass="card-img-container">
                    <asp:Image ID="WomenImage" runat="server" CssClass="card-img-top" ImageUrl="Images/women.jpg" AlternateText="Women's Clothing" />
                </asp:Panel>
                <asp:Panel ID="WomenCardBody" runat="server" CssClass="card-body women">
                    <asp:Label ID="WomenTitle" runat="server" CssClass="card-title text-center" Text="Women's Clothing"></asp:Label>
                    <asp:Label ID="WomenDescription" runat="server" CssClass="card-text" Text="Explore stylish and elegant options for women. From dresses to everyday essentials, redefine your wardrobe with our collection."></asp:Label>
                    <div class="text-center">
                        <asp:HyperLink ID="WomenShopNow" runat="server" CssClass="btn all-btn" NavigateUrl="mwk.aspx?category=women" Text="Shop Now"></asp:HyperLink>
                    </div>
                </asp:Panel>
            </asp:Panel>
        </asp:Panel>

        <!-- Kids' Clothing Card -->
        <asp:Panel ID="KidsClothingCard" runat="server" CssClass="col-12 col-sm-6 col-md-4">
            <asp:Panel ID="KidsCardPanel" runat="server" CssClass="card shadow-sm h-100">
                <asp:Panel ID="KidsImagePanel" runat="server" CssClass="card-img-container">
                    <asp:Image ID="KidsImage" runat="server" CssClass="card-img-top" ImageUrl="Images/kids.jpeg" AlternateText="Kids' Clothing" />
                </asp:Panel>
                <asp:Panel ID="KidsCardBody" runat="server" CssClass="card-body kids">
                    <asp:Label ID="KidsTitle" runat="server" CssClass="card-title text-center" Text="Kids' Clothing"></asp:Label>
                    <asp:Label ID="KidsDescription" runat="server" CssClass="card-text" Text="Find adorable outfits for kids. Shop durable, comfy, and playful designs perfect for your little ones."></asp:Label>
                    <div class="text-center">
                        <asp:HyperLink ID="KidsShopNow" runat="server" CssClass="btn all-btn" NavigateUrl="mwk.aspx?category=kids" Text="Shop Now"></asp:HyperLink>
                    </div>
                </asp:Panel>
            </asp:Panel>
        </asp:Panel>
    </asp:Panel>
</asp:Panel>
</asp:Content>
