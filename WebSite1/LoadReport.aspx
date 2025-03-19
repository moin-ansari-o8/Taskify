<%@ Page Title="" Language="C#" MasterPageFile="~/AdminMasterPage.master" AutoEventWireup="true" CodeFile="LoadReport.aspx.cs" Inherits="LoadReport" %>
<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow">
                    <div class="card-header text-center" style="background-color: #FAD0C4; color: #5C3D58;">
                        <h3>User Report</h3>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <!-- Quantity Filter -->
                            <div class="col-md-6">
                                <div class="input-group">
                                    <label class="input-group-text" for="DropDownList1">Quantity</label>
                                    <asp:DropDownList ID="DropDownList1" runat="server" CssClass="form-select" AutoPostBack="False">
                                        <asp:ListItem Value="<">&lt;</asp:ListItem>
                                        <asp:ListItem Value=">">&gt;</asp:ListItem>
                                    </asp:DropDownList>
                                    <asp:TextBox ID="TextBox2" runat="server" CssClass="form-control" placeholder="Enter number" Width="100px"></asp:TextBox>
                                </div>
                            </div>
                            <!-- Category Filter -->
                            <div class="col-md-6">
                                <div class="input-group">
                                    <label class="input-group-text" for="DropDownList2">Category</label>
                                    <asp:DropDownList ID="DropDownList2" runat="server" CssClass="form-select" AutoPostBack="False">
                                        <asp:ListItem Value="All">-- All --</asp:ListItem>
                                        <asp:ListItem Value="Men">Men</asp:ListItem>
                                        <asp:ListItem Value="Women">Women</asp:ListItem>
                                        <asp:ListItem Value="Kids">Kids</asp:ListItem>
                                    </asp:DropDownList>
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <asp:Button ID="Button1" runat="server" Text="Load Report" CssClass="btn btn-primary" OnClick="Button1_Click" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr />
        <div class="row mt-4 justify-content-center">
            <div class="col-md-12">
                <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
                <rsweb:ReportViewer ID="ReportViewer1" runat="server" Width="100%" Height="600px"></rsweb:ReportViewer>
            </div>
        </div>
    </div>
</asp:Content>