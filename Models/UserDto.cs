using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace eLicitatie.Models
{
  public class UserDto
  {

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string email { get; set; } = string.Empty;
    public string firstName { get; set; } = string.Empty;
    public string lastName { get; set; } = string.Empty;
    public string role { get; set; } = string.Empty;
    public string password { get; set; } = string.Empty;
    public List<string> productsIds { get; set; } = null!;
    public List<OffersIds> offersIds { get; set; } = null!;
  }
}