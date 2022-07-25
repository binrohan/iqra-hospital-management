using IqraHMS.OT.Data.Entities.OperationArea;
using IqraHMS.OT.Data.Models.OperationArea;
using IqraHMS.OT.Service.OperationArea;
using IqraHMS.OT.Web.Controllers;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace IqraHMS.OT.Web.Areas.OperationArea.Controllers
{
    public class OperationHistoryController : AppBaseController<OperationHistory, OperationHistoryModel>
    {
        // GET: OperationArea/OperationHistory/HistoryByOperatrion?Id=&type=
        OperationHistoryService __service;
        public OperationHistoryController()
        {
            service = __service = new OperationHistoryService();
        }
    }
}