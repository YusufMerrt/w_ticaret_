

# H&G Butik

## Product Requirements Document (PRD)

## 1. Product Overview

H&G Butik, kadın tesettür giyim ürünlerinin çevrimiçi satılabileceği modern ve mobil uyumlu bir e-ticaret web sitesidir.

Platform kullanıcıların:

* ürünleri incelemesini
* beden seçmesini
* favorilere eklemesini
* yorum yapmasını
* sipariş vermesini

sağlayacaktır.

Site aynı zamanda bir **admin paneli** içerecek ve mağaza sahibi:

* ürün ekleyebilecek
* stok yönetebilecek
* siparişleri görüntüleyebilecek
* kampanya ve indirim oluşturabilecektir.

Ödeme sistemi **iyzico kredi kartı ödeme altyapısı** ile çalışacaktır.

---

# 2. Goals & Objectives

### Business Goals

* H&G Butik ürünlerini online satışa açmak
* müşterilerin kolay sipariş verebilmesini sağlamak
* stok takibini otomatik hale getirmek
* sipariş ve müşteri verisini yönetmek

### User Goals

Kullanıcılar:

* ürünleri kolayca keşfetmek
* beden seçip sipariş vermek
* favori ürünleri kaydetmek
* siparişlerini takip etmek

---

# 3. Target Users

### Primary Users

* tesettür giyim müşterileri
* Instagram butik müşterileri
* mobil cihazdan alışveriş yapan kullanıcılar

### Admin Users

* mağaza sahibi
* butik çalışanları

---

# 4. Core Pages

## 4.1 Home Page

Ana sayfa kullanıcıya ürünleri keşfetme imkanı sunar.

### İçerik

* üst navigasyon
* arama barı
* kategori listesi
* ürün grid listesi
* scroll oldukça yeni ürünlerin yüklenmesi

### Ürün kartı

Her ürün kartında:

* ürün fotoğrafı
* ürün adı
* fiyat
* indirim varsa indirim etiketi
* favorilere ekleme butonu

---

## 4.2 Product Detail Page

Bir ürün tıklandığında ürün detay sayfası açılır.

### İçerik

* ürün fotoğraf galerisi
* büyük görsel görüntüleme
* fotoğraf slider
* ürün adı
* fiyat
* açıklama
* beden seçenekleri
* stok durumu

### Fotoğraf sistemi

* birden fazla fotoğraf
* tıklanınca büyütme
* kullanıcı galeride gezebilir

### Alt bölüm

* benzer ürün önerileri

---

## 4.3 Product Search

Kullanıcılar ürün arayabilir.

Arama:

* ürün adı
* kategori
* açıklama

---

## 4.4 Product Filters

Filtreleme özellikleri:

* fiyat aralığı
* beden
* kategori

---

## 4.5 Favorites

Kullanıcılar ürünleri favorilere ekleyebilir.

Favoriler:

* kullanıcı hesabına bağlı olur
* giriş yapılmamışsa local storage kullanılabilir

---

## 4.6 Reviews

Kullanıcılar ürünlere yorum yapabilir.

Yorum sistemi:

* yıldız puanı
* yorum metni
* kullanıcı adı
* tarih

---

## 4.7 Checkout

Kullanıcı satın alma sırasında şu bilgileri girer:

* ad soyad
* telefon
* adres
* şehir
* posta kodu

Üyelik zorunlu değildir.

---

## 4.8 Payment

Ödeme sistemi:

* iyzico kredi kartı ödeme

Sipariş başarılı olursa:

* sipariş oluşturulur
* stok düşülür

---

## 4.9 Order Tracking

Kullanıcı sipariş durumunu görebilir.

Sipariş durumları:

* Sipariş alındı
* Hazırlanıyor
* Kargoya verildi
* Tamamlandı

---

# 5. Admin Panel

Admin panel sadece yetkili kullanıcılar için erişilebilir olacaktır.

---

# 5.1 Product Management

Admin:

* ürün ekleyebilir
* ürün düzenleyebilir
* ürün silebilir

### Ürün bilgileri

* ürün adı
* açıklama
* fiyat
* indirimli fiyat
* kategori
* fotoğraflar
* beden seçenekleri
* stok miktarı

### Stok örneği

S = 5
M = 5
L = 2

Satış oldukça stok otomatik düşer.

---

# 5.2 Order Management

Admin:

* siparişleri görüntüleyebilir
* sipariş durumunu değiştirebilir
* müşteri bilgilerini görebilir

Sipariş detayında:

* ürünler
* beden
* fiyat
* müşteri adresi
* telefon

---

# 5.3 Stock Management

Admin stokları:

* artırabilir
* azaltabilir
* düzenleyebilir

---

# 5.4 Campaign & Discounts

Admin:

* ürünlere indirim ekleyebilir
* kampanya tanımlayabilir

---

# 5.5 Banner Management

Admin ana sayfa bannerlarını değiştirebilir.

---

# 6. Database Structure (Supabase)

### Users

```
id
name
email
phone
address
created_at
```

---

### Products

```
id
name
description
price
discount_price
category_id
created_at
```

---

### ProductImages

```
id
product_id
image_url
```

---

### ProductSizes

```
id
product_id
size
stock
```

---

### Orders

```
id
user_id
total_price
status
created_at
```

---

### OrderItems

```
id
order_id
product_id
size
quantity
price
```

---

### Favorites

```
id
user_id
product_id
```

---

### Reviews

```
id
product_id
user_name
rating
comment
created_at
```

---

# 7. Technical Architecture

### Frontend

* React
* Responsive Design
* SEO optimized

### Backend

* Node.js API
* authentication
* order management
* payment integration

### Database

Supabase

* PostgreSQL
* authentication
* storage (product images)

---

# 8. Security

* admin authentication
* secure payment (iyzico)
* rate limiting
* input validation

---

# 9. Future Improvements

İlk versiyondan sonra eklenebilecek özellikler:

* kargo entegrasyonu
* WhatsApp sipariş desteği
* kupon sistemi
* AI ürün önerileri
* Instagram entegrasyonu
* çoklu dil

---

# 10. MVP Scope

İlk versiyon için gerekli özellikler:

* ürün listeleme
* ürün detay sayfası
* beden seçimi
* sipariş oluşturma
* iyzico ödeme
* admin paneli
* stok yönetimi

---

