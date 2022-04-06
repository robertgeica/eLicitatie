using eLicitatie.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using eLicitatie.Database;

namespace eLicitatie.Services;

public class ProductService
{
  private readonly IMongoCollection<ProductModel> _productCollection;

  public ProductService(IOptions<MongoDBSettings> mongoDbSettings)
  {
    MongoClient client = new MongoClient(mongoDbSettings.Value.ConnectionURI);
    IMongoDatabase database = client.GetDatabase(mongoDbSettings.Value.DatabaseName);
    _productCollection = database.GetCollection<ProductModel>(mongoDbSettings.Value.ProductCollection);

  }

  public async Task CreateProduct(ProductModel product)
  {
    await _productCollection.InsertOneAsync(product);
    return;
  }

  public async Task<List<ProductModel>> GetProducts()
  {
    return await _productCollection.Find(new BsonDocument()).ToListAsync();
  }

  public async Task<ProductModel> GetProductById(string id)
  {
    var user = await _productCollection.Find(product => product.Id == id).FirstOrDefaultAsync();
    if (user == null)
    {
      return null;
    }
    else
    {
      return user;
    }
  }

  public async Task EditProduct(string id, string name, string description, string startPrice, string startDate, string endDate, string auctionType, string imageUrl, List<string> categories, List<Offers> offers)
  {
    FilterDefinition<ProductModel> filter = Builders<ProductModel>.Filter.Eq("Id", id);
    UpdateDefinition<ProductModel> update = Builders<ProductModel>.Update
        .Set("name", name)
        .Set("description", description)
        .Set("startPrice", startPrice)
        .Set("startDate", startDate)
        .Set("endDate", endDate)
        .Set("auctionType", auctionType)
        .Set("imageUrl", imageUrl)
        .Set("categories", categories)
        .Set("offers", offers);

    await _productCollection.UpdateOneAsync(filter, update);
    return;
  }

  public async Task DeleteProduct(string id)
  {
    FilterDefinition<ProductModel> filter = Builders<ProductModel>.Filter.Eq("Id", id);
    await _productCollection.DeleteOneAsync(filter);
    return;
  }


}

