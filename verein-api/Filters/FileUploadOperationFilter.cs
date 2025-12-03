using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace VereinsApi.Filters;

/// <summary>
/// Swagger operation filter for handling file uploads with IFormFile parameters
/// </summary>
public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileUploadMime = "multipart/form-data";
        
        // Check if any parameter has IFormFile type
        var hasFileParameter = context.MethodInfo.GetParameters()
            .Any(p => p.ParameterType == typeof(Microsoft.AspNetCore.Http.IFormFile) ||
                      p.ParameterType == typeof(Microsoft.AspNetCore.Http.IFormFileCollection));

        if (!hasFileParameter) return;

        // Remove existing request body if it exists
        operation.RequestBody = new OpenApiRequestBody
        {
            Description = "File upload form data",
            Content = new Dictionary<string, OpenApiMediaType>
            {
                {
                    fileUploadMime, new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Required = new HashSet<string>(),
                            Properties = new Dictionary<string, OpenApiSchema>()
                        }
                    }
                }
            }
        };

        // Add all parameters to the schema
        foreach (var param in context.MethodInfo.GetParameters())
        {
            if (param.ParameterType == typeof(Microsoft.AspNetCore.Http.IFormFile))
            {
                // File parameter
                operation.RequestBody.Content[fileUploadMime].Schema.Properties[param.Name!] = new OpenApiSchema
                {
                    Type = "string",
                    Format = "binary"
                };
                operation.RequestBody.Content[fileUploadMime].Schema.Required.Add(param.Name!);
            }
            else if (param.ParameterType == typeof(Microsoft.AspNetCore.Http.IFormFileCollection))
            {
                // File collection parameter
                operation.RequestBody.Content[fileUploadMime].Schema.Properties[param.Name!] = new OpenApiSchema
                {
                    Type = "array",
                    Items = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary"
                    }
                };
                operation.RequestBody.Content[fileUploadMime].Schema.Required.Add(param.Name!);
            }
            else
            {
                // Other form parameters
                operation.RequestBody.Content[fileUploadMime].Schema.Properties[param.Name!] = context.SchemaGenerator.GenerateSchema(param.ParameterType, context.SchemaRepository);
                
                // Check if parameter has [Required] attribute or is a value type
                var hasRequiredAttribute = param.CustomAttributes.Any(attr => attr.AttributeType.Name == "RequiredAttribute");
                var isValueType = !param.ParameterType.IsClass || param.ParameterType == typeof(string);
                
                if (hasRequiredAttribute || isValueType)
                {
                    operation.RequestBody.Content[fileUploadMime].Schema.Required.Add(param.Name!);
                }
            }
        }
    }
}