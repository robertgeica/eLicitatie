using eLicitatie.Models;
using eLicitatie.Database;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;

namespace eLicitatie.Services;

public class UserService
{
  private readonly IMongoCollection<UserModel> _userCollection;

  public UserService(IOptions<MongoDBSettings> mongoDbSettings)
  {
    MongoClient client = new MongoClient(mongoDbSettings.Value.ConnectionURI);
    IMongoDatabase database = client.GetDatabase(mongoDbSettings.Value.DatabaseName);
    _userCollection = database.GetCollection<UserModel>(mongoDbSettings.Value.UserCollection);

  }


  public async Task<List<UserModel>> GetUsers()
  {
    var users = await _userCollection.Find(new BsonDocument()).ToListAsync();

    return users;
  }


}