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

  [HttpGet("user/{id}"), Authorize]
  public async Task<UserModel> Get(string id)
  {
    return await _userService.GetUserById(id);
  }


  [HttpPost("register")]
  public async Task<ActionResult<UserModel>> Register(UserDto request)
  {
    CreatePasswordHash(request.password, out byte[] passwordHash, out byte[] passwordSalt);

    var existingUsers = await getAllUsers();

    if (existingUsers.Count > 0)
    {
      user.role = "user";
    }
    else
    {
      user.role = "admin";
    }

    user.email = request.email;
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.productsIds = request.productsIds;
    user.offersIds = request.offersIds;
    user.passwordHash = passwordHash;
    user.passwordSalt = passwordSalt;

    await _userService.CreateUser(user);
    return Ok(user);
  }


  private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
  {
    using (var hmac = new HMACSHA512())
    {
      passwordSalt = hmac.Key;
      passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    }
  }

  private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
  {
    using (var hmac = new HMACSHA512(passwordSalt))
    {
      var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
      return computedHash.SequenceEqual(passwordHash);
    }
  }


  [HttpPost("login")]
  [EnableCors(origins: "*", headers: "*", methods: "*")]
  public async Task<ActionResult<string>> Login(UserLoginDto request)
  {
    var userr = await _userService.GetUserByEmail(request.email);

    if (userr == null)
    {
      return BadRequest("User not found.");
    }

    if (!VerifyPasswordHash(request.password, userr.passwordHash, userr.passwordSalt))
    {
      return BadRequest("Wrong password.");
    }

    string token = CreateToken(userr);
    return Ok(new { token, userr });
  }


  private string CreateToken(UserModel user)
  {
    List<Claim> claims = new List<Claim> {
      new Claim(ClaimTypes.Email, user.email),
    };

    var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
        _configuration.GetSection("AppSettings:Token").Value));

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.Now.AddDays(1),
        signingCredentials: creds);

    var jwt = new JwtSecurityTokenHandler().WriteToken(token);

    return jwt;
  }


}