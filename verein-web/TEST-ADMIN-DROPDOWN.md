# Admin Dropdown Test Adımları

## Sorun
Admin kullanıcısı finans sayfasında Dernek dropdown'ını göremiyor.

## Test Adımları

### 1. LocalStorage Temizle
Tarayıcıda F12 → Console → Şu komutu çalıştır:
```javascript
localStorage.clear();
location.reload();
```

### 2. Yeniden Giriş Yap
- Email: `admin@test.com` (veya "admin" içeren herhangi bir email)
- Password: (boş bırakabilirsin)

### 3. Finanz Sayfasına Git
- `/finanzen/zahlungen` veya `/finanzen/bank-buchungen`

### 4. Console Kontrol
F12 → Console → Şu komutları çalıştır:
```javascript
// User objesini kontrol et
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('User Type:', user?.type);
console.log('Is Admin:', user?.type === 'admin');
```

### 5. Beklenen Sonuç
- `User Type: "admin"` olmalı
- `Is Admin: true` olmalı
- Dernek dropdown görünmeli

## Alternatif Test

Eğer hala görünmüyorsa, tarayıcı cache'ini temizle:
- Chrome: Ctrl+Shift+Delete → "Cached images and files" → Clear
- Sayfayı hard refresh: Ctrl+F5

## Kod Kontrolü

Dropdown kodu (MitgliedZahlungList.tsx satır 214-228):
```tsx
{user?.type === 'admin' && (
  <select
    value={selectedVereinId || ''}
    onChange={(e) => setSelectedVereinId(e.target.value ? Number(e.target.value) : null)}
    className="filter-select"
  >
    <option value="">{t('finanz:filter.allVereine')}</option>
    {vereine.map((v) => (
      <option key={v.id} value={v.id}>
        {v.name}
      </option>
    ))}
  </select>
)}
```

## Olası Sorunlar

1. **User type yanlış**: Backend'den `"Admin"` (büyük A) geliyor olabilir
2. **LocalStorage eski**: Eski user objesi cache'de kalmış olabilir
3. **React Query disabled**: `enabled: user?.type === 'admin'` çalışmıyor olabilir
4. **CSS gizliyor**: Dropdown render ediliyor ama CSS ile gizlenmiş olabilir

## Debug

Console'da şunu çalıştır:
```javascript
// Dropdown var mı kontrol et
document.querySelectorAll('.filter-select').length
// Kaç tane filter-select var? Admin için 3 olmalı (Verein, Year, Month)
```

