﻿    var PopularTags="";
    $(function() {
        var storeId = AspxCommerce.utils.GetStoreID();
        var portalId = AspxCommerce.utils.GetPortalID();
        var userName = AspxCommerce.utils.GetUserName();
        var cultureName = AspxCommerce.utils.GetCultureName();
        var customerId = AspxCommerce.utils.GetCustomerID();
        var ip = AspxCommerce.utils.GetClientIP();
        var countryName = AspxCommerce.utils.GetAspxClientCoutry();
        var sessionCode = AspxCommerce.utils.GetSessionCode();
        var userFriendlyURL = AspxCommerce.utils.IsUserFriendlyUrl();
        var tagName = '';
        PopularTags = {
            config: {
                isPostBack: false,
                async: false,
                cache: false,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: '{}',
                dataType: "json",
                baseURL: aspxservicePath + "AspxCommerceWebService.asmx/",
                url: "",
                method: ""
            },
            init: function() {
                PopularTags.LoadPopularTagsStaticImage();
                PopularTags.BindPopulatTags();
                PopularTags.HideDiv();
                $("#divPopularTagDetails").show();

                $("#btnBack").click(function() {
                    PopularTags.HideDiv();
                    $("#divPopularTagDetails").show();
                });
                $("#<%=btnExportDataToExcel.ClientID %>").click(function() {
                    PopularTags.ExportDataToExcel();
                });
                $("#<%=btnExportToExcel.ClientID %>").click(function() {
                    PopularTags.ExportDivDataToExcel();
                });
            },
            ajaxCall: function(config) {
                $.ajax({
                    type: PopularTags.config.type,
                    contentType: PopularTags.config.contentType,
                    cache: PopularTags.config.cache,
                    async: PopularTags.config.async,
                    data: PopularTags.config.data,
                    dataType: PopularTags.config.dataType,
                    url: PopularTags.config.url,
                    success: PopularTags.ajaxSuccess,
                    error: PopularTags.ajaxFailure
                });
            },
            LoadPopularTagsStaticImage: function() {
                $('#ajaxPopulartagsImage').attr("src", aspxTemplateFolderPath + '/images/ajax-loader.gif');
                $('#ajaxPopularTagsImage2').attr('src', aspxTemplateFolderPath + '/images/ajax-loader.gif');
            },

            HideDiv: function() {
                $("#divPopularTagDetails").hide();
                $("#divShowPopulartagsDetails").hide();
            },
            GetPopularTagsDataForExport: function() {
                this.config.url = this.config.baseURL + "GetPopularTagDetailsList";
                this.config.data = JSON2.stringify({ offset: 1, limit: null, storeId: storeId, portalId: portalId });
                this.config.ajaxCallMode = 1;
                this.ajaxCall(this.config);
            },
            BindItemTagsExportData: function(data) {
                var exportData = '<thead><tr><th>Tag Name</th><th>Popularity</th></tr></thead><tbody>';
                if (data.d.length > 0) {
                    $.each(data.d, function(index, value) {
                        exportData += '<tr><td>' + value.Tag + '</td>';
                        exportData += '<td>' + value.Popularity + '</td></tr>';
                    });
                }
                else {
                    exportData += '<tr><td>No Records Found!</td></tr>';
                }
                exportData += '</tbody>';

                $('#PopularTagExportDataTbl').html(exportData);
                $("input[id$='HdnValue']").val('<table>' + exportData + '</table>');
                $("input[id$='_csvPopularTagHdn']").val($("#PopularTagExportDataTbl").table2CSV());
                $("#PopularTagExportDataTbl").html('');
            },

            BindPopulatTags: function() {
                this.config.method = "GetPopularTagDetailsList";
                var offset_ = 1;
                var current_ = 1;
                var perpage = ($("#gdvPopularTag_pagesize").length > 0) ? $("#gdvPopularTag_pagesize :selected").text() : 10;

                $("#gdvPopularTag").sagegrid({
                    url: this.config.baseURL,
                    functionMethod: this.config.method,
                    colModel: [
                    { display: 'Tag Name', name: 'tag_name', cssclass: '', coltype: 'label', align: 'left' },
                    { display: 'Popularity', name: 'popularity', cssclass: '', controlclass: '', coltype: 'label', align: 'left' },
                    { display: 'Actions', name: 'action', cssclass: 'cssClassAction', controlclass: '', coltype: 'label', align: 'center' }
    				],

                    buttons: [
                    { display: 'View', name: 'showtags', enable: true, _event: 'click', trigger: '1', callMethod: 'PopularTags.ShowTagsDetails', arguments: '0' }
    			    ],
                    rp: perpage,
                    nomsg: "No Records Found!",
                    param: { storeId: storeId, portalId: portalId },
                    current: current_,
                    pnew: offset_,
                    sortcol: { 2: { sorter: false} }
                });
            },

            ShowTagsDetails: function(tblID, argus) {
                switch (tblID) {
                    case "gdvPopularTag":
                        $("#" + lblShowPopularHeading).html("Tag Details:'" + argus[0] + "'");
                        PopularTags.ShowPopularTagsList(argus[0]);
                        tagName = argus[0];
                        PopularTags.HideDiv();
                        $("#divShowPopulartagsDetails").show();
                        break;
                }
            },
            GetPopularTagDetailListForExport: function() {
                this.config.url = this.config.baseURL + "ShowPopularTagList";
                this.config.data = JSON2.stringify({ offset: 1, limit: null, storeId: storeId, portalId: portalId, tagName: tagName });
                this.config.ajaxCallMode = 2;
                this.ajaxCall(this.config);
            },
            BindShowPopularTagListExportData: function(data) {
                var exportData = '<thead><tr><th>User Name</th><th>Item Name</th></tr></thead><tbody>';
                if (data.d.length > 0) {
                    $.each(data.d, function(index, value) {
                        exportData += '<tr><td>' + value.AddedBy + '</td>';
                        exportData += '</td><td>' + value.ItemName + '</td></tr>';
                    });
                }
                else {
                    exportData += '<tr><td>No Records Found!</td></tr>';
                }
                exportData += '</tbody>';

                $('#ShowPopularTagDetailsExportTbl').html(exportData);
                $("input[id$='HdnGridData']").val('<table>' + exportData + '</table>');
                $("input[id$='_csvPopularTagDetailHdn']").val($("#ShowPopularTagDetailsExportTbl").table2CSV());
                $("#ShowPopularTagDetailsExportTbl").html('');
            },
            ShowPopularTagsList: function(tagName) {
                this.config.method = "ShowPopularTagList";
                var offset_ = 1;
                var current_ = 1;
                var perpage = ($("#gdvShowPopulatTagsDetails_pagesize").length > 0) ? $("#gdvShowPopulatTagsDetails_pagesize :selected").text() : 10;

                $("#gdvShowPopulatTagsDetails").sagegrid({
                    url: this.config.baseURL,
                    functionMethod: this.config.method,
                    colModel: [
                    { display: 'User Name', name: 'user_name', cssclass: '', coltype: 'label', align: 'left' },
                    { display: 'Item ID', name: 'itemId', cssclass: '', controlclass: '', coltype: 'label', align: 'left', hide: true },
                    { display: 'Item Name', name: 'item_name', cssclass: '', controlclass: '', coltype: 'label', align: 'left' },
                    { display: 'Actions', name: 'action', cssclass: 'cssClassAction', controlclass: '', coltype: 'label', align: 'center', hide: true }
    				],

                    buttons: [
    			    ],
                    rp: perpage,
                    nomsg: "No Records Found!",
                    param: { storeId: storeId, portalId: portalId, tagName: tagName },
                    current: current_,
                    pnew: offset_,
                    sortcol: { 3: { sorter: false} }
                });
            },
            ExportPopularTagToCsvData: function() {
                PopularTags.GetPopularTagsDataForExport();              
            },
            ExportPopularTagDetailToCsvData: function() {
                PopularTags.GetPopularTagDetailListForExport();               
            },
            ExportDataToExcel: function() {
                PopularTags.GetPopularTagsDataForExport();            
            },

            ExportDivDataToExcel: function() {
                PopularTags.GetPopularTagDetailListForExport();             
            },
            ajaxSuccess: function(data) {
                switch (PopularTags.config.ajaxCallMode) {
                    case 0:
                        break;
                    case 1:
                        PopularTags.BindItemTagsExportData(data);
                    case 2:
                        ItemTags.BindShowPopularTagListExportData(data);
                        break;
                }
            }
        }
        PopularTags.init();
    });