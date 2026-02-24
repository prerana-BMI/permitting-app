using System.Text.Json;
using contract;
using contract.Entities;
using Data.DbEntities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace permitapi.Controllers
{
    [Route("api/[controller]")]
    public class MasterController : ControllerBase
    {
        private readonly permit_account_serviceContext _context;
        private readonly ILogger<MasterController> _logger;
        private readonly ICurrentUserService _currentUserService;
        public MasterController(permit_account_serviceContext context ,  ILogger<MasterController> logger ,  ICurrentUserService currentUserService)
        {
            _context = context;
            _logger = logger;
            _currentUserService = currentUserService; 
        }
        [HttpGet]
        [Route("GetCityBySearchText")]
        public BaseReturn<List<ECityMaster>> GetCityBySearchText(string City, string State, string County )
        {
            var requestBody = new{City,State,County};
            _logger.LogInformation("GetCityBySearchText started at {Time} by User {UserId} with request details {Request}", DateTime.UtcNow,_currentUserService?.User?.UserId ,JsonSerializer.Serialize(requestBody));
            var BaseObj = new BaseReturn<List<ECityMaster>>();
            List<ECityMaster> Result = new List<ECityMaster>();
            try
            {

                Result = _context.CityMasters.Where(a => (string.IsNullOrEmpty(City) ? true : a.City.ToLower().Contains(City)) &&
                                                         (a.State.ToLower()==State) &&
                                                        (string.IsNullOrEmpty(County) ? true : a.County.ToLower().Contains(County))).AsNoTracking().Select(a => new ECityMaster
                {

                    City = a.City,
                    State = a.State,
                    County = a.County,
                    Id  =  a.Id

                }).ToList();
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                _logger.LogError("GetCityBySearchText with  exception  at {Time} by  User {UserId} with {Error} ", DateTime.UtcNow,_currentUserService?.User?.UserId ,  ex.InnerException?.Message)  ;
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {
                _logger.LogInformation("GetCityBySearchText ended  at {Time} by  User {UserId}", DateTime.UtcNow , _currentUserService?.User?.UserId );
            }
            
            return BaseObj;
        }
        [HttpGet]
        [Route("GetStateBySearchText")]
        public BaseReturn<List<ECityMaster>> GetStateBySearchText(string State)
        {
            var requestBody = new{State};
            _logger.LogInformation("GetStateBySearchText started at {Time} by User {UserId} with request details {Request}",DateTime.UtcNow,_currentUserService?.User?.UserId , JsonSerializer.Serialize(requestBody) );
            var BaseObj = new BaseReturn<List<ECityMaster>>();
            List<ECityMaster> Result = new List<ECityMaster>();
            try
            {

                Result = _context.CityMasters.Where(a => a.State.ToLower().Contains(State))
                .ToList()
                .GroupBy(a => a.State)
                .Select(g => g.OrderBy(x => x.City).FirstOrDefault())
                .Select(a => new ECityMaster
                {
                    State = a.State,
                    County = a.County
                })
                .ToList();

                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                _logger.LogError("GetStateBySearchText with  exception  at {Time} by  User {UserId} with {Error} ", DateTime.UtcNow,_currentUserService?.User?.UserId ,  ex.InnerException?.Message)  ;
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {
                 _logger.LogInformation("GetStateBySearchText ended  at {Time} by  User {UserId}", DateTime.UtcNow , _currentUserService?.User?.UserId )  ;
            }
            return BaseObj;
        }

        [HttpGet]
        [Route("GetRegulatoryAgencyBySearchText")]
        public BaseReturn<List<ERegulatoryAgencyMaster>> GetRegulatoryAgencyBySearchText(string SearchText)
        {
            var requestBody = new{SearchText};
            _logger.LogInformation("GetRegulatoryAgencyBySearchText started at {Time} by User {UserId} with request details {Request}",DateTime.UtcNow,_currentUserService?.User?.UserId , JsonSerializer.Serialize(requestBody));
            var BaseObj = new BaseReturn<List<ERegulatoryAgencyMaster>>();
            List<ERegulatoryAgencyMaster> Result = new List<ERegulatoryAgencyMaster>();
            try
            {

                Result = _context.RegulatoryAgencyMasters.Where(a => a.Name.ToLower().Contains(SearchText))
                .ToList()
                .GroupBy(a => a.Name)
                .Select(a => a.FirstOrDefault())

                .Select(a => new ERegulatoryAgencyMaster
                {
                    Name = a.Name,
                    Id = a.Id
               }).Take(20)
                .ToList();
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                _logger.LogError("GetRegulatoryAgencyBySearchText with  exception  at {Time} by  User {UserId} with {Error} ", DateTime.UtcNow,_currentUserService?.User?.UserId ,  ex.InnerException?.Message)  ;
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {
                 _logger.LogInformation("GetRegulatoryAgencyBySearchText ended  at {Time} by  User {UserId}", DateTime.UtcNow , _currentUserService?.User?.UserId )  ;
            }
            return BaseObj;
        }


        [HttpGet]
        [Route("GetPermitNameBySearchText")]
        public BaseReturn<List<EPermitMaster>> GetPermitNameBySearchText(string SearchText)
        {
             var requestBody = new{SearchText};
            _logger.LogInformation("GetPermitNameBySearchText started at {Time} by User {UserId} with request details {Request}",DateTime.UtcNow,_currentUserService?.User?.UserId , JsonSerializer.Serialize(requestBody));
            var BaseObj = new BaseReturn<List<EPermitMaster>>();
            List<EPermitMaster> Result = new List<EPermitMaster>();
            try
            {

                Result = _context.PermitMasters.Where(a => a.PermitName.ToLower().Contains(SearchText))
                .Select(a => new EPermitMaster
                {
                    PermitName = a.PermitName,
                    Id = a.Id
                })
                .ToList();
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                _logger.LogError("GetPermitNameBySearchText with  exception  at {Time} by  User {UserId} with {Error}  ", DateTime.UtcNow,_currentUserService?.User?.UserId ,  ex.InnerException?.Message)  ;
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {
                 _logger.LogInformation("GetPermitNameBySearchText ended  at {Time} by  User {UserId}", DateTime.UtcNow , _currentUserService?.User?.UserId )  ;
            }
            return BaseObj;
        }

        [HttpGet]
        [Route("GetMasterPermitType")]
        public BaseReturn<List<string>> GetMasterPermitType()
        {
            _logger.LogInformation("GetMasterPermitType started at {Time} by User {UserId}",DateTime.UtcNow,_currentUserService?.User?.UserId);
            var BaseObj = new BaseReturn<List<string>>();
            List<string> Result = new List<string>();
            try
            {

                Result = _context.PermitMasters.Where(a => !string.IsNullOrEmpty(a.TypeOfProject)).Select(a => a.TypeOfProject).Distinct().ToList();


                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                _logger.LogError("GetMasterPermitType with  exception  at {Time} by  User {UserId} with {Error} ", DateTime.UtcNow,_currentUserService?.User?.UserId ,  ex.InnerException?.Message)  ;
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {
                 _logger.LogInformation("GetMasterPermitType ended  at {Time} by  User {UserId}", DateTime.UtcNow , _currentUserService?.User?.UserId )  ;
            }
            return BaseObj;
        }

        [HttpGet]
        [Route("GetMasterCategoryList")]
        public BaseReturn<List<string>> GetMasterCategoryList()
        {
            _logger.LogInformation("GetMasterCategoryList started at {Time} by User {UserId}",DateTime.UtcNow,_currentUserService?.User?.UserId);
            var BaseObj = new BaseReturn<List<string>>();
            List<string> Result = new List<string>();
            try
            {
               

                Result = _context.PermitMasters.Where(a => !string.IsNullOrEmpty(a.Category)).Select(a => a.Category).Distinct().ToList();
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                _logger.LogError("GetMasterCategoryList with  exception  at {Time} by  User {UserId} with {Error} ", DateTime.UtcNow,_currentUserService?.User?.UserId ,  ex.InnerException?.Message)  ;
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {
                 _logger.LogInformation("GetMasterCategoryList ended  at {Time} by  User {UserId}", DateTime.UtcNow , _currentUserService?.User?.UserId )  ;
            }
            return BaseObj;
        }

        [HttpGet]
        [Route("GetAllClientMaster")]
        public BaseReturn<List<EClientMaster>> GetAllClientMaster(string SearchText)
        {
          
           var requestBody = new{SearchText};
           _logger.LogInformation("GetAllClientMaster started at {Time} by User {UserId} with request details {Request}",DateTime.UtcNow,_currentUserService?.User?.UserId , JsonSerializer.Serialize(requestBody));
            var BaseObj = new BaseReturn<List<EClientMaster>>();

            try
            {

                var Result = _context.ClientMasters.Where(a => !string.IsNullOrEmpty(a.Name) && a.Name.ToLower().Contains(SearchText.ToLower())).Select(a =>new EClientMaster{ Name = a.Name })
                .Distinct()
                .ToList();
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
                BaseObj.Success = true;
                 }
            catch (Exception ex)
            {
                _logger.LogError("GetAllClientMaster with  exception  at {Time} by  User {UserId} with {Error} ", DateTime.UtcNow,_currentUserService?.User?.UserId ,  ex.InnerException?.Message)  ;
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {
                 _logger.LogInformation("GetAllClientMaster ended  at {Time} by  User {UserId}", DateTime.UtcNow , _currentUserService?.User?.UserId )  ;
            }
            return BaseObj;
        }

    }
}