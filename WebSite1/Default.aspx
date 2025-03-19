<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" debug="true"%>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>My E-Shopping Website</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <link href="css/Custome.css" rel="stylesheet" />
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <!-- Navbar -->
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
             <div class="container">
    <a class="navbar-brand" href="#">
      <img src="Images/icons/images.png" alt="cloth" width="30" height="24" class="d-inline-block align-text-top">Cloth
    </a>
  </div>
  <div class="container-fluid">
    
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Features</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Pricing</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown link
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>

            <div id="carouselImgAutoplaying" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="ImgSlider/1.jpg" alt="Los Angeles" style="width: 750;height:276" class="d-block w-100" />
    </div>
    <div class="carousel-item">
       <img src="ImgSlider/2.png" alt="Los Angeles" style="width: 750;height:276" class="d-block w-100" />
    </div>
    <div class="carousel-item">
       <img src="ImgSlider/3.png" alt="Los Angeles" style="width: 100%;" class="d-block w-100" />
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselImgAutoplaying" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselImgAutoplaying" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
        <!---image slider End---->
    </div>
    <!---Middle COntents start---->
    <hr />
    <div class="container center ">
        <div class="row ">
            <div class="col-lg-4">
                <img class="img-circle " src="Mobile/iphone11.jpeg" alt="thumb" width="140" height="140" />
                <h2>
                    Mobiles</h2>
                <p>
                    Featuring a 15.49-cm (6.1) all-screen Liquid Retina LCD and a glass and aluminum
                    design, the iPhone 11 is as beautiful as it gets. Also, the IP68 rating ensures
                    that is water-resistant up to 2 meters for 30 minutes....</p>
                <p>
                    <a class="btn btn-default " href="#" >View More &raquo;</a></p>
            </div>
            <div class="col-lg-4">
                <img class="img-circle " src="Images/Shoes.jpeg" alt="thumb" width="140" height="140" />
                <h2>
                    Footwear</h2>
                <p>
                    Featuring a 15.49-cm (6.1) all-screen Liquid Retina LCD and a glass and aluminum
                    design, the iPhone 11 is as beautiful as it gets. Also, the IP68 rating ensures
                    that is water-resistant up to 2 meters for 30 minutes....</p>
                <p>
                    <a class="btn btn-default " href="#" >View More &raquo;</a></p>
            </div>
            <div class="col-lg-4">
                <img class="img-circle " src="Images/tshirt.jpeg" alt="thumb" width="140" height="140" />
                <h2>
                    Clothings</h2>
                <p>
                    Featuring a 15.49-cm (6.1) all-screen Liquid Retina LCD and a glass and aluminum
                    design, the iPhone 11 is as beautiful as it gets. Also, the IP68 rating ensures
                    that is water-resistant up to 2 meters for 30 minutes....</p>
                <p>
                    <a class="btn btn-default " href="#" >View More &raquo;</a></p>
            </div>
        </div>
        <div class="panel panel-primary">
            <div class="panel-heading">
                BLACK FRIDAY DEAL</div>
            <div class="panel-body">
                <div class="row" style="padding-top: 50px">
                    <asp:Repeater ID="rptrProducts" runat="server">
                        <ItemTemplate>
                            <div class="col-sm-3 col-md-3">
                                <a href="ProductView.aspx?PID=<%# Eval("PID") %>" style="text-decoration: none;">
                                    <div class="thumbnail">
                                        <img src="Images/ProductImages/<%# Eval("PID") %>/<%# Eval("ImageName") %><%# Eval("Extention") %>"
                                            alt="<%# Eval("ImageName") %>" />
                                        <div class="caption">
                                            <div class="probrand">
                                                <%# Eval ("BrandName") %>
                                            </div>
                                            <div class="proName">
                                                <%# Eval ("PName") %>
                                            </div>
                                            <div class="proPrice">
                                                <span class="proOgPrice">
                                                    <%# Eval ("PPrice","{0:0,00}") %>
                                                </span>
                                                <%# Eval ("PSelPrice","{0:c}") %>
                                                <span class="proPriceDiscount">(<%# Eval("DiscAmount","{0:0,00}") %>
                                                    off) </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </ItemTemplate>
                    </asp:Repeater>
                </div>
            </div>
            <div class="panel-footer">
                Buy 50 mobiles and get a gift card</div>
        </div>
    </div>
    
    <!---Middle COntents End---->
    <!---Footer COntents Start here---->
    <hr />
    
            <div class ="container ">
               
                <p class ="pull-right "><a href ="#">&nbsp; &nbsp; Back to top &nbsp; &nbsp;</a></p>
                <p class ="pull-right "><a href="#"> Admin Login  </a></p>  
                <p>&copy;2020 Coderbaba.in &middot; <a href ="Default.aspx">Home</a>&middot;<a href ="#">About</a>&middot;<a href ="#">Contact</a>&middot;<a href ="#">Products</a> </p>
            </div>

        
    <!---Footer COntents End---->
    </form>
    <script src="js/jquery.min.js"></script>
       
        <script src="js/bootstrap.bundle.min.js"></script>
</body>
</html>
