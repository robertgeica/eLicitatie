using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using eLicitatie.Models;
using eLicitatie.Services;

namespace eLicitatie.Controllers;

[Route("api")]
// [Controller]
// [ApiController]
public class ProductController : Controller
{
  private readonly ProductService _productService;

  public ProductController(ProductService productService)
  {
    _productService = productService;
  }

  [HttpGet("product"), Authorize]
  public async Task<List<ProductModel>> Get()
  {
    return await _productService.GetProducts();
  }


  [HttpPost("product")]
  public async Task<IActionResult> Post([FromBody] ProductModel product)
  {

    // BsonDocument doc = new BsonDocument();
    // BsonDocument array = BsonSerializer.Deserialize<BsonDocument>(product.offers);

    await _productService.CreateProduct(product);
    return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateProduct(string id, [FromBody] ProductModel product)
  {

    string name = product.name;
    string description = product.description;
    string startPrice = product.startPrice;
    string startDate = product.startDate;
    string endDate = product.endDate;
    string auctionType = product.auctionType;
    string imageUrl = product.imageUrl;
    List<string> categories = product.categories;
    List<Offers> offers = product.offers;

    await _productService.EditProduct(id, name, description, startPrice, startDate, endDate, auctionType, imageUrl, categories, offers);
    return NoContent();
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(string id)
  {
    await _productService.DeleteProduct(id);
    return NoContent();
  }

  [HttpGet("product/{id}"), Authorize]
  public async Task<ProductModel> Get(string id)
  {
    return await _productService.GetProductById(id);
  }

}