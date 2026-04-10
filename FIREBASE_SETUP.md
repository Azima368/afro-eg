# دليل إعداد Firebase لموقع AFRO

## 📋 متطلبات ما قبل البدء

1. حساب Google (Gmail)
2. الوصول إلى [Firebase Console](https://console.firebase.google.com/)

---

## 🚀 الخطوة 1: إنشاء مشروع Firebase

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اضغط على **"Add project"** (إنشاء مشروع)
3. أدخل اسم المشروع: `afro-store` (أو أي اسم تفضله)
4. اضغط **"Continue"**
5. اختياري: يمكنك تفعيل Google Analytics (موصى به)
6. اضغط **"Create project"**
7. انتظر حتى يتم إنشاء المشروع، ثم اضغط **"Continue"**

---

## ⚙️ الخطوة 2: إضافة تطبيق الويب

1. في صفحة المشروع، اضغط على أيقونة **"</>"** (Web)
2. أدخل اسم التطبيق: `AFRO Store`
3. اختياري: فعّل **"Also set up Firebase Hosting"** إذا كنت تريد استضافة الموقع على Firebase
4. اضغط **"Register app"**

---

## 🔧 الخطوة 3: نسخ إعدادات Firebase

بعد تسجيل التطبيق، ستظهر لك كود التكوين (Firebase Configuration). انسخ القيم التالية:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "afro-store.firebaseapp.com",
  projectId: "afro-store",
  storageBucket: "afro-store.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### تحديث ملف `firebase-config.js`:

افتح ملف `firebase-config.js` في المشروع واستبدل القيم:

```javascript
const firebaseConfig = {
    apiKey: "ضع apiKey هنا",
    authDomain: "ضع authDomain هنا",
    projectId: "ضع projectId هنا",
    storageBucket: "ضع storageBucket هنا",
    messagingSenderId: "ضع messagingSenderId هنا",
    appId: "ضع appId هنا"
};
```

---

## 📦 الخطوة 4: تفعيل خدمات Firebase

### 1. تفعيل Firestore Database (قاعدة البيانات)

1. من القائمة الجانبية، اضغط على **"Firestore Database"**
2. اضغط **"Create database"**
3. اختر **"Start in production mode"** (الوضع الإنتاجي)
4. اختر موقع الخادم: **"europe-west"** (للشرق الأوسط) أو **"us-central"**
5. اضغط **"Enable"**

### 2. تفعيل Firebase Storage (للصور)

1. من القائمة الجانبية، اضغط على **"Storage"**
2. اضغط **"Get started"**
3. اختر **"Start in production mode"**
4. اختر نفس موقع الخادم الذي اخترته لـ Firestore
5. اضغط **"Done"**

### 3. تفعيل Firebase Authentication (لتسجيل دخول الأدمن)

1. من القائمة الجانبية، اضغط على **"Authentication"**
2. اضغط **"Get started"**
3. اختر **"Email/Password"** وفعّله
4. اضغط **"Save"**

---

## 🔐 الخطوة 5: إنشاء حساب المسؤول (Admin)

1. في Firebase Console، اذهب إلى **Authentication** > **Users**
2. اضغط **"Add user"**
3. أدخل البريد الإلكتروني: `admin@afro.com` (أو أي بريد تفضله)
4. أدخل كلمة المرور: `Admin123!` (أو كلمة مرور قوية)
5. اضغط **"Add user"**

### تحديث بيانات الدخول في `admin.js`:

افتح ملف `admin.js` وابحث عن:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};
```

استبدلها ببيانات Firebase Auth (سنستخدم Firebase Auth بدلاً من التحقق المحلي).

---

## 📜 الخطوة 6: إعداد قواعد الأمان (Security Rules)

### Firestore Rules:

1. اذهب إلى **Firestore Database** > **Rules**
2. استبدل القواعد بـ:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to everyone
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /orders/{document} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

3. اضغط **"Publish"**

### Storage Rules:

1. اذهب إلى **Storage** > **Rules**
2. استبدل القواعد بـ:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. اضغط **"Publish"**

---

## 🧪 الخطوة 7: اختبار الاتصال

1. افتح الموقع على المتصفح
2. افتح Console (F12 > Console)
3. يجب أن ترى رسالة: `✅ Firebase initialized successfully`
4. اذهب إلى لوحة الإدارة (`admin.html`)
5. جرب إضافة قسم أو منتج
6. تحقق من Firestore Database في Firebase Console - يجب أن ترى البيانات قد حُفظت!

---

## 🔄 الخطوة 8: نقل البيانات الموجودة (اختياري)

إذا كان لديك بيانات في localStorage وتريد نقلها إلى Firebase:

1. افتح الموقع في المتصفح
2. افتح Console (F12)
3. اكتب:
```javascript
migrateDataToFirebase()
```
4. اضغط Enter
5. انتظر حتى تظهر رسالة: "تم نقل البيانات إلى Firebase بنجاح!"

---

## 🌐 الخطوة 9: رفع الموقع على الاستضافة (اختياري)

### Firebase Hosting:

1. ثبّت Firebase CLI:
```bash
npm install -g firebase-tools
```

2. سجّل الدخول:
```bash
firebase login
```

3. في مجلد المشروع، اكتب:
```bash
firebase init
```

4. اختر **"Hosting"** (استخدم مفتاح المسافة للاختيار)
5. اختر مشروع AFRO
6. أدخل `public` كمجلد الاستضافة (أو `.` إذا كان الملفات في الجذر)
7. اكتب `y` للـ SPA (Single Page Application)

8. انشر الموقع:
```bash
firebase deploy
```

9. سيظهر رابط الموقع (مثل: `https://afro-store.web.app`)

---

## 🎯 ملخص الملفات التي تم إنشاؤها/تعديلها

| الملف | الوصف |
|-------|-------|
| `firebase-config.js` | إعدادات Firebase - يجب تحديثه بقيم مشروعك |
| `firebase-service.js` | دوال Firebase لإدارة البيانات |
| `index.html` | تمت إضافة Firebase SDK |
| `admin.html` | تمت إضافة Firebase SDK |
| `cart.html` | تمت إضافة Firebase SDK |
| `products.html` | تمت إضافة Firebase SDK |
| `product.html` | تمت إضافة Firebase SDK |

---

## ⚠️ ملاحظات مهمة

1. **لا تشارك `apiKey`** مع أي شخص (على GitHub مثلاً)
2. **احفظ نسخة احتياطية** من البيانات المحلية قبل النقل
3. **اختبر** جميع الوظائف بعد الربط (إضافة، تعديل، حذف)
4. **راقب** Firebase Console > Usage للتأكد من عدم تجاوز الحد المجاني

---

## 📊 خطة Firebase المجانية (Spark Plan)

| الخدمة | الحد المجاني |
|--------|-------------|
| Firestore | 1 GB storage, 50K reads/day, 20K writes/day |
| Storage | 5 GB storage, 1 GB download/month |
| Authentication | 10K users/month |
| Hosting | 1 GB storage, 10 GB transfer/month |

**هذه الحدود كافية جداً لموقع تجاري صغير أو متوسط!**

---

## 🆘 الدعم والمساعدة

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)

---

**تم إعداد Firebase بنجاح! 🎉**
