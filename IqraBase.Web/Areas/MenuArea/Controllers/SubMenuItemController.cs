using IqraBase.Web.Controllers;
using IqraBase.Data.Entities.MenuArea;
using IqraBase.Data.Models.MenuArea;
using IqraBase.Service.MenuArea;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IqraBase.Web.Areas.MenuArea.Controllers
{
    public class SubMenuItemController : AppBaseController<SubMenuItem, SubMenuItemModel>
    {
        SubMenuItemService _service;
        public SubMenuItemController()
        {
            service  = _service = new SubMenuItemService();
        }
        // GET: MenuArea/SubMenuItem
    }
}