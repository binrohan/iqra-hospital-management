import { editBtn, folderBtn } from "../../../../Js/modules/buttons.js";
import { surgeryColumns } from "../../../../Js/modules/columns.js";
import { SURGERY_TYPE } from "../../../../Js/modules/constants.js";
import { dropDown } from "../../../../Js/modules/dropdown.js";
import { deletedRecord, nonDeletedRecord } from "../../../../Js/modules/filter.js";
import { tabBuilder } from "../../../../Js/modules/utils.js";

(function () {
    const controller = 'SurgeryArea/Surgery';
    const title = 'Surgery'

    $(document).ready(() => {
        $('#add-record').click(create);
    });

    function create() {
        popup({label: `Create ${title}`});
    };

    function edit(model) {
        popup({ data: model, label: `Edit ${title}`});
    };

    function details(surgery){
        Global.Add({
            surgeryId: surgery.Id,
            name: 'order-details',
            url: '/Content/HMSPharmacy/SurgeryArea/Content/Js/surgery.js',
        });
    }

    function popup({data, label}) {
        Global.Add({
            name: label,
            model: data,
            title: label,
            columns: surgeryColumns,
            dropdownList: [],
            additionalField: [],
            onSubmit: function (formModel, data, model) {
                formModel.Id = model.Id
            },
            onSaveSuccess: function () {
                tabs.gridModel?.Reload();
            },
            save: `/${controller}/Create`,
            saveChange: `/${controller}/Edit`,
        });
    };

    const editAction = {
        click: edit,
        html: editBtn()
    };

    const detailsAction = {
        click: details,
        html: folderBtn('Surgery Details')
    };

    const allServiceTabConfig = {
        title: 'Active_Surgery',
        actions: [detailsAction, editAction],
        filters: [nonDeletedRecord],
        columns: surgeryColumns,
        remove: { save: `/${controller}/Delete` }
    };

    const deletedServiceTabConfig = {
        title: 'Deleted_Surgery',
        actions: [editAction],
        filters: [deletedRecord],
        columns: surgeryColumns,
    };

    const tabs = {
        container: $('#page_container'),
        Base: { Url: `/${controller}/` },
        items: tabBuilder(allServiceTabConfig,
                          deletedServiceTabConfig),
        periodic: false
    };

    Global.Tabs(tabs);
    tabs.items[0].set(tabs.items[0]);
})();