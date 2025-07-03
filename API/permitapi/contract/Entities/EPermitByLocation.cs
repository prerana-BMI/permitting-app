using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace contract.Entities
{
    public class EPermitByLocation
    {
        public string State { get; set; }
        public string City { get; set; }
        public string Category { get; set; }
        public string PermitName { get; set; }
        public string RegulatoryAgencyName { get; set; }
    }
}