# COMPLETE_DEMO_DATA.sql - Rehberi

## 📋 Genel Bilgi

**COMPLETE_DEMO_DATA.sql** dosyası, VEREIN veritabanının **TÜM tablolarına** kapsamlı demo verilerini ekler.

- **Dosya Boyutu:** 1206 satır
- **Eklenen Veri:** ~70 kayıt
- **Çalıştırma Süresi:** ~5-10 saniye

---

## 🎯 Dosya İçeriği

### 1. **Keytable Verileri** (14 tablo)
Geschlecht, MitgliedStatus, MitgliedTyp, FamilienbeziehungTyp, MitgliedFamilieStatus, ZahlungStatus, ZahlungTyp, Waehrung, Staatsangehoerigkeit, BeitragPeriode, BeitragZahlungstagTyp, Rechtsform, AdresseTyp, Kontotyp

### 2. **Verein Verileri** (7 dernek)
- **2 Aktif:** TDKV München, DTF Berlin
- **5 Pasif:** TDSV Hamburg, AKD Frankfurt, KTGB Köln, SAKSD Stuttgart, DTTD Düsseldorf

### 3. **Mitglied Verileri** (15 üye)
- **12 Temel Üye** (7 München, 5 Berlin)
- **3 Aile Üyesi** (Mehmet, Ali, Elif)

### 4. **Veranstaltung Verileri** (11 etkinlik)
5 München, 6 Berlin

### 5. **MitgliedFamilie Verileri** (8 ilişki)
Fatma ↔ Mehmet, Ali/Elif → Fatma/Mehmet, Ali ↔ Elif

### 6. **Finanz Verileri**
- 2 Banka Hesabı
- 9 Banka Hareketi
- 6 Üye Alacağı
- 3 Üye Ödemesi
- 2 Ödeme-Alacak Eşleştirmesi
- 1 Ön Ödeme
- 4 Etkinlik Ödemesi

---

## 🚀 Çalıştırma Adımları

### 1. **Veritabanını Yedekle**
```sql
BACKUP DATABASE [VEREIN] 
TO DISK = 'C:\Backups\VEREIN_Backup_2025-11-02.bak'
```

### 2. **COMPLETE_DEMO_DATA.sql Dosyasını Çalıştır**
SSMS → Dosyayı Aç → F5 Tuşu

### 3. **Kontrol Sorgusunun Çıktısını Doğrula**
```
✓ 7 Dernek (2 aktif + 5 pasif)
✓ 15 Üye (12 temel + 3 aile)
✓ 11 Etkinlik
✓ 8 Aile ilişkisi
✓ 2 Banka hesabı
✓ 9 Banka hareketi
✓ 6 Üye alacağı
✓ 3 Üye ödemesi
✓ 2 Ödeme-Alacak eşleştirmesi
✓ 1 Ön ödeme
✓ 4 Etkinlik ödemesi
```

---

## 👥 Demo Hesaplar

| Email | Rol | Dernek |
|-------|-----|--------|
| ahmet.yilmaz@email.com | Dernek Yöneticisi | München |
| fatma.ozkan@email.com | Üye | München |
| mehmet.demir@email.com | Dernek Yöneticisi | Berlin |

---

## 💰 Finanz Test Senaryoları

| Üye | Senaryo | Durum |
|-----|---------|-------|
| Ahmet Yılmaz | Ödeme yapılmış alacak | F-2025-001 |
| Fatma Özkan | Açık alacak + Ön ödeme | F-2025-002 |
| Can Schmidt | Vadesi geçmiş alacak | F-2025-003 |
| Mehmet Demir | Ödeme yapılmış alacak | F-2025-101 |

---

## ⚠️ Önemli Notlar

1. **Temizleme:** Eski demo verilerini temizlemek için `CLEAN_ALL_DATA.sql` dosyasını çalıştırın.

2. **Idempotency:** Dosya `IF NOT EXISTS` kontrolleri kullanır, birden fazla kez çalıştırılabilir.

3. **Foreign Key:** Tüm Foreign Key ilişkileri otomatik olarak oluşturulur.

4. **Tarihler:** Etkinlik tarihleri `GETDATE()` fonksiyonu kullanılarak dinamik olarak oluşturulur.

5. **Keytable Çeviriler:** Tüm Keytable verileri Almanca (de) ve Türkçe (tr) çevirilerle eklenir.

---

## 📊 Toplam Veri Özeti

| Kategori | Adet |
|----------|------|
| Dernekler | 7 |
| Üyeler | 15 |
| Etkinlikler | 11 |
| Aile İlişkileri | 8 |
| Banka Hesapları | 2 |
| Banka Hareketleri | 9 |
| Üye Alacakları | 6 |
| Üye Ödemeleri | 3 |
| Ödeme-Alacak Eşleştirmeleri | 2 |
| Ön Ödemeler | 1 |
| Etkinlik Ödemeleri | 4 |
| **TOPLAM** | **~70 Kayıt** |

---

## 🔄 Çalıştırma Sırası

1. ✅ `APPLICATION_H_101.sql` - Veritabanı şeması oluştur
2. ✅ `COMPLETE_DEMO_DATA.sql` - Demo verilerini ekle
3. ✅ Uygulamayı başlat ve test et
4. ✅ Gerekirse `CLEAN_ALL_DATA.sql` ile temizle

---

**Son Güncelleme:** 2025-11-02

