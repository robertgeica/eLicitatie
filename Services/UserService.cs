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

  public async Task CreateUser(UserModel user)
  {
    await _userCollection.InsertOneAsync(user);
    return;
  }

  public async Task<List<UserModel>> GetUsers()
  {
    var users = await _userCollection.Find(new BsonDocument()).ToListAsync();

    return users;
  }

  public async Task<UserModel> GetUserById(string id)
  {
    var user = await _userCollection.Find(user => user.Id == id).FirstOrDefaultAsync();
    if (user == null)
    {
      return null;
    }
    else
    {
      return user;
    }
  }

  public async Task<UserModel> GetUserByEmail(string email)
  {
    var user = await _userCollection.Find(user => user.email == email).FirstOrDefaultAsync();
    if (user == null)
    {
      return null;
    }
    else
    {
      return user;
    }
  }

  public async Task EditUser(string id, string firstName, string lastName, List<string> productsIds, List<OffersIds> offersIds)
  {
    FilterDefinition<UserModel> filter = Builders<UserModel>.Filter.Eq("Id", id);
    UpdateDefinition<UserModel> update = Builders<UserModel>.Update
        .Set("firstName", firstName)
        .Set("lastName", lastName)
        .Set("productsIds", productsIds)
        .Set("offersIds", offersIds);

    await _userCollection.UpdateOneAsync(filter, update);
    return;
  }

}