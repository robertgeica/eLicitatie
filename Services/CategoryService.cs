using eLicitatie.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using eLicitatie.Database;

namespace eLicitatie.Services;

public class CategoryService
{
  private readonly IMongoCollection<CategoryModel> _categoryCollection;

  public CategoryService(IOptions<MongoDBSettings> mongoDbSettings)
  {
    MongoClient client = new MongoClient(mongoDbSettings.Value.ConnectionURI);
    IMongoDatabase database = client.GetDatabase(mongoDbSettings.Value.DatabaseName);
    _categoryCollection = database.GetCollection<CategoryModel>(mongoDbSettings.Value.CategoryCollection);

  }

  public async Task CreateCategory(CategoryModel category)
  {
    await _categoryCollection.InsertOneAsync(category);
    return;
  }

  public async Task<List<CategoryModel>> GetCategories()
  {
    return await _categoryCollection.Find(new BsonDocument()).ToListAsync();
  }

  public async Task EditCategory(string id, string name, List<string> subcategories)
  {
    FilterDefinition<CategoryModel> filter = Builders<CategoryModel>.Filter.Eq("Id", id);
    UpdateDefinition<CategoryModel> update = Builders<CategoryModel>.Update
        .Set("name", name)
        .Set("subcategories", subcategories);

    await _categoryCollection.UpdateOneAsync(filter, update);
    return;
  }

  public async Task DeleteCategory(string id)
  {
    FilterDefinition<CategoryModel> filter = Builders<CategoryModel>.Filter.Eq("Id", id);
    await _categoryCollection.DeleteOneAsync(filter);
    return;
  }
}