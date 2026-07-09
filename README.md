# 🎲 Domino Pro - لعبة الدومينو الاحترافية

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.73.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**لعبة دومينو احترافية مبنية بـ React Native**

[المميزات](#-المميزات) • [التثبيت](#-التثبيت) • [التشغيل](#-التشغيل) • [المساهمة](#-المساهمة)

</div>

---

## 🌟 المميزات

### 🎮 تجربة لعب احترافية
- ✅ **محرك لعبة مستقل** - فصل كامل بين المنطق والرسم
- ✅ **ذكاء اصطناعي متقدم** - 3 مستويات صعوبة (Easy/Medium/Hard)
- ✅ **نظام Snake Layout** - ترتيب ديناميكي للقطع مثل اللعب الحقيقي
- ✅ **دعم 2-4 لاعبين** - مباراة محلية أو ضد AI

### 🎨 تصميم فاخر
- ✅ **قطع مرسومة بـ SVG** - جودة لا نهائية
- ✅ **4 ثيمات للقطع** - Classic, Wood, Marble, Black
- ✅ **خلفيات مولّدة برمجياً** - 5 ثيمات للطاولة
- ✅ **حركات سلسة** - Reanimated 3

### 🔊 نظام صوت متكامل
- ✅ **11+ مؤثر صوتي** - وضع، سحب، فوز، خسارة...
- ✅ **موسيقى خلفية** - مقطوعات متعددة
- ✅ **تحكم كامل** - Master, SFX, Music منفصل

### 🏆 نظام نتائج احترافي
- ✅ **شاشة نتائج متحركة** - Confetti + Animations
- ✅ **عداد نقاط متحرك** - Count-up animation
- ✅ **جدول ترتيب** - مع ميداليات ذهبية/فضية/برونزية

### 🎯 نظام سحب وإفلات متقدم
- ✅ **Drag & Drop** - سحب القطع بالإصبع
- ✅ **Drop Zones ذكية** - تحديد تلقائي للطرف المناسب
- ✅ **حركات احترافية** - Snap-back عند الخطأ

### ⚡ أداء محسّن
- ✅ **Object Pooling** - إعادة استخدام العناصر
- ✅ **60 FPS** - حركات سلسة على كل الأجهزة
- ✅ **Performance Monitor** - مراقبة الأداء

### 💾 نظام حفظ واستئناف
- ✅ **حفظ تلقائي** - كل 30 ثانية
- ✅ **حفظ يدوي** - بضغطة زر
- ✅ **استئناف اللعبة** - من حيث توقفت
- ✅ **Checksum** - حماية من تلف البيانات

### 📊 إحصائيات شاملة
- ✅ **25+ إحصائية** - تتبع كل إنجازاتك
- ✅ **نظام مستويات** - XP + Level progression
- ✅ **رتب وميداليات** - من مبتدئ إلى أسطورة
- ✅ **أرقام قياسية** - أسرع فوز، أفضل سلسلة...

---

## 📸 لقطات شاشة

<div align="center">
  <img src="screenshots/menu.png" width="250" alt="القائمة الرئيسية" />
  <img src="screenshots/game.png" width="250" alt="شاشة اللعب" />
  <img src="screenshots/result.png" width="250" alt="شاشة النتائج" />
</div>

---

## 🚀 التثبيت

### المتطلبات

- **Node.js** 18+ 
- **npm** أو **yarn**
- **Android Studio** (للـ Android)
- **Xcode** (للـ iOS - Mac فقط)

### الخطوات

```bash
# 1. استنساخ المستودع
git clone https://github.com/YOUR_USERNAME/domino-pro.git
cd domino-pro

# 2. تثبيت المكتبات
npm install

# 3. تثبيت المكتبات الإضافية
npx pod-install  # iOS فقط (Mac)

# 4. تشغيل التطبيق
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

---

## 🎮 التشغيل

### باستخدام Expo (الأسهل)

```bash
# تثبيت Expo CLI
npm install -g expo-cli

# تشغيل
npx expo start

# امسح QR code بتطبيق Expo Go على هاتفك
```

### باستخدام React Native CLI

```bash
# Android
npx react-native start
npx react-native run-android

# iOS
npx react-native start
npx react-native run-ios
```

---

## 🏗️ البنية التقنية