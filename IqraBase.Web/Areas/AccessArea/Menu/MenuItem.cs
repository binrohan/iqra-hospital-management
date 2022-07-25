using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IqraBase.Web.Areas.AccessArea.Menu
{
    public class MenuItem
    {
        public MenuItem(string text,string url,List<Guid>actionMethodId) {
            Text = text;
            Url = url;
            ActionMethodId = actionMethodId;
        }
        public string Text { get; set; }
        public string Url { get; set; }
        public List<Guid> ActionMethodId { get; set; }
    }
}