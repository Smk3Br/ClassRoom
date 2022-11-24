using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using ClassRoom.Application.Contratos;
using Microsoft.AspNetCore.Http;
using ClassRoom.Application.Dtos;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;

namespace ClassRoom.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]   
    public class BlocosController : ControllerBase
    {
    private readonly IWebHostEnvironment _hostEnvironment;

    private readonly IBlocoService _blocoService;
    public BlocosController(IBlocoService blocoService, IWebHostEnvironment hostEnvironment)
    {
      _blocoService= blocoService;
      _hostEnvironment = hostEnvironment;
    }  
    
    [HttpGet]
    public async Task<IActionResult> Get()
    {
      try
      {
          var blocos = await _blocoService.GetAllBlocosAsync();
          if(blocos == null) return NoContent();

          return Ok(blocos);
      }
      catch (Exception ex)
      {
          
          return this.StatusCode(StatusCodes.Status500InternalServerError, 
          $"Erro ao tentar recuperar blocos. Erro {ex.Message}");
      }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      try
      {  
          var bloco = await _blocoService.GetAllBlocoByIdAsync(id);
          if(bloco == null) return NoContent();

          return Ok(bloco);
      }
      catch (Exception ex)
      {
          
          return this.StatusCode(StatusCodes.Status500InternalServerError, 
            $"Erro ao tentar recuperar blocos. Erro {ex.Message}");
      }
    }

     [HttpGet("{nome}/nome")]
    public async Task<IActionResult> GetByNome(string nome)
    {
      try
      {
          var bloco = await _blocoService.GetAllBlocosByNomeAsync(nome);
          if(bloco == null) return NoContent();

          return Ok(bloco);
      }
      catch (Exception ex)
      {
          
          return this.StatusCode(StatusCodes.Status500InternalServerError, 
            $"Erro ao tentar recuperar blocos. Erro {ex.Message}");
      }
    }

    [HttpPost]
    public async Task<IActionResult> Post(BlocoDto model)
    {
      try
      {
          var bloco = await _blocoService.AddBlocos(model);
          if(bloco == null) return NoContent();

          return Ok(bloco);
      }
      catch (Exception ex)
      {
          
          return this.StatusCode(StatusCodes.Status500InternalServerError, 
          $"Erro ao tentar adicionar blocos. Erro {ex.Message}");
      }
    }

    [HttpPost("upload-image/{blocoId}")]
    public async Task<IActionResult> UploadImage(int blocoId)
    {
      try
      {
          var bloco = await _blocoService.GetAllBlocoByIdAsync(blocoId);
          if(bloco == null) return NoContent();

          var file = Request.Form.Files[0];
          
          if(file.Length > 0)
          {
            DeleteImage(bloco.ImageURL);
            bloco.ImageURL = await SaveImage(file);
          }
          var BlocoRetorno = await _blocoService.UpdateBloco(blocoId, bloco);

          return Ok(BlocoRetorno);
      }
      catch (Exception ex)
      {
          
          return this.StatusCode(StatusCodes.Status500InternalServerError, 
          $"Erro ao tentar adicionar blocos. Erro {ex.Message}");
      }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, BlocoDto model)
    {
         {
      try
      {
          var bloco = await _blocoService.UpdateBloco(id, model);
          if(bloco == null) return NoContent();

          return Ok(bloco);
      }
      catch (Exception ex)
      {
          
          return this.StatusCode(StatusCodes.Status500InternalServerError, 
          $"Erro ao tentar atualizar blocos. Erro {ex.Message}");
      }
     }
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      try
      {
        var bloco = await _blocoService.GetAllBlocoByIdAsync(id);
        if(bloco == null) return NoContent();       

        if (await _blocoService.DeleteBloco(id)) 
        {
          DeleteImage(bloco.ImageURL);
          return Ok(new {message = "Deletado"});
        }
        else
        {
          throw new Exception("Deu ruim");
        }
      }
      catch (Exception ex)
      {         
          return this.StatusCode(StatusCodes.Status500InternalServerError, 
          $"Erro ao tentar deletar blocos. Erro {ex.Message}");
      }
    }

     [NonAction]
    public async Task<string> SaveImage(IFormFile imageFile)
    {
        string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName)
                                            .Take(10)
                                            .ToArray()
                                          ).Replace(' ','-');
        
        imageName = $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";
        
        var imagePatch = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/images", imageName);
        
        using(var FileStream = new FileStream(imagePatch, FileMode.Create))
        {
          await imageFile.CopyToAsync(FileStream);
        }

        return imageName;
    }
    
    [NonAction]
    public void DeleteImage(string imageName)
    {
      var imagePatch = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/images", imageName);
      if (System.IO.File.Exists(imagePatch))
          System.IO.File.Delete(imagePatch);
    }  
  }
}

