using Microsoft.AspNetCore.Mvc;
using eLicitatie.Models;
using eLicitatie.Services;

namespace eLicitatie.Controllers;

[Route("api")]
// [Controller]
// [ApiController]
public class CategoryController : Controller
{
  private readonly CategoryService _categoryService;

  public CategoryController(CategoryService categoryService)
  {
    _categoryService = categoryService;
  }

  [HttpGet("category")]
  public async Task<List<CategoryModel>> Get()
  {
    return await _categoryService.GetCategories();
  }

  [HttpPost("category")]
  public async Task<IActionResult> Post([FromBody] CategoryModel category)
  {
    await _categoryService.CreateCategory(category);
    return CreatedAtAction(nameof(Get), new { id = category.Id }, category);
  }

  [HttpPut("category/{id}")]
  public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryModel category)
  {

    string name = category.name;
    List<string> subcategories = category.subcategories;

    await _categoryService.EditCategory(id, name, subcategories);
    return NoContent();
  }

  [HttpDelete("category/{id}")]
  public async Task<IActionResult> Delete(string id)
  {
    await _categoryService.DeleteCategory(id);
    return NoContent();
  }



}