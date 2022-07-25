
(function () {
    function upload(org,ext,i) {
        var data = org.Data.Data[i];
        if (ext[data.SuplierId] && ((ext[data.SuplierId].DueAmount - data.DueAmount)>5)) {
            var model = {
                SuplierId: data.SuplierId,
                PurchaseId: '00000000-0000-0000-0000-000000000000',
                PaidAmount: ext[data.SuplierId].DueAmount - data.DueAmount,
                PurchaseAmount: 0,
                Description: 'Adjusting'
            };
            console.log([ext[data.SuplierId].DueAmount - data.DueAmount,model, data, ext[data.SuplierId], 'model, data, ext[data.SuplierId]']);
            Global.CallServer('/ExpenseArea/SuplierPayment/AddNew', function (response) {
                upload(org, ext, i + 1);
            }, function (response) {
                upload(org, ext, i + 1);
            }, model, 'POST');
        } else {
            upload(org, ext, i + 1);
        }
    };
    function setDic(model) {
        var data = {};
        model.Data.Data.each(function () {
            data[this.SuplierId] = this;
        });
        return data;
    };
    Global.CallServer('/SuplierArea/Suplier/SuplierWiseDue', function (org) {
        if (!org.IsError) {
            Global.CallServer('/ExpenseArea/SuplierPayment/SuplierWise', function (ext) {
                if (!ext.IsError) {
                    var ext = setDic(ext);
                    console.log([ext, org, 'ext,org']);
                    //upload(org, ext, 0);
                } else if (ext.Id === -4) {
                    //alert('This email is already registered.');
                }
                else
                    Global.Error.Show(ext);
            }, function (response) {
                response.Id = -8;
                Global.Error.Show(response, { user: '' })
            }, { 'PageNumber': 1, 'PageSize': 10000 }, 'POST');
        } else if (ext.Id === -4) {
        }
        else
            Global.Error.Show(ext);
    }, function (response) {
        response.Id = -8;
        Global.Error.Show(response, { user: '' })
    }, { 'PageNumber': 1, 'PageSize': 10000 }, 'POST');
})();