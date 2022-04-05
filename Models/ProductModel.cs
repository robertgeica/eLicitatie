using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace eLicitatie.Models;
public class ProductModel
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? Id { get; set; }
  public string userId { get; set; } = string.Empty;
  public string name { get; set; } = string.Empty;
  public string startPrice { get; set; } = string.Empty;
  public string startDate { get; set; } = string.Empty;
  public string endDate { get; set; } = string.Empty;
  public string auctionType { get; set; } = string.Empty;
  public string description { get; set; } = string.Empty;
  public string imageUrl { get; set; } = string.Empty;
  public List<string> categories { get; set; } = null!;
  public List<Offers> offers { get; set; } = null!;

}

public class Offers
{
  public double offerId { get; set; }
  public string userId { get; set; }
  public string value { get; set; }
}