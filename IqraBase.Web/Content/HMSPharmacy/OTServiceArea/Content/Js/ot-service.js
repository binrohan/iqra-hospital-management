import { editBtn } from "../../../../Js/modules/buttons.js";
import { otServiceColumns } from "../../../../Js/modules/columns.js";
import { deletedRecord, nonDeletedRecord } from "../../../../Js/modules/filter.js";
import { tabBuilder } from "../../../../Js/modules/utils.js";

(function () {
    const controller = 'OTServiceArea/OTService';
    const title = 'OT Service'

    $(document).ready(() => {
        $('#add-record').click(create);
    });

    function create() {
        popup({label: `Create ${title}`});
    };

    function edit(model) {
        popup({ data: model, label: `Edit ${title}`});
    };

    function popup({data, label}) {
        Global.Add({
            name: label,
            model: data,
            title: label,
            columns: otServiceColumns,
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

    const activeServiceTabConfig = {
        title: 'All_Service',
        actions: [editAction],
        filters: [nonDeletedRecord],
        columns: otServiceColumns,
        remove: { save: `/${controller}/Delete` }
    };

    const deletedServiceTabConfig = {
        title: 'Deleted_Service',
        actions: [editAction],
        filters: [deletedRecord],
        columns: otServiceColumns,
    };

    const tabs = {
        container: $('#page_container'),
        Base: { Url: `/${controller}/` },
        items: tabBuilder(activeServiceTabConfig,
                          deletedServiceTabConfig),
        periodic: false
    };

    Global.Tabs(tabs);
    tabs.items[0].set(tabs.items[0]);
})();