using IqraBase.Data;
using IqraBase.Data.Entities;
using IqraBase.Data.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace IqraHMS.OT.Data.Entities.OTServiceArea
{
    public class SurgeryModel : DropDownBaseModel
    {
        public string Code { get; set; }
        public double Price { get; set; }
    }
}
