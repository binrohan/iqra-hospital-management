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
    public class MenuItemController : DropDownBaseController<MenuItem, MenuItemModel>
    {
        MenuItemService __service;
        public MenuItemController()
        {
            service = _service = __service= new MenuItemService();
        }
        // GET: MenuArea/MenuItem
    }
}