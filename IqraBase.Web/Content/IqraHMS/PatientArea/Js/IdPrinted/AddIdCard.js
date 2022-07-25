
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {},patientModel, callerOptions, service = {};
    function save() {
        if (formModel.IsValid) {
            var model = {
                PatientId: callerOptions.PatientId,
                Remarks: formModel.Remarks,
                AccountId: formModel.AccountId,
                Amount: formModel.Amount,
                Reason: formModel.Reason,
                ActivityId: window.ActivityId
            };
            service.PrintService.Print(patientModel);
            windowModel.Wait('Please Wait while saving data......');
            Global.Uploader.upload({
                data: model,
                url: '/PatientArea/IdPrinted/Create',
                onProgress: function (data) {
                    
                },
                onComplete: function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        callerOptions.onSave();
                        close();
                    } else if (response.Id === -4) {
                    }
                    else
                        Global.Error.Show(response);
                },
                onError: function () {
                    windowModel.Free();
                    response.Id = -8;
                    Global.Error.Show(response, { user: '' })
                }
            });
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function load(func) {
        Global.Busy();
        Global.CallServer('/PatientArea/Patient/Details?Id=' + callerOptions.PatientId, function (response) {
            Global.Free();
            if (!response.IsError) {
                func(response.Data);
            } else {
                Global.Error.Show(response, {});
            }
        }, function (response) {
            Global.Free();
            response.Id = -8;
            Global.Error.Show(response, {});
        }, null, 'Get');
    };
    function dropDown() {
        Global.DropDown.Bind({
            elm: $(inputs['Reason']),
                dataSource: [
                    { text: 'New', value: 'New' },
                    { text: 'Lost', value: 'Lost' },
                    { text: 'Damage', value: 'Damage' },
                ]
        });
        Global.AutoComplete.Bind(AppComponent.AccountReference.AutoComplete({
            elm: $(inputs['AccountId']),
            }, 'Id Card'));
    };
    function show() {
        load(function (model) {
            patientModel = model;
            windowModel.Show();
        });
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/AddIdPrinted.html', function (response) {
                windowModel = Global.Window.Bind(response);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_print').click(save);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                dropDown();
                show();
            }, noop);
        }
    };
    (function () {
        function getStyle() {
            return `<style>
        :root{
            --main: navy;
            --second: deepskyblue;
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: monospace;
            color: #505050;
        }
        body{
            width: 100vw;
            height: 100vh;
            gap: 25px;
            display: grid;
            place-items: center;
            background: whitesmoke;
        }
        .card{
            width: 4in;
            height: 2in;
            padding: 4px;
            background: var(--main);
            transform: scale(1);
            box-shadow: 3px 4px 7px 0px #6f6f6f;
            display: grid;
            grid-template-rows: auto 1fr;
        }
        .container{
            width: 100%;
            height: 100%;
            padding: 4px;
            background: white;
            display: grid;
            grid-template-columns: auto 1fr;
            column-gap: 4px;
        }
        h1{
            font-size: 20px;
            border-bottom: 1px solid #505050;
            background: var(--main);
            color: white;
            padding-left: 8px;
        }
        .img{
            width: 111px;
            height: 111px;
            border: 1px solid var(--main);
        }

        img{
            max-width: 100%;
            width: 100%;
        }
        .details{
            width: 100%;
        }
        .info{
            border-bottom: 1px solid #505050;
        }
        .info p{
            border-bottom: 1px solid #505050;
            margin-bottom: 4px;
            font-size: 12px;
        }
        .info p:last-child{
            border-bottom: none;
            padding-bottom: 7px;
        }
        .grid-p{
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        .card-info{
            padding-right: 4px;
            padding-left: 4px;
            background: white;
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-between;
        }
        .card-info img{
            max-width: 117px;
        }
        .card-info p{
            margin-bottom: 0px;
            font-size: 10px;
            text-transform: uppercase;
        }
        .card-back{
            width: 4in;
            height: 2in;
            padding: 8px;
            background: var(--main);
            transform: scale(1);
            box-shadow: 3px 4px 7px 0px #6f6f6f;
        }
        .container-back{
            padding: 16px;
            width: 100%;
            height: 100%;
            background: white;
            background-image: url('./images/back.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            border-bottom-left-radius: 25px;
            border-top-right-radius: 25px;
        }
        @media print {
            html, body {
                background-color: #fff;
            }

            .card {
                width: initial !important;
                min-height: initial !important;
                margin: 0 !important;
                padding: 0 !important;
                border: initial !important;
                border-radius: initial !important;
                box-shadow: initial !important;
                page-break-after: always;
            }
            p{
                margin: initial !important;
            }
        }
    </style>`;
        };

        function getText(model) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Card</title>
    `+ getStyle()+`
</head>
<body>

    <div class="card">
        <h1>PATIENT ID CARD</h1>
        <div class="container">
            <div class="img">
                <img src="`+ model.Picture+`" alt="">
            </div>
            <div class="details">
                <div class="info">
                    <p>Name: `+ model.Name+`</p>
                    <p class="grid-p"><span>DOB: `+ model.DateOfBirth.getDate().format('yyyy/MM/dd') + `</span><span>Sex: ` + model.Gender +`</span></p>
                    <p>Blood Group: `+ model.BloodGroup +`</p>
                    <p>Contact: `+ model.Mobile +`</p>
                    <p>Address: `+ (model.PAddress||'') +`</p>
                    <p></p>
                </div>
            </div>
        </div>
        <div class="card-info">
            <div>
                <p>Issue Date: <span>`+ model.CreatedAt.getDate().format('yyyy/MM/dd')+`</span></p>
                <p>Expires: <span>08/21/2017</span></p>
                <p>DOB: 06/21/1975</p>
            </div>
            <div>
                <img src="./images/barcode.png" alt="">
            </div>
        </div>
    </div>
    <script>

    </script>
</body>
</html>`;
        };

        function printElem(model) {
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write(getText(model));
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus();
            return true;
        }
        function load() {

        };
        this.Print = function (model) {
            printElem(model);
        }
    }).call(service.PrintService = {});
};