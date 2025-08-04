using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace contract.Entities
{
    public class EPermitByLocation
    {
        public string Level { get; set; }
        public List<string> State { get; set; }
        public List<string> City { get; set; }
        public string Category { get; set; }
        public string PermitName { get; set; }
        public string RegulatoryAgencyName { get; set; }
    }
}