using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using eLicitatie.Models;
using eLicitatie.Services;
using System.Web.Http.Cors;

namespace eLicitatie.Controllers;

[Route("api")]
[ApiController]
[EnableCors(origins: "*", headers: "*", methods: "*")]
public class AuthController : ControllerBase
{
  public static UserModel user = new UserModel();
  private readonly UserService _userService;
  private readonly IConfiguration _configuration;

  public AuthController(IConfiguration configuration, UserService userService)
  {
    _configuration = configuration;
    _userService = userService;
  }

  [HttpGet("users")]
  public async Task<List<UserModel>> getAllUsers()
  {
    return await _userService.GetUsers();
  }


}