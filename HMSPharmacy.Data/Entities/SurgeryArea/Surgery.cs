using IqraBase.Data;
using IqraBase.Data.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace IqraHMS.OT.Data.Entities.OTServiceArea
{

    [Table("Surgery")]
    [Alias("srgry")]
    public class Surgery : DropDownBaseEntity
    {
        public string Code { get; set; }
        public double Price { get; set; }
    }
}
