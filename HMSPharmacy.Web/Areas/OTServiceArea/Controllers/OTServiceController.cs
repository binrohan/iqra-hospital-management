using IqraHMS.OT.Data.Entities.AccountArea;
using IqraHMS.OT.Data.Entities.OTServiceArea;
using IqraHMS.OT.Data.Models.AccountArea;
using IqraHMS.OT.Data.Models.OTServiceArea;
using IqraHMS.OT.Service.AccountArea;
using IqraHMS.OT.Service.OTServiceArea;
using IqraHMS.OT.Web.Controllers;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace IqraHMS.OT.Web.Areas.OTServiceArea.Controllers
{

    public class OTServiceController : AppBaseController<OTService, OTServiceModel>
    {
        // GET: AccountArea/OTService/AutoComplete
        OTServiceService _service;
        public OTServiceController()
        {
            service = _service = new OTServiceService();
        }
    }
}