# 📊 Veritabanı Tabloları - Endpoint Analizi

**Tarih:** 2025-10-27  
**Toplam Tablo:** 47  
**Toplam Endpoint:** 131  
**Frontend Kullanım Oranı:** %98.5

---

## 📈 Özet İstatistikler

| Metrik | Değer |
|--------|-------|
| **Toplam Veritabanı Tablosu** | 47 |
| **Toplam Backend Endpoint** | 131 |
| **Toplam Frontend Endpoint** | 129 |
| **Kullanılmayan Endpoint** | 2 |
| **Toplam Controller** | 15 |
| **Keytable Tablosu** | 32 (16 main + 16 translation) |
| **Business Tablosu** | 15 |

---

## 🗂️ Tablo Kategorileri ve Endpoint Sayıları

### **1. KEYTABLE TABLOLARI (32 tane)**

#### **Main Keytables (16 tane)**
| # | Tablo | Endpoint | Nerede Kullanılıyor |
|---|-------|----------|-------------------|
| 1 | Geschlecht | 1 GET | KeytableController, MitgliedFormModal |
| 2 | MitgliedStatus | 1 GET | KeytableController, MitgliedFormModal |
| 3 | MitgliedTyp | 1 GET | KeytableController, MitgliedFormModal |
| 4 | Staatsangehoerigkeit | 1 GET | KeytableController, MitgliedFormModal |
| 5 | Waehrung | 1 GET | KeytableController, MitgliedFormModal, MitgliedZahlungFormModal, VeranstaltungFormModal |
| 6 | BeitragPeriode | 1 GET | KeytableController, MitgliedFormModal |
| 7 | BeitragZahlungstagTyp | 1 GET | KeytableController, MitgliedFormModal |
| 8 | ZahlungTyp | 1 GET | KeytableController, MitgliedZahlungFormModal |
| 9 | ZahlungStatus | 1 GET | KeytableController, MitgliedZahlungFormModal |
| 10 | Rechtsform | 1 GET | KeytableController, VereinFormModal |
| 11 | FamilienbeziehungTyp | 1 GET | KeytableController, MitgliedFamilieFormModal |
| 12 | MitgliedFamilieStatus | 1 GET | KeytableController, MitgliedFamilieFormModal |
| 13 | Kontotyp | 1 GET | KeytableController, BankkontoFormModal |
| 14 | AdresseTyp | 1 GET | KeytableController, AdresseFormModal |
| 15 | Forderungsart | 1 GET | KeytableController, MitgliedForderungFormModal |
| 16 | Forderungsstatus | 1 GET | KeytableController, MitgliedForderungFormModal |

**Keytable Endpoint Toplam:** 16 GET endpoint (KeytableController'da)

#### **Translation Keytables (16 tane)**
- GeschlechtUebersetzung
- MitgliedStatusUebersetzung
- MitgliedTypUebersetzung
- StaatsangehoerigkeitUebersetzung
- WaehrungUebersetzung
- BeitragPeriodeUebersetzung
- BeitragZahlungstagTypUebersetzung
- ZahlungTypUebersetzung
- ZahlungStatusUebersetzung
- RechtsformUebersetzung
- FamilienbeziehungTypUebersetzung
- MitgliedFamilieStatusUebersetzung
- KontotypUebersetzung
- AdresseTypUebersetzung
- ForderungsartUebersetzung
- ForderungsstatusUebersetzung

**Translation Endpoint:** 0 (Keytable endpoint'leriyle birlikte yüklenir)

---

### **2. BUSINESS TABLOLARI (15 tane)**

| # | Tablo | Controller | Endpoint Sayısı | Nerede Kullanılıyor |
|---|-------|-----------|-----------------|-------------------|
| 1 | Verein | VereineController | 7 | VereinList, VereinDetail, VereinFormModal |
| 2 | Adresse | AdressenController | 8 | AdresseList, AdresseFormModal |
| 3 | Bankkonto | BankkontenController | 9 | BankkontoList, BankkontoFormModal |
| 4 | BankBuchung | BankBuchungenController | 11 | BankBuchungList, BankBuchungFormModal |
| 5 | Mitglied | MitgliederController | 11 | MitgliedList, MitgliedDetail, MitgliedFormModal |
| 6 | MitgliedAdresse | MitgliedAdressenController | 9 | MitgliedDetail (Adressen tab) |
| 7 | MitgliedFamilie | MitgliedFamilienController | 11 | MitgliedDetail (Familie tab) |
| 8 | MitgliedForderung | MitgliedForderungenController | 11 | MitgliedDetail (Forderungen tab) |
| 9 | MitgliedZahlung | MitgliedZahlungenController | 11 | MitgliedDetail (Zahlungen tab) |
| 10 | Veranstaltung | VeranstaltungenController | 8 | VeranstaltungList, VeranstaltungDetail |
| 11 | VeranstaltungAnmeldung | VeranstaltungAnmeldungenController | 9 | VeranstaltungDetail (Anmeldungen tab) |
| 12 | VeranstaltungBild | VeranstaltungBilderController | 8 | VeranstaltungDetail (Bilder tab) |
| 13 | VeranstaltungZahlung | VeranstaltungZahlungenController | 11 | VeranstaltungDetail (Zahlungen tab) |
| 14 | MitgliedForderungZahlung | (Embedded) | 0 | MitgliedForderung ile birlikte |
| 15 | MitgliedVorauszahlung | (Embedded) | 0 | MitgliedZahlung ile birlikte |

**Business Endpoint Toplam:** 115 endpoint

---

### **3. SISTEM TABLOLARI (0 tane)**

| Tablo | Endpoint | Açıklama |
|-------|----------|----------|
| Auth | AuthController | 5 endpoint (Login, Register, Refresh, Logout, Profile) |
| Health | HealthController | 2 endpoint (Health, DetailedHealth) |

**Sistem Endpoint Toplam:** 7 endpoint

---

## 📊 Controller Bazında Endpoint Dağılımı

| # | Controller | Tablo | Endpoint | GET | POST | PUT | PATCH | DELETE |
|---|-----------|-------|----------|-----|------|-----|-------|--------|
| 1 | VereineController | Verein | 7 | 4 | 1 | 1 | 0 | 1 |
| 2 | AdressenController | Adresse | 8 | 3 | 1 | 1 | 1 | 1 |
| 3 | BankkontenController | Bankkonto | 9 | 3 | 2 | 1 | 1 | 1 |
| 4 | VeranstaltungenController | Veranstaltung | 8 | 5 | 1 | 1 | 0 | 1 |
| 5 | VeranstaltungAnmeldungenController | VeranstaltungAnmeldung | 9 | 5 | 1 | 1 | 1 | 1 |
| 6 | VeranstaltungBilderController | VeranstaltungBild | 8 | 3 | 2 | 1 | 1 | 1 |
| 7 | MitgliederController | Mitglied | 11 | 5 | 3 | 1 | 1 | 1 |
| 8 | MitgliedAdressenController | MitgliedAdresse | 9 | 3 | 1 | 1 | 1 | 1 |
| 9 | MitgliedFamilienController | MitgliedFamilie | 11 | 3 | 1 | 1 | 1 | 1 |
| 10 | MitgliedForderungenController | MitgliedForderung | 11 | 3 | 1 | 1 | 1 | 1 |
| 11 | MitgliedZahlungenController | MitgliedZahlung | 11 | 3 | 1 | 1 | 1 | 1 |
| 12 | VeranstaltungZahlungenController | VeranstaltungZahlung | 11 | 3 | 1 | 1 | 1 | 1 |
| 13 | BankBuchungenController | BankBuchung | 11 | 3 | 1 | 1 | 1 | 1 |
| 14 | KeytableController | Keytable (16) | 16 | 16 | 0 | 0 | 0 | 0 |
| 15 | AuthController | Auth | 5 | 1 | 2 | 0 | 0 | 1 |
| 16 | HealthController | Health | 2 | 2 | 0 | 0 | 0 | 0 |

**TOPLAM:** 131 endpoint (GET: 62, POST: 20, PUT: 13, PATCH: 9, DELETE: 13)

---

## 🎯 Frontend Kullanım Analizi

### **Kullanılan Endpoint'ler (129)**

| Service | Controller | Endpoint Sayısı | Kullanım Oranı |
|---------|-----------|-----------------|---------------|
| vereinService | VereineController | 7 | %100 |
| adresseService | AdressenController | 8 | %100 |
| bankkontoService | BankkontenController | 7 | %77.8 |
| bankBuchungService | BankBuchungenController | 11 | %100 |
| mitgliedService | MitgliederController | 11 | %100 |
| mitgliedAdresseService | MitgliedAdressenController | 9 | %100 |
| mitgliedFamilieService | MitgliedFamilienController | 11 | %100 |
| mitgliedForderungService | MitgliedForderungenController | 11 | %100 |
| mitgliedZahlungService | MitgliedZahlungenController | 11 | %100 |
| veranstaltungService | VeranstaltungenController | 8 | %100 |
| veranstaltungAnmeldungService | VeranstaltungAnmeldungenController | 9 | %100 |
| veranstaltungBildService | VeranstaltungBilderController | 8 | %100 |
| veranstaltungZahlungService | VeranstaltungZahlungenController | 11 | %100 |
| keytableService | KeytableController | 16 | %100 |
| authService | AuthController | 5 | %100 |
| healthService | HealthController | 2 | %100 |

### **Kullanılmayan Endpoint'ler (2)**

| Endpoint | Controller | Neden Kullanılmıyor |
|----------|-----------|-------------------|
| GET /api/Bankkonten/iban/{iban} | BankkontenController | IBAN'a göre arama yapılmıyor |
| POST /api/Bankkonten/validate-iban | BankkontenController | IBAN doğrulama frontend'de yapılıyor |

---

## 🔄 Veri Akışı Örneği

### **Mitglied (Üye) Oluşturma**

```
Frontend (MitgliedFormModal)
    ↓
mitgliedService.create()
    ↓
POST /api/Mitglieder/with-address
    ↓
MitgliederController.CreateWithAddress()
    ↓
MitgliedService.CreateWithAddressAsync()
    ↓
Veritabanı (Mitglied + MitgliedAdresse)
    ↓
Response: MitgliedDto
    ↓
Frontend: React Query Invalidate
    ↓
UI Güncelle
```

---

## 📝 Notlar

1. **Keytable Endpoint'leri:** Tüm keytable'lar KeytableController'da GET endpoint'leri olarak sunulur
2. **Translation Tabloları:** Keytable endpoint'leriyle birlikte yüklenir, ayrı endpoint yok
3. **Soft Delete:** Tüm DELETE işlemleri mantıksal silme (DeletedFlag) kullanır
4. **Audit Trail:** Tüm tablolarda Created, Modified, CreatedBy, ModifiedBy alanları var
5. **Authorization:** Tüm endpoint'ler JWT token tabanlı kimlik doğrulama gerektirir
6. **Caching:** Keytable'lar 24 saat cache TTL ile cache'lenir

