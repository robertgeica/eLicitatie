using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace eLicitatie.Models;
public class CategoryModel
{

  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? Id { get; set; }
  public string name { get; set; } = string.Empty;
  public List<string> subcategories { get; set; } = null!;

}