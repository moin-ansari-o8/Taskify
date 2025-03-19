<%@ Page Title="" Language="C#" MasterPageFile="~/UserMasterPage.master" AutoEventWireup="true" CodeFile="ContactUs.aspx.cs" Inherits="ContactUs" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow">
                    <!-- Card Header -->
                    <div class="card-header text-center" style="background-color: #FAD0C4; color: #5C3D58;">
                        <h3>Contact Us</h3>
                        <p>We would love to hear from you!</p>
                    </div>
                    
                    <!-- Card Body -->
                    <div class="card-body">
                        <form>
                            <!-- Name Field -->
                            <div class="mb-3">
                                <label for="name" class="form-label">Name</label>
                                <input type="text" class="form-control" id="name" placeholder="Enter your full name" >
                            </div>
                            
                            <!-- Email Field -->
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" placeholder="Enter your email" >
                            </div>
                            
                            <!-- Subject Field -->
                            <div class="mb-3">
                                <label for="subject" class="form-label">Subject</label>
                                <input type="text" class="form-control" id="subject" placeholder="Enter the subject">
                            </div>
                            
                            <!-- Message Field -->
                            <div class="mb-3">
                                <label for="message" class="form-label">Message</label>
                                <textarea class="form-control" id="message" rows="5" placeholder="Type your message here" ></textarea>
                            </div>
                            
                            <!-- Submit and Reset Buttons -->
                            <div class="d-flex justify-content-between">
                                <button type="submit" class="btn all-btn">Submit
                                </button>
                                <button type="reset" class="btn all-btn">Reset</button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Card Footer -->
                    <div class="card-footer text-center" style="background-color: #FAD0C4;">
                        <p style="color: #5C3D58;">You can also reach us at <b>TrendAura@yahoo.com</b> or call <b>+1-234-567-890</b>.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>

