﻿using System;
using System.Web;
using SageFrame.Web;
using SageFrame;
using SageFrame.Framework;
using AspxCommerce.Core;

public partial class Modules_Admin_DetailsBrowse_ViewTagsItems : BaseAdministrationUserControl
{
    public int StoreID, PortalID, CustomerID;
    public string UserName, CultureName, UserIP, CountryName;
    public string TagsIDs = string.Empty;
    public string SessionCode = string.Empty;
    public string NoImageTagItemsPath, AllowOutStockPurchase, AllowWishListViewTagsItems;

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!IsPostBack)
            {
                IncludeCss("ViewTagItems", "/Templates/" + TemplateName + "/css/MessageBox/style.css");
                IncludeJs("ViewTagItems", "/js/MessageBox/jquery.easing.1.3.js", "/js/MessageBox/alertbox.js");
                StoreID = GetStoreID;
                PortalID = GetPortalID;
                CustomerID = GetCustomerID;
                UserName = GetUsername;
                CultureName = GetCurrentCultureName;
                if (HttpContext.Current.Session.SessionID != null)
                {
                    SessionCode = HttpContext.Current.Session.SessionID.ToString();
                }

                UserIP = HttpContext.Current.Request.UserHostAddress;
                IPAddressToCountryResolver ipToCountry = new IPAddressToCountryResolver();
                ipToCountry.GetCountry(UserIP, out CountryName);

                SageFrameRoute parentPage = (SageFrameRoute)this.Page;

                TagsIDs = Request.QueryString["tagsId"];

                StoreSettingConfig ssc = new StoreSettingConfig();
                NoImageTagItemsPath = ssc.GetStoreSettingsByKey(StoreSetting.DefaultProductImageURL, StoreID, PortalID, CultureName);
                AllowOutStockPurchase = ssc.GetStoreSettingsByKey(StoreSetting.AllowOutStockPurchase, StoreID, PortalID, CultureName);
                AllowWishListViewTagsItems = ssc.GetStoreSettingsByKey(StoreSetting.EnableWishList, StoreID, PortalID, CultureName);
            }
        }
        catch (Exception ex)
        {
            ProcessException(ex);
        }
    }

    protected void page_init(object sender, EventArgs e)
    {
        try
        {
            InitializeJS();
        }
        catch (Exception ex)
        {
            ProcessException(ex);
        }
    }

    private void InitializeJS()
    {
        Page.ClientScript.RegisterClientScriptInclude("template", ResolveUrl("~/js/Templating/tmpl.js"));
        Page.ClientScript.RegisterClientScriptInclude("J12", ResolveUrl("~/js/encoder.js"));
        Page.ClientScript.RegisterClientScriptInclude("Paging", ResolveUrl("~/js/Paging/jquery.pagination.js"));
        Page.ClientScript.RegisterClientScriptInclude("aspxTemplate", ResolveUrl("~/js/Templating/AspxTemplate.js"));
    }
}