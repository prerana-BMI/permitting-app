using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace contract.Entities
{
    public class ECityMaster
    {
        public int Id { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
    
    }
}