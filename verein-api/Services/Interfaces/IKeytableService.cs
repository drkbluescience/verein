using VereinsApi.DTOs.Keytable;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Keytable (lookup) operations
/// Provides read-only access to all lookup tables with translations
/// </summary>
public interface IKeytableService
{
    #region Gender (Geschlecht)

    /// <summary>
    /// Gets all genders with translations
    /// </summary>
    Task<IEnumerable<GeschlechtDto>> GetAllGeschlechterAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Member Status (MitgliedStatus)

    /// <summary>
    /// Gets all member statuses with translations
    /// </summary>
    Task<IEnumerable<MitgliedStatusDto>> GetAllMitgliedStatuseAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Member Type (MitgliedTyp)

    /// <summary>
    /// Gets all member types with translations
    /// </summary>
    Task<IEnumerable<MitgliedTypDto>> GetAllMitgliedTypenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Family Relationship Type (FamilienbeziehungTyp)

    /// <summary>
    /// Gets all family relationship types with translations
    /// </summary>
    Task<IEnumerable<FamilienbeziehungTypDto>> GetAllFamilienbeziehungTypenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Payment Type (ZahlungTyp)

    /// <summary>
    /// Gets all payment types with translations
    /// </summary>
    Task<IEnumerable<ZahlungTypDto>> GetAllZahlungTypenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Payment Status (ZahlungStatus)

    /// <summary>
    /// Gets all payment statuses with translations
    /// </summary>
    Task<IEnumerable<ZahlungStatusDto>> GetAllZahlungStatuseAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Claim Type (Forderungsart)

    /// <summary>
    /// Gets all claim types with translations
    /// </summary>
    Task<IEnumerable<ForderungsartDto>> GetAllForderungsartenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Claim Status (Forderungsstatus)

    /// <summary>
    /// Gets all claim statuses with translations
    /// </summary>
    Task<IEnumerable<ForderungsstatusDto>> GetAllForderungsstatuseAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Currency (Waehrung)

    /// <summary>
    /// Gets all currencies with translations
    /// </summary>
    Task<IEnumerable<WaehrungDto>> GetAllWaehrungenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Legal Form (Rechtsform)

    /// <summary>
    /// Gets all legal forms with translations
    /// </summary>
    Task<IEnumerable<RechtsformDto>> GetAllRechtsformenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Address Type (AdresseTyp)

    /// <summary>
    /// Gets all address types with translations
    /// </summary>
    Task<IEnumerable<AdresseTypDto>> GetAllAdresseTypenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Account Type (Kontotyp)

    /// <summary>
    /// Gets all account types with translations
    /// </summary>
    Task<IEnumerable<KontotypDto>> GetAllKontotypenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Family Member Status (MitgliedFamilieStatus)

    /// <summary>
    /// Gets all family member statuses with translations
    /// </summary>
    Task<IEnumerable<MitgliedFamilieStatusDto>> GetAllMitgliedFamilieStatuseAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Nationality (Staatsangehoerigkeit)

    /// <summary>
    /// Gets all nationalities with translations
    /// </summary>
    Task<IEnumerable<StaatsangehoerigkeitDto>> GetAllStaatsangehoerigkeitenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Contribution Period (BeitragPeriode)

    /// <summary>
    /// Gets all contribution periods with translations
    /// </summary>
    Task<IEnumerable<BeitragPeriodeDto>> GetAllBeitragPeriodenAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Contribution Payment Day Type (BeitragZahlungstagTyp)

    /// <summary>
    /// Gets all contribution payment day types with translations
    /// </summary>
    Task<IEnumerable<BeitragZahlungstagTypDto>> GetAllBeitragZahlungstagTypenAsync(CancellationToken cancellationToken = default);

    #endregion
}

