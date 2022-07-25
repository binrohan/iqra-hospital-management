using IqraBaseService.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraBase.App.LogInArea
{
    public class LogInResult : ILogInResult
    {
        public Guid Id { get; set; }
        public string Roles { get; set; }
        public string Name { get; set; }
        public Guid TypeId { get; set; }
        public Guid DesignationId { get; set; } = Guid.Empty;
        public string Phone { get; set; }
        public string Email { get; set; }
        public Guid BranchId { get; set; } = Guid.Empty;
    }
}
