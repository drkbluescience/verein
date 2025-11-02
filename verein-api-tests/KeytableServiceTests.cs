using Xunit;
using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.Services;
using VereinsApi.Domain.Entities.Keytable;
using VereinsApi.DTOs.Keytable;
using Microsoft.EntityFrameworkCore;

namespace VereinsApi.Tests;

public class KeytableServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly ILogger<KeytableService> _logger;
    private readonly IMapper _mapper;
    private readonly KeytableService _service;

    public KeytableServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);

        var config = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<Geschlecht, GeschlechtDto>();
            cfg.CreateMap<GeschlechtUebersetzung, GeschlechtUebersetzungDto>();
        });
        _mapper = config.CreateMapper();

        _cache = new MemoryCache(new MemoryCacheOptions());
        _logger = new NullLogger<KeytableService>();
        _service = new KeytableService(_context, _cache, _logger, _mapper);
    }

    [Fact]
    public async Task GetAllGeschlechterAsync_ReturnsData()
    {
        var geschlechter = new List<Geschlecht>
        {
            new Geschlecht { Id = 1, Code = "M", Uebersetzungen = new List<GeschlechtUebersetzung>() }
        };

        _context.Geschlechter.AddRange(geschlechter);
        await _context.SaveChangesAsync();

        var result = await _service.GetAllGeschlechterAsync();

        Assert.NotNull(result);
        Assert.Single(result);
    }
}

public class NullLogger<T> : ILogger<T>
{
    public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
    public bool IsEnabled(LogLevel logLevel) => false;
    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) { }
}
