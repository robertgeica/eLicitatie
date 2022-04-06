using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace eLicitatie.Models;
public class UserModel
{

  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? Id { get; set; }
  public string email { get; set; } = string.Empty;
  public string firstName { get; set; } = string.Empty;
  public string lastName { get; set; } = string.Empty;
  public string role { get; set; } = string.Empty;
  public byte[] passwordHash { get; set; } = null!;
  public byte[] passwordSalt { get; set; } = null!;
  public List<ProductIds> productsIds { get; set; } = null!;
  public List<OffersIds> offersIds { get; set; } = null!;

}

public class ProductIds
{
  public string productId { get; set; }
  public string value { get; set; }
}

public class OffersIds
{
  public string productId { get; set; }
  public string value { get; set; }
}

