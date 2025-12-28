namespace VereinsApi.Domain.Constants;

/// <summary>
/// Constants for FiBu (Financial Bookkeeping) - Hauptbereich (Main Business Areas)
/// Based on German tax law for non-profit organizations (SKR-49)
/// </summary>
public static class FiBuHauptbereich
{
    /// <summary>
    /// A - Ideeller Bereich (Charitable/Ideal activities)
    /// Core non-profit activities of the organization
    /// </summary>
    public const string IdeellerBereich = "A";

    /// <summary>
    /// B - Vermögensverwaltung (Asset Management)
    /// Income from investments, rental properties, interest
    /// </summary>
    public const string Vermoegensverwaltung = "B";

    /// <summary>
    /// C - Zweckbetrieb (Purpose-related Business)
    /// Business activities directly related to the organization's purpose
    /// </summary>
    public const string Zweckbetrieb = "C";

    /// <summary>
    /// D - Geschäftsbetrieb (Commercial Business)
    /// Commercial activities like cafeteria, merchandise sales
    /// </summary>
    public const string Geschaeftsbetrieb = "D";

    /// <summary>
    /// All valid Hauptbereich codes
    /// </summary>
    public static readonly string[] AllCodes = { IdeellerBereich, Vermoegensverwaltung, Zweckbetrieb, Geschaeftsbetrieb };
}

/// <summary>
/// Constants for FiBu account areas (Kasse/Bank)
/// </summary>
public static class FiBuBereich
{
    /// <summary>
    /// Cash transactions only
    /// </summary>
    public const string Kasse = "KASSE";

    /// <summary>
    /// Bank transactions only
    /// </summary>
    public const string Bank = "BANK";

    /// <summary>
    /// Both cash and bank transactions
    /// </summary>
    public const string KasseBank = "KASSE_BANK";

    /// <summary>
    /// All valid Bereich codes
    /// </summary>
    public static readonly string[] AllCodes = { Kasse, Bank, KasseBank };
}

/// <summary>
/// Constants for FiBu account types (Income/Expense)
/// </summary>
public static class FiBuTyp
{
    /// <summary>
    /// Income accounts
    /// </summary>
    public const string Einnahmen = "EINNAHMEN";

    /// <summary>
    /// Expense accounts
    /// </summary>
    public const string Ausgaben = "AUSGABEN";

    /// <summary>
    /// Accounts that can be both income and expense (e.g., transfers)
    /// </summary>
    public const string EinAusg = "EIN_AUSG";

    /// <summary>
    /// All valid Typ codes
    /// </summary>
    public static readonly string[] AllCodes = { Einnahmen, Ausgaben, EinAusg };
}

/// <summary>
/// Constants for Zahlungsweg (Payment Method)
/// </summary>
public static class Zahlungsweg
{
    /// <summary>
    /// Cash payment
    /// </summary>
    public const string Bar = "BAR";

    /// <summary>
    /// Bank transfer
    /// </summary>
    public const string Ueberweisung = "UEBERWEISUNG";

    /// <summary>
    /// Direct debit
    /// </summary>
    public const string Lastschrift = "LASTSCHRIFT";

    /// <summary>
    /// Debit card payment
    /// </summary>
    public const string EcKarte = "EC_KARTE";

    /// <summary>
    /// Check payment
    /// </summary>
    public const string Scheck = "SCHECK";

    /// <summary>
    /// All valid Zahlungsweg codes
    /// </summary>
    public static readonly string[] AllCodes = { Bar, Ueberweisung, Lastschrift, EcKarte, Scheck };
}

/// <summary>
/// Constants for SpendenZweck (Donation Purpose Categories)
/// </summary>
public static class SpendenZweckKategorie
{
    public const string Genel = "GENEL";
    public const string Kurban = "KURBAN";
    public const string Zekat = "ZEKAT";
    public const string Fitre = "FITRE";
    public const string Deprem = "DEPREM";
    public const string Cami = "CAMI";
    public const string Egitim = "EGITIM";

    public static readonly string[] AllCodes = { Genel, Kurban, Zekat, Fitre, Deprem, Cami, Egitim };
}

/// <summary>
/// Constants for DurchlaufendePosten (Transit Account) Status
/// </summary>
public static class DurchlaufendStatus
{
    public const string Offen = "OFFEN";
    public const string Teilweise = "TEILWEISE";
    public const string Abgeschlossen = "ABGESCHLOSSEN";

    public static readonly string[] AllCodes = { Offen, Teilweise, Abgeschlossen };
}

