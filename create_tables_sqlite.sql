-- SQLite compatible version of the database schema
-- Note: This is a simplified version for development purposes

-- Drop existing tables if they exist
DROP TABLE IF EXISTS AssociationMember;
DROP TABLE IF EXISTS Member;
DROP TABLE IF EXISTS BankAccount;
DROP TABLE IF EXISTS Address;
DROP TABLE IF EXISTS LegalForm;
DROP TABLE IF EXISTS Association;

-- Create LegalForm table
CREATE TABLE LegalForm (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    ShortName TEXT,
    Description TEXT,
    IsActive INTEGER NOT NULL DEFAULT 1,
    Created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INTEGER,
    Modified DATETIME,
    ModifiedBy INTEGER,
    IsDeleted INTEGER NOT NULL DEFAULT 0
);

-- Create Address table
CREATE TABLE Address (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Street TEXT,
    HouseNumber TEXT,
    PostalCode TEXT,
    City TEXT,
    Country TEXT DEFAULT 'Deutschland',
    AddressType TEXT, -- 'Main', 'Billing', 'Shipping', etc.
    IsActive INTEGER NOT NULL DEFAULT 1,
    Created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INTEGER,
    Modified DATETIME,
    ModifiedBy INTEGER,
    IsDeleted INTEGER NOT NULL DEFAULT 0
);

-- Create BankAccount table
CREATE TABLE BankAccount (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    BankName TEXT,
    IBAN TEXT,
    BIC TEXT,
    AccountHolder TEXT,
    AccountType TEXT, -- 'Main', 'Secondary', etc.
    IsActive INTEGER NOT NULL DEFAULT 1,
    Created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INTEGER,
    Modified DATETIME,
    ModifiedBy INTEGER,
    IsDeleted INTEGER NOT NULL DEFAULT 0
);

-- Create Member table
CREATE TABLE Member (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT,
    Phone TEXT,
    DateOfBirth DATE,
    MemberNumber TEXT,
    JoinDate DATE,
    MembershipType TEXT, -- 'Regular', 'Honorary', 'Supporting', etc.
    Status TEXT DEFAULT 'Active', -- 'Active', 'Inactive', 'Suspended'
    AddressId INTEGER,
    IsActive INTEGER NOT NULL DEFAULT 1,
    Created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INTEGER,
    Modified DATETIME,
    ModifiedBy INTEGER,
    IsDeleted INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (AddressId) REFERENCES Address(Id)
);

-- Update Association table (already exists, but we'll recreate it)
DROP TABLE IF EXISTS Association;
CREATE TABLE Association (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    ShortName TEXT,
    AssociationNumber TEXT,
    TaxNumber TEXT,
    LegalFormId INTEGER,
    FoundingDate DATE,
    Purpose TEXT,
    MainAddressId INTEGER,
    MainBankAccountId INTEGER,
    Phone TEXT,
    Fax TEXT,
    Email TEXT,
    Website TEXT,
    SocialMediaLinks TEXT,
    ChairmanName TEXT,
    ManagerName TEXT,
    RepresentativeEmail TEXT,
    ContactPersonName TEXT,
    MemberCount INTEGER,
    StatutePath TEXT,
    LogoPath TEXT,
    ExternalReferenceId TEXT,
    ClientCode TEXT,
    EPostReceiveAddress TEXT,
    SEPACreditorId TEXT,
    VATNumber TEXT,
    ElectronicSignatureKey TEXT,
    Created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INTEGER,
    Modified DATETIME,
    ModifiedBy INTEGER,
    IsDeleted INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (LegalFormId) REFERENCES LegalForm(Id),
    FOREIGN KEY (MainAddressId) REFERENCES Address(Id),
    FOREIGN KEY (MainBankAccountId) REFERENCES BankAccount(Id)
);

-- Create AssociationMember junction table
CREATE TABLE AssociationMember (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    AssociationId INTEGER NOT NULL,
    MemberId INTEGER NOT NULL,
    Role TEXT, -- 'Member', 'Chairman', 'Treasurer', 'Secretary', etc.
    JoinDate DATE,
    LeaveDate DATE,
    IsActive INTEGER NOT NULL DEFAULT 1,
    Created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INTEGER,
    Modified DATETIME,
    ModifiedBy INTEGER,
    IsDeleted INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (AssociationId) REFERENCES Association(Id),
    FOREIGN KEY (MemberId) REFERENCES Member(Id),
    UNIQUE(AssociationId, MemberId)
);

-- Create indexes for better performance
CREATE INDEX IX_Association_Name ON Association(Name);
CREATE INDEX IX_Association_AssociationNumber ON Association(AssociationNumber);
CREATE INDEX IX_Association_ClientCode ON Association(ClientCode);
CREATE INDEX IX_Association_IsActive ON Association(IsActive);
CREATE INDEX IX_Association_IsDeleted ON Association(IsDeleted);

CREATE INDEX IX_Member_Email ON Member(Email);
CREATE INDEX IX_Member_MemberNumber ON Member(MemberNumber);
CREATE INDEX IX_Member_LastName ON Member(LastName);

CREATE INDEX IX_AssociationMember_AssociationId ON AssociationMember(AssociationId);
CREATE INDEX IX_AssociationMember_MemberId ON AssociationMember(MemberId);

-- Insert sample data
INSERT INTO LegalForm (Name, ShortName, Description) VALUES 
('Eingetragener Verein', 'e.V.', 'Registered association under German law'),
('Gemeinnütziger Verein', 'gGmbH', 'Non-profit organization'),
('Stiftung', 'Stiftung', 'Foundation');

INSERT INTO Address (Street, HouseNumber, PostalCode, City, Country, AddressType) VALUES 
('Musterstraße', '123', '12345', 'Berlin', 'Deutschland', 'Main'),
('Beispielweg', '456', '54321', 'München', 'Deutschland', 'Main');

INSERT INTO BankAccount (BankName, IBAN, BIC, AccountHolder, AccountType) VALUES 
('Deutsche Bank', 'DE89370400440532013000', 'DEUTDEFF', 'Muster Verein e.V.', 'Main'),
('Sparkasse', 'DE89370400440532013001', 'SPKDEFF', 'Beispiel Verein e.V.', 'Main');
