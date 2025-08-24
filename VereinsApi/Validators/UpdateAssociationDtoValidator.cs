using FluentValidation;
using VereinsApi.DTOs.Association;
using VereinsApi.Services;

namespace VereinsApi.Validators;

/// <summary>
/// FluentValidation validator for UpdateAssociationDto
/// </summary>
public class UpdateAssociationDtoValidator : AbstractValidator<UpdateAssociationDto>
{
    private readonly IAssociationService _associationService;

    public UpdateAssociationDtoValidator(IAssociationService associationService)
    {
        _associationService = associationService ?? throw new ArgumentNullException(nameof(associationService));

        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Association ID must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Association name is required")
            .MaximumLength(200).WithMessage("Association name cannot exceed 200 characters")
            .Matches(@"^[a-zA-ZäöüÄÖÜß\s\-\.0-9]+$").WithMessage("Association name contains invalid characters");

        RuleFor(x => x.ShortName)
            .MaximumLength(50).WithMessage("Short name cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.ShortName));

        RuleFor(x => x.AssociationNumber)
            .MaximumLength(30).WithMessage("Association number cannot exceed 30 characters")
            .MustAsync(BeUniqueAssociationNumber).WithMessage("Association number must be unique")
            .When(x => !string.IsNullOrEmpty(x.AssociationNumber));

        RuleFor(x => x.TaxNumber)
            .MaximumLength(30).WithMessage("Tax number cannot exceed 30 characters")
            .Matches(@"^[0-9\/\-\s]*$").WithMessage("Tax number can only contain numbers, slashes, hyphens and spaces")
            .When(x => !string.IsNullOrEmpty(x.TaxNumber));

        RuleFor(x => x.LegalFormId)
            .GreaterThan(0).WithMessage("Legal form ID must be greater than 0")
            .When(x => x.LegalFormId.HasValue);

        RuleFor(x => x.FoundingDate)
            .LessThanOrEqualTo(DateTime.Today).WithMessage("Founding date cannot be in the future")
            .GreaterThan(new DateTime(1800, 1, 1)).WithMessage("Founding date must be after year 1800")
            .When(x => x.FoundingDate.HasValue);

        RuleFor(x => x.Purpose)
            .MaximumLength(500).WithMessage("Purpose cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Purpose));

        RuleFor(x => x.MainAddressId)
            .GreaterThan(0).WithMessage("Main address ID must be greater than 0")
            .When(x => x.MainAddressId.HasValue);

        RuleFor(x => x.MainBankAccountId)
            .GreaterThan(0).WithMessage("Main bank account ID must be greater than 0")
            .When(x => x.MainBankAccountId.HasValue);

        RuleFor(x => x.Phone)
            .MaximumLength(30).WithMessage("Phone number cannot exceed 30 characters")
            .Matches(@"^[\+]?[0-9\s\-\(\)\/]+$").WithMessage("Invalid phone number format")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Fax)
            .MaximumLength(30).WithMessage("Fax number cannot exceed 30 characters")
            .Matches(@"^[\+]?[0-9\s\-\(\)\/]+$").WithMessage("Invalid fax number format")
            .When(x => !string.IsNullOrEmpty(x.Fax));

        RuleFor(x => x.Email)
            .MaximumLength(100).WithMessage("Email cannot exceed 100 characters")
            .EmailAddress().WithMessage("Invalid email format")
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.Website)
            .MaximumLength(200).WithMessage("Website URL cannot exceed 200 characters")
            .Must(BeValidUrl).WithMessage("Invalid website URL format")
            .When(x => !string.IsNullOrEmpty(x.Website));

        RuleFor(x => x.SocialMediaLinks)
            .MaximumLength(500).WithMessage("Social media links cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.SocialMediaLinks));

        RuleFor(x => x.ChairmanName)
            .MaximumLength(100).WithMessage("Chairman name cannot exceed 100 characters")
            .Matches(@"^[a-zA-ZäöüÄÖÜß\s\-\.]+$").WithMessage("Chairman name contains invalid characters")
            .When(x => !string.IsNullOrEmpty(x.ChairmanName));

        RuleFor(x => x.ManagerName)
            .MaximumLength(100).WithMessage("Manager name cannot exceed 100 characters")
            .Matches(@"^[a-zA-ZäöüÄÖÜß\s\-\.]+$").WithMessage("Manager name contains invalid characters")
            .When(x => !string.IsNullOrEmpty(x.ManagerName));

        RuleFor(x => x.RepresentativeEmail)
            .MaximumLength(100).WithMessage("Representative email cannot exceed 100 characters")
            .EmailAddress().WithMessage("Invalid representative email format")
            .When(x => !string.IsNullOrEmpty(x.RepresentativeEmail));

        RuleFor(x => x.ContactPersonName)
            .MaximumLength(100).WithMessage("Contact person name cannot exceed 100 characters")
            .Matches(@"^[a-zA-ZäöüÄÖÜß\s\-\.]+$").WithMessage("Contact person name contains invalid characters")
            .When(x => !string.IsNullOrEmpty(x.ContactPersonName));

        RuleFor(x => x.MemberCount)
            .GreaterThanOrEqualTo(0).WithMessage("Member count cannot be negative")
            .LessThan(1000000).WithMessage("Member count seems unrealistic")
            .When(x => x.MemberCount.HasValue);

        RuleFor(x => x.StatutePath)
            .MaximumLength(200).WithMessage("Statute path cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.StatutePath));

        RuleFor(x => x.LogoPath)
            .MaximumLength(200).WithMessage("Logo path cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.LogoPath));

        RuleFor(x => x.ExternalReferenceId)
            .MaximumLength(50).WithMessage("External reference ID cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.ExternalReferenceId));

        RuleFor(x => x.ClientCode)
            .MaximumLength(50).WithMessage("Client code cannot exceed 50 characters")
            .MustAsync(BeUniqueClientCode).WithMessage("Client code must be unique")
            .When(x => !string.IsNullOrEmpty(x.ClientCode));

        RuleFor(x => x.EPostReceiveAddress)
            .MaximumLength(100).WithMessage("E-Post receive address cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.EPostReceiveAddress));

        RuleFor(x => x.SEPACreditorId)
            .MaximumLength(50).WithMessage("SEPA creditor ID cannot exceed 50 characters")
            .Matches(@"^[A-Z]{2}[0-9]{2}[A-Z0-9]{3}[0-9]{11}$").WithMessage("Invalid SEPA creditor ID format")
            .When(x => !string.IsNullOrEmpty(x.SEPACreditorId));

        RuleFor(x => x.VATNumber)
            .MaximumLength(30).WithMessage("VAT number cannot exceed 30 characters")
            .Matches(@"^[A-Z]{2}[0-9A-Z]+$").WithMessage("Invalid VAT number format")
            .When(x => !string.IsNullOrEmpty(x.VATNumber));

        RuleFor(x => x.ElectronicSignatureKey)
            .MaximumLength(100).WithMessage("Electronic signature key cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.ElectronicSignatureKey));
    }

    private async Task<bool> BeUniqueAssociationNumber(UpdateAssociationDto dto, string associationNumber, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(associationNumber))
            return true;

        return await _associationService.IsAssociationNumberUniqueAsync(associationNumber, dto.Id, cancellationToken);
    }

    private async Task<bool> BeUniqueClientCode(UpdateAssociationDto dto, string clientCode, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(clientCode))
            return true;

        return await _associationService.IsClientCodeUniqueAsync(clientCode, dto.Id, cancellationToken);
    }

    private static bool BeValidUrl(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
               (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }
}
