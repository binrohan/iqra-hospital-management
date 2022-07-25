using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IqraBase.Web.Areas.AccessArea.Menu
{
    public class ProductItems
    {
        private static List<MenuItem> items;
        public int Id { get { return 1; } }
        public ProductItems() {

        }
        private void setItems() {
            if (items == null)
            {
                items=new List<MenuItem>() {
                    new MenuItem(
                        "",
                        "",
                        new List<Guid>() {
                            new Guid()
                        }
                        ),
                };
            }
        }
    }
}