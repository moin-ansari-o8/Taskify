<%@ Page Title="" Language="C#" MasterPageFile="~/UserMasterPage.master" AutoEventWireup="true" CodeFile="Bill.aspx.cs" Inherits="Bill" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <style>
        /* Add basic styling for the page */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fbdcd3;
        }

        /* Card styling */
        .card {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin: 20px;
            padding: 20px;
            width: 80%;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Table styling */
        .bill-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .bill-table, .bill-table th, .bill-table td {
            border: 1px solid #ddd;
        }
        .bill-table th, .bill-table td {
            padding: 12px;
            text-align: left;
        }

        /* Styling for headings */
        h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
        }

        h3 {
            font-size: 20px;
            margin-top: 20px;
        }

        /* Label styling */
        p {
            font-size: 16px;
            margin: 10px 0;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .card {
                width: 95%;
                padding: 15px;
            }

            .bill-table th, .bill-table td {
                padding: 8px;
            }
        }
    </style>

    <h1 style="margin:25px"><b>Order Bill</b></h1>

    <div class="card">
        <!-- Display the username -->
        <p><strong>Name:</strong> <asp:Label ID="usernameLabel" runat="server"></asp:Label></p>

        <h3>Order Details</h3>
        <table class="bill-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <!-- Repeater to display the list of selected products -->
                <asp:Repeater ID="BillRepeater" runat="server">
                    <ItemTemplate>
                        <tr>
                            <td><%# GetValue(Container.DataItem, "ProductName")%></td>
                            <td><%# GetValue(Container.DataItem, "Quantity")%></td>
                            <td><%# GetValue(Container.DataItem, "Price")%></td>
                            <td><%# (Convert.ToInt32(GetValue(Container.DataItem, "Quantity")) * Convert.ToDecimal(GetValue(Container.DataItem, "Price"))).ToString("F2") %></td>
                        </tr>
                    </ItemTemplate>
                </asp:Repeater>
            </tbody>
        </table>

        <!-- Display the total order price below the table -->
        <p><strong>Total Order Price:</strong> <asp:Label ID="totalOrderPriceLabel" runat="server"></asp:Label></p>
    </div>
</asp:Content>
