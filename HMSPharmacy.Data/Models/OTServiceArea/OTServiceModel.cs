using IqraBase.Data;
using IqraBase.Data.Entities;
using IqraBase.Data.Models;
using IqraHMS.OT.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Models.OTServiceArea
{
    public class OTServiceModel : DropDownBaseModel
    {
        public double Price { get; set; }
        public string Unit { get; set; }
    }
}
