"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'fr' | 'de' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, defaultText?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header & Navigation
    'header.home': 'Home',
    'header.destinations': 'Destinations',
    'header.hotels': 'Hotels',
    'header.tours': 'Tours',
    'header.about': 'About',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    'header.login': 'Login',
    'header.signup': 'Sign Up',
    'header.myWishlist': 'My Wishlist',
    'header.myReservations': 'My Reservations',

    // Hero Section
    'hero.badge': 'Introducing the Future of Web Travel',
    'hero.title1': 'Explore the world,',
    'hero.title2': 'on your terms',
    'hero.description': 'AI-powered recommendations that respect your privacy. Build itineraries offline. Experience travel like never before.',
    'hero.button1': 'Start Exploring',
    'hero.button2': 'Learn More',
    'hero.badge1': 'Privacy First',
    'hero.badge2': 'Destinations',
    'hero.badge3': 'Always Ready',

    // Journey Section
    'journey.sectionTag': 'Start Your Journey',
    'journey.title': 'Explore the World Your Way',
    'journey.description': 'Select a category to begin exploring our curated collection of experiences.',
    'journey.topRated': 'Top Rated',
    'journey.destinations': 'Destinations',
    'journey.destinationsDesc': 'Explore ancient ruins, vibrant cities, and untouched landscapes across the globe.',
    'journey.startExploring': 'Start Exploring',
    'journey.luxury': 'Luxury',
    'journey.stays': 'Stays',
    'journey.viewCollection': 'View Collection',
    'journey.experiences': 'Experiences',
    'journey.experiencesDesc': 'Curated local tours and activities.',
    'journey.discoverMore': 'Discover More',

    // Features
    'features.title': 'Why Portail Touristique?',
    'features.description': 'Built for the future with the latest web standards, privacy-respecting architecture, and delightful user experiences.',
    'features.privacy': 'Privacy-First Design',
    'features.privacyDesc': 'On-device processing. No tracking. Your data stays yours.',
    'features.offline': 'Offline-First',
    'features.offlineDesc': 'Build itineraries, explore destinations offline. Sync when ready.',
    'features.ai': 'AI-Powered',
    'features.aiDesc': 'Intelligent recommendations that learn your preferences.',
    'features.multilang': 'Multi-Language',
    'features.multilangDesc': 'Support for English, French, and Arabic with RTL support.',
    'features.cta': 'Ready to experience the future of travel?',
    'features.ctaDesc': 'Start exploring destinations with AI-powered recommendations, all while maintaining your privacy.',
    'features.getStarted': 'Get Started',

    // Testimonials
    'testimonials.title': 'What Travelers Say',
    'testimonials.description': 'Join thousands of satisfied explorers who have found their perfect journey with us.',
    'testimonials.sarah': 'The personalized itinerary feature saved me hours of planning. Discovered hidden gems I would have never found otherwise!',
    'testimonials.michael': 'Seamless booking experience and the \'Local Food\' suggestions were spot on. A truly premium service.',
    'testimonials.emma': 'Traveled with kids and the safety insights gave us such peace of mind. Highly recommend for families.',

    // Booking
    'search.hotels': 'Search Hotels',
    'search.tours': 'Search Tours',
    'book.checkIn': 'Check-in',
    'book.checkOut': 'Check-out',
    'book.guests': 'Guests',
    'book.tourDate': 'Tour Date',
    'book.participants': 'Participants',
    'book.search': 'Search',
    'book.price': 'Price',
    'book.perNight': 'Per Night',
    'book.duration': 'Duration',
    'book.days': 'Days',
    'book.guides': 'Guides',
    'book.amenities': 'Amenities',
    'book.addToWishlist': 'Add to Wishlist',
    'book.removeFromWishlist': 'Remove from Wishlist',
    'book.bookNow': 'Book Now',
    'book.selectHotel': 'Select Hotel',
    'book.selectTour': 'Select Tour',
    'book.confirm': 'Confirm Booking',
    'book.confirming': 'Confirming...',
    'book.noHotels': 'No hotels available',
    'book.noTours': 'No tours available',
    'book.viewDetails': 'View Details',

    // Wishlist
    'wishlist.title': 'My Wishlist',
    'wishlist.savedItems': 'saved items',
    'wishlist.empty': 'Your Wishlist is Empty',
    'wishlist.emptyDesc': 'Start adding your favorite destinations, hotels, and tours.',
    'wishlist.noItems': 'No Items in Wishlist',
    'wishlist.noItemsDesc': 'Explore and add items to your wishlist to get started.',
    'wishlist.explore': 'Start Exploring',

    // Reservations
    'reservations.title': 'My Reservations',
    'reservations.loading': 'Loading your reservations...',
    'reservations.empty': 'No Reservations Yet',
    'reservations.emptyDesc': 'Book your first experience and manage all your reservations here.',
    'reservations.cancelled': 'Reservation Cancelled',
    'reservations.cancelledDesc': 'Your reservation has been cancelled successfully.',
    'reservations.cancel': 'Cancel Reservation',
    'reservations.view': 'View Details',

    // Pages
    'pages.destinationsTag': 'Global Discovery',
    'pages.destinationsTitle': 'World Class',
    'pages.destinationsDesc': 'From ancient wonders to modern marvels, explore the most breathtaking locations our planet has to offer.',
    'pages.hotelsTag': 'Luxury Collection',
    'pages.hotelsTitle': 'Discover Your',
    'pages.hotelsDesc': 'From boutique hideaways to 5-star resorts, we\'ve curated the most exceptional accommodations for your journey.',

    // Footer
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.contact': 'Contact',
    'footer.followUs': 'Follow Us',

    // Messages
    'message.loading': 'Loading...',
    'message.error': 'Error',
    'message.success': 'Success',
    'message.removed': 'Removed',
  },
  fr: {
    // Header & Navigation
    'header.home': 'Accueil',
    'header.destinations': 'Destinations',
    'header.hotels': 'Hôtels',
    'header.tours': 'Tours',
    'header.about': 'À Propos',
    'header.profile': 'Profil',
    'header.logout': 'Déconnexion',
    'header.login': 'Connexion',
    'header.signup': 'S\'inscrire',
    'header.myWishlist': 'Ma Liste de Souhaits',
    'header.myReservations': 'Mes Réservations',

    // Hero Section
    'hero.badge': 'Découvrez l\'Avenir du Voyage en Ligne',
    'hero.title1': 'Explorez le monde,',
    'hero.title2': 'à votre manière',
    'hero.description': 'Recommandations propulsées par l\'IA qui respectent votre vie privée. Construisez des itinéraires hors ligne. Expérimentez les voyages comme jamais auparavant.',
    'hero.button1': 'Commencer l\'Exploration',
    'hero.button2': 'En Savoir Plus',
    'hero.badge1': 'Vie Privée D\'Abord',
    'hero.badge2': 'Destinations',
    'hero.badge3': 'Toujours Prêt',

    // Journey Section
    'journey.sectionTag': 'Commencez Votre Voyage',
    'journey.title': 'Explorez le Monde À Votre Manière',
    'journey.description': 'Sélectionnez une catégorie pour commencer à explorer notre collection d\'expériences organisées.',
    'journey.topRated': 'Top Notés',
    'journey.destinations': 'Destinations',
    'journey.destinationsDesc': 'Explorez des ruines anciennes, des villes dynamiques et des paysages intacts à travers le monde.',
    'journey.startExploring': 'Commencer l\'Exploration',
    'journey.luxury': 'Luxe',
    'journey.stays': 'Séjours',
    'journey.viewCollection': 'Voir la Collection',
    'journey.experiences': 'Expériences',
    'journey.experiencesDesc': 'Tours et activités locales organisées.',
    'journey.discoverMore': 'Découvrir Plus',

    // Features
    'features.title': 'Pourquoi Portail Touristique?',
    'features.description': 'Construit pour l\'avenir avec les dernières normes web, une architecture respectueuse de la vie privée et des expériences utilisateur délicieuses.',
    'features.privacy': 'Conception Axée sur la Confidentialité',
    'features.privacyDesc': 'Traitement sur l\'appareil. Pas de suivi. Vos données vous appartiennent.',
    'features.offline': 'Hors Ligne D\'Abord',
    'features.offlineDesc': 'Construisez des itinéraires, explorez les destinations hors ligne. Synchronisez quand vous êtes prêt.',
    'features.ai': 'Propulsé par l\'IA',
    'features.aiDesc': 'Recommandations intelligentes qui apprennent vos préférences.',
    'features.multilang': 'Multi-Langues',
    'features.multilangDesc': 'Support pour l\'anglais, le français et l\'arabe avec support RTL.',
    'features.cta': 'Prêt à expérimenter l\'avenir du voyage?',
    'features.ctaDesc': 'Commencez à explorer les destinations avec des recommandations propulsées par l\'IA, tout en maintenant votre vie privée.',
    'features.getStarted': 'Commencer',

    // Testimonials
    'testimonials.title': 'Ce que Disent les Voyageurs',
    'testimonials.description': 'Rejoignez des milliers d\'explorateurs satisfaits qui ont trouvé leur voyage parfait avec nous.',
    'testimonials.sarah': 'La fonction d\'itinéraire personnalisé m\'a fait économiser des heures de planification. J\'ai découvert des trésors cachés que je n\'aurais jamais trouvés autrement!',
    'testimonials.michael': 'Une expérience de réservation transparente et les suggestions de \'Nourriture Locale\' étaient parfaites. Un véritable service premium.',
    'testimonials.emma': 'J\'ai voyagé avec des enfants et les aperçus de sécurité m\'ont donné tellement de tranquillité d\'esprit. Hautement recommandé pour les familles.',

    // Booking
    'search.hotels': 'Rechercher des Hôtels',
    'search.tours': 'Rechercher des Tours',
    'book.checkIn': 'Arrivée',
    'book.checkOut': 'Départ',
    'book.guests': 'Invités',
    'book.tourDate': 'Date du Tour',
    'book.participants': 'Participants',
    'book.search': 'Rechercher',
    'book.price': 'Prix',
    'book.perNight': 'Par Nuit',
    'book.duration': 'Durée',
    'book.days': 'Jours',
    'book.guides': 'Guides',
    'book.amenities': 'Équipements',
    'book.addToWishlist': 'Ajouter à la Liste de Souhaits',
    'book.removeFromWishlist': 'Retirer de la Liste de Souhaits',
    'book.bookNow': 'Réserver Maintenant',
    'book.selectHotel': 'Sélectionner un Hôtel',
    'book.selectTour': 'Sélectionner un Tour',
    'book.confirm': 'Confirmer la Réservation',
    'book.confirming': 'Confirmation...',
    'book.noHotels': 'Aucun hôtel disponible',
    'book.noTours': 'Aucun tour disponible',
    'book.viewDetails': 'Voir Détails',

    // Wishlist
    'wishlist.title': 'Ma Liste de Souhaits',
    'wishlist.savedItems': 'articles enregistrés',
    'wishlist.empty': 'Votre Liste de Souhaits Est Vide',
    'wishlist.emptyDesc': 'Commencez à ajouter vos destinations, hôtels et tours préférés.',
    'wishlist.noItems': 'Aucun Article dans la Liste de Souhaits',
    'wishlist.noItemsDesc': 'Explorez et ajoutez des articles à votre liste de souhaits pour commencer.',
    'wishlist.explore': 'Commencer l\'Exploration',

    // Reservations
    'reservations.title': 'Mes Réservations',
    'reservations.loading': 'Chargement de vos réservations...',
    'reservations.empty': 'Aucune Réservation Encore',
    'reservations.emptyDesc': 'Réservez votre première expérience et gérez toutes vos réservations ici.',
    'reservations.cancelled': 'Réservation Annulée',
    'reservations.cancelledDesc': 'Votre réservation a été annulée avec succès.',
    'reservations.cancel': 'Annuler la Réservation',
    'reservations.view': 'Voir Détails',

    // Pages
    'pages.destinationsTag': 'Découverte Mondiale',
    'pages.destinationsTitle': 'Destinations de Classe Mondiale',
    'pages.destinationsDesc': 'Des merveilles anciennes aux marvels modernes, explorez les emplacements les plus époustouflants que notre planète ait à offrir.',
    'pages.hotelsTag': 'Collection Luxe',
    'pages.hotelsTitle': 'Découvrez Votre',
    'pages.hotelsDesc': 'Des hideaways boutique aux resorts 5 étoiles, nous avons curated les accommodations les plus exceptionnelles pour votre voyage.',

    // Footer
    'footer.company': 'Entreprise',
    'footer.about': 'À Propos de Nous',
    'footer.contact': 'Contact',
    'footer.followUs': 'Nous Suivre',

    // Messages
    'message.loading': 'Chargement...',
    'message.error': 'Erreur',
    'message.success': 'Succès',
    'message.removed': 'Supprimé',
  },
  de: {
    // Header & Navigation
    'header.home': 'Startseite',
    'header.destinations': 'Ziele',
    'header.hotels': 'Hotels',
    'header.tours': 'Touren',
    'header.about': 'Über Uns',
    'header.profile': 'Profil',
    'header.logout': 'Abmelden',
    'header.login': 'Anmelden',
    'header.signup': 'Registrieren',
    'header.myWishlist': 'Meine Wunschliste',
    'header.myReservations': 'Meine Reservierungen',

    // Hero Section
    'hero.badge': 'Einführung in die Zukunft des Web-Reisens',
    'hero.title1': 'Erkunden Sie die Welt,',
    'hero.title2': 'nach Ihren Bedingungen',
    'hero.description': 'KI-gestützte Empfehlungen, die Ihre Privatsphäre respektieren. Erstellen Sie Reiserouten offline. Erleben Sie Reisen wie nie zuvor.',
    'hero.button1': 'Erkundung Starten',
    'hero.button2': 'Mehr Erfahren',
    'hero.badge1': 'Datenschutz Zuerst',
    'hero.badge2': 'Ziele',
    'hero.badge3': 'Immer Bereit',

    // Journey Section
    'journey.sectionTag': 'Starten Sie Ihre Reise',
    'journey.title': 'Erkunden Sie die Welt Auf Ihre Weise',
    'journey.description': 'Wählen Sie eine Kategorie, um mit der Erkundung unserer kuratierten Sammlung von Erfahrungen zu beginnen.',
    'journey.topRated': 'Top Bewertet',
    'journey.destinations': 'Ziele',
    'journey.destinationsDesc': 'Erkunden Sie antike Ruinen, lebendige Städte und unberührte Landschaften auf der ganzen Welt.',
    'journey.startExploring': 'Erkundung Starten',
    'journey.luxury': 'Luxus',
    'journey.stays': 'Aufenthalte',
    'journey.viewCollection': 'Sammlung Anzeigen',
    'journey.experiences': 'Erfahrungen',
    'journey.experiencesDesc': 'Kuratierte Touren und Aktivitäten vor Ort.',
    'journey.discoverMore': 'Mehr Entdecken',

    // Features
    'features.title': 'Warum Portail Touristique?',
    'features.description': 'Gebaut für die Zukunft mit den neuesten Web-Standards, datenschutzfreundlicher Architektur und erfreulichen Benutzererfahrungen.',
    'features.privacy': 'Datenschutzorientiertes Design',
    'features.privacyDesc': 'Gerätebasierte Verarbeitung. Kein Tracking. Ihre Daten gehören Ihnen.',
    'features.offline': 'Offline-First',
    'features.offlineDesc': 'Erstellen Sie Reiserouten, erkunden Sie Ziele offline. Synchronisieren Sie wenn bereit.',
    'features.ai': 'KI-gestützt',
    'features.aiDesc': 'Intelligente Empfehlungen, die Ihre Vorlieben lernen.',
    'features.multilang': 'Mehrsprachig',
    'features.multilangDesc': 'Unterstützung für Englisch, Französisch und Arabisch mit RTL-Unterstützung.',
    'features.cta': 'Bereit, die Zukunft des Reisens zu erleben?',
    'features.ctaDesc': 'Beginnen Sie, Ziele mit KI-gestützten Empfehlungen zu erkunden und wahren Sie dabei Ihre Privatsphäre.',
    'features.getStarted': 'Erste Schritte',

    // Testimonials
    'testimonials.title': 'Was Reisende Sagen',
    'testimonials.description': 'Schließen Sie sich Tausenden zufriedener Entdecker an, die ihre perfekte Reise mit uns gefunden haben.',
    'testimonials.sarah': 'Die personalisierte Reiseroutenfunktion hat mir Stunden an Planung gespart. Entdeckte verborgene Schätze, die ich sonst nie gefunden hätte!',
    'testimonials.michael': 'Nahtlose Buchungserfahrung und die \'Lokale Lebensmittel\'-Vorschläge waren genau richtig. Ein wirklich Premium-Service.',
    'testimonials.emma': 'Ich bin mit Kindern gereist und die Sicherheitseinblicke gaben mir solche Sicherheit. Sehr empfehlenswert für Familien.',

    // Booking
    'search.hotels': 'Hotels Suchen',
    'search.tours': 'Touren Suchen',
    'book.checkIn': 'Ankunft',
    'book.checkOut': 'Abreise',
    'book.guests': 'Gäste',
    'book.tourDate': 'Tour-Datum',
    'book.participants': 'Teilnehmer',
    'book.search': 'Suchen',
    'book.price': 'Preis',
    'book.perNight': 'Pro Nacht',
    'book.duration': 'Dauer',
    'book.days': 'Tage',
    'book.guides': 'Reiseführer',
    'book.amenities': 'Ausstattungen',
    'book.addToWishlist': 'Zur Wunschliste Hinzufügen',
    'book.removeFromWishlist': 'Von Wunschliste Entfernen',
    'book.bookNow': 'Jetzt Buchen',
    'book.selectHotel': 'Hotel Auswählen',
    'book.selectTour': 'Tour Auswählen',
    'book.confirm': 'Buchung Bestätigen',
    'book.confirming': 'Bestätigung Läuft...',
    'book.noHotels': 'Keine Hotels Verfügbar',
    'book.noTours': 'Keine Touren Verfügbar',
    'book.viewDetails': 'Details Anzeigen',

    // Wishlist
    'wishlist.title': 'Meine Wunschliste',
    'wishlist.savedItems': 'gespeicherte Artikel',
    'wishlist.empty': 'Ihre Wunschliste Ist Leer',
    'wishlist.emptyDesc': 'Beginnen Sie, Ihre Lieblingsziele, Hotels und Touren hinzuzufügen.',
    'wishlist.noItems': 'Keine Artikel in der Wunschliste',
    'wishlist.noItemsDesc': 'Erkunden Sie und fügen Sie Artikel zu Ihrer Wunschliste hinzu, um zu beginnen.',
    'wishlist.explore': 'Erkundung Starten',

    // Reservations
    'reservations.title': 'Meine Reservierungen',
    'reservations.loading': 'Laden Ihrer Reservierungen...',
    'reservations.empty': 'Noch Keine Reservierungen',
    'reservations.emptyDesc': 'Buchen Sie Ihre erste Erfahrung und verwalten Sie alle Ihre Reservierungen hier.',
    'reservations.cancelled': 'Reservierung Storniert',
    'reservations.cancelledDesc': 'Ihre Reservierung wurde erfolgreich storniert.',
    'reservations.cancel': 'Reservierung Stornieren',
    'reservations.view': 'Details Anzeigen',

    // Pages
    'pages.destinationsTag': 'Globale Entdeckung',
    'pages.destinationsTitle': 'Weltklasse',
    'pages.destinationsDesc': 'Von alten Wundern bis zu modernen Marveln, erkunden Sie die atemberaubendsten Orte unseres Planeten.',
    'pages.hotelsTag': 'Luxus Kollektion',
    'pages.hotelsTitle': 'Entdecken Sie Ihr',
    'pages.hotelsDesc': 'Von Boutique-Hideaways bis zu 5-Sterne-Resorts haben wir die außergewöhnlichsten Unterkünfte für Ihre Reise zusammengestellt.',

    // Footer
    'footer.company': 'Unternehmen',
    'footer.about': 'Über Uns',
    'footer.contact': 'Kontakt',
    'footer.followUs': 'Folgen Sie Uns',

    // Messages
    'message.loading': 'Laden...',
    'message.error': 'Fehler',
    'message.success': 'Erfolg',
    'message.removed': 'Entfernt',
  },
  ar: {
    // Header & Navigation
    'header.home': 'الرئيسية',
    'header.destinations': 'الوجهات',
    'header.hotels': 'الفنادق',
    'header.tours': 'الجولات',
    'header.about': 'حول',
    'header.profile': 'الملف الشخصي',
    'header.logout': 'تسجيل الخروج',
    'header.login': 'تسجيل الدخول',
    'header.signup': 'إنشاء حساب',
    'header.myWishlist': 'قائمة رغباتي',
    'header.myReservations': 'حجوزاتي',

    // Hero Section
    'hero.badge': 'تقديم مستقبل السفر عبر الويب',
    'hero.title1': 'اكتشف العالم،',
    'hero.title2': 'بشروطك الخاصة',
    'hero.description': 'توصيات مدعومة بالذكاء الاصطناعي تحترم خصوصيتك. بناء خطط الرحلة في وضع عدم الاتصال. اختبر السفر بطريقة لم تشهدها من قبل.',
    'hero.button1': 'ابدأ الاستكشاف',
    'hero.button2': 'تعرف على المزيد',
    'hero.badge1': 'الخصوصية أولاً',
    'hero.badge2': 'الوجهات',
    'hero.badge3': 'جاهز دائمًا',

    // Journey Section
    'journey.sectionTag': 'ابدأ رحلتك',
    'journey.title': 'اكتشف العالم بطريقتك',
    'journey.description': 'اختر فئة لبدء استكشاف مجموعتنا المختارة من التجارب.',
    'journey.topRated': 'الأعلى تقييمًا',
    'journey.destinations': 'الوجهات',
    'journey.destinationsDesc': 'استكشف الآثار القديمة والمدن النابضة بالحياة والمناظر الطبيعية البكر في جميع أنحاء العالم.',
    'journey.startExploring': 'ابدأ الاستكشاف',
    'journey.luxury': 'فاخر',
    'journey.stays': 'الإقامة',
    'journey.viewCollection': 'عرض المجموعة',
    'journey.experiences': 'التجارب',
    'journey.experiencesDesc': 'جولات محلية وأنشطة مختارة.',
    'journey.discoverMore': 'اكتشف المزيد',

    // Features
    'features.title': 'لماذا بوابة السياحة؟',
    'features.description': 'مبني للمستقبل مع أحدث معايير الويب وعمارة احترام الخصوصية وتجارب المستخدم الممتعة.',
    'features.privacy': 'التصميم المركز على الخصوصية',
    'features.privacyDesc': 'معالجة على الجهاز. لا تتبع. بياناتك ملكك.',
    'features.offline': 'خاصية العمل بلا إنترنت',
    'features.offlineDesc': 'بناء خطط الرحلة واستكشف الوجهات بدون إنترنت. مزامنة عند الاستعداد.',
    'features.ai': 'مدعوم بالذكاء الاصطناعي',
    'features.aiDesc': 'توصيات ذكية تتعلم تفضيلاتك.',
    'features.multilang': 'متعدد اللغات',
    'features.multilangDesc': 'دعم اللغة الإنجليزية والفرنسية والعربية مع دعم RTL.',
    'features.cta': 'هل أنت مستعد لتجربة مستقبل السفر؟',
    'features.ctaDesc': 'ابدأ باستكشاف الوجهات مع توصيات مدعومة بالذكاء الاصطناعي، مع الحفاظ على خصوصيتك.',
    'features.getStarted': 'ابدأ الآن',

    // Testimonials
    'testimonials.title': 'ما يقوله المسافرون',
    'testimonials.description': 'انضم إلى آلاف المستكشفين الراضين الذين وجدوا رحلتهم المثالية معنا.',
    'testimonials.sarah': 'وفرت لي ميزة الرحلة الشخصية ساعات من التخطيط. اكتشفت كنوزًا مخفية لم أكن سأجدها بطريقة أخرى!',
    'testimonials.michael': 'تجربة حجز سلسة واقتراحات \'الطعام المحلي\' كانت دقيقة جدًا. خدمة حقيقية متميزة.',
    'testimonials.emma': 'سافرت مع الأطفال وأعطتني رؤى السلامة راحة بال كبيرة. موصى به بشدة للعائلات.',

    // Booking
    'search.hotels': 'البحث عن الفنادق',
    'search.tours': 'البحث عن الجولات',
    'book.checkIn': 'تسجيل الوصول',
    'book.checkOut': 'تسجيل المغادرة',
    'book.guests': 'الضيوف',
    'book.tourDate': 'تاريخ الجولة',
    'book.participants': 'المشاركون',
    'book.search': 'بحث',
    'book.price': 'السعر',
    'book.perNight': 'في الليلة',
    'book.duration': 'المدة',
    'book.days': 'أيام',
    'book.guides': 'الأدلاء',
    'book.amenities': 'المرافق',
    'book.addToWishlist': 'إضافة إلى قائمة الرغبات',
    'book.removeFromWishlist': 'إزالة من قائمة الرغبات',
    'book.bookNow': 'احجز الآن',
    'book.selectHotel': 'اختر فندقًا',
    'book.selectTour': 'اختر جولة',
    'book.confirm': 'تأكيد الحجز',
    'book.confirming': 'جاري التأكيد...',
    'book.noHotels': 'لا توجد فنادق متاحة',
    'book.noTours': 'لا توجد جولات متاحة',
    'book.viewDetails': 'عرض التفاصيل',

    // Wishlist
    'wishlist.title': 'قائمة رغباتي',
    'wishlist.savedItems': 'عناصر محفوظة',
    'wishlist.empty': 'قائمة رغباتك فارغة',
    'wishlist.emptyDesc': 'ابدأ بإضافة وجهاتك وفنادقك وجولاتك المفضلة.',
    'wishlist.noItems': 'لا توجد عناصر في قائمة الرغبات',
    'wishlist.noItemsDesc': 'اكتشف وأضف عناصر إلى قائمة رغباتك للبدء.',
    'wishlist.explore': 'ابدأ الاستكشاف',

    // Reservations
    'reservations.title': 'حجوزاتي',
    'reservations.loading': 'جاري تحميل حجوزاتك...',
    'reservations.empty': 'لا توجد حجوزات حتى الآن',
    'reservations.emptyDesc': 'احجز تجربتك الأولى وأدر جميع حجوزاتك هنا.',
    'reservations.cancelled': 'تم إلغاء الحجز',
    'reservations.cancelledDesc': 'تم إلغاء حجزك بنجاح.',
    'reservations.cancel': 'إلغاء الحجز',
    'reservations.view': 'عرض التفاصيل',

    // Pages
    'pages.destinationsTag': 'الاكتشاف العالمي',
    'pages.destinationsTitle': 'وجهات عالمية الطراز',
    'pages.destinationsDesc': 'من العجائب القديمة إلى الروائع الحديثة، استكشف أجمل المواقع التي تقدمها كوكبنا.',
    'pages.hotelsTag': 'مجموعة فاخرة',
    'pages.hotelsTitle': 'اكتشف إقامتك',
    'pages.hotelsDesc': 'من الفنادق البوتيكية إلى المنتجعات الفاخرة، لقد اخترنا أروع الأماكن الإقامة لرحلتك.',

    // Footer
    'footer.company': 'الشركة',
    'footer.about': 'من نحن',
    'footer.contact': 'اتصل بنا',
    'footer.followUs': 'تابعنا',

    // Messages
    'message.loading': 'جاري التحميل...',
    'message.error': 'خطأ',
    'message.success': 'نجح',
    'message.removed': 'تم الحذف',
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null
    if (saved && ['en', 'fr', 'de', 'ar'].includes(saved)) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  useEffect(() => {
    try {
      document.documentElement.lang = language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    } catch (e) {
      // ignore server-side or other environments
    }
  }, [language])

  const t = (key: string, defaultText: string = key): string => {
    return translations[language]?.[key] || defaultText
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
