
using AutoMapper;
using contract;
using contract.Entities;
using Data.DbEntities;
namespace permitapi
{
   

public class MappingProfile : Profile
{
        public MappingProfile()
        {
            CreateMap<EPermitMaster, PermitMaster>();
            CreateMap<EPermitMasterDetail, PermitMasterDetail>();
            
            CreateMap<EUsers, User>();
            CreateMap<User, EUsers>();
        // Add other mappings here
        }
}
}