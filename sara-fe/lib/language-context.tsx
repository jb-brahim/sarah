"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

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

    // Recommendations Section
    'rec.aiTitle': 'AI-Powered Recommendations',
    'rec.popTitle': 'Popular Destinations',
    'rec.aiDesc': 'Personalized for your interests with privacy preserved',
    'rec.popDesc': 'Browse destinations around the world',
    'rec.aiBadge': 'AI-Assisted',

    // Site Header Additional
    'header.signIn': 'Sign In',
    'header.bookNow': 'Book Now',
    'header.itinerary': 'Itinerary',

    // Book Page
    'book.loading': 'Loading experiences...',
    'book.checkIn': 'Check-in',
    'book.checkOut': 'Check-out',
    'book.guests': 'Guests',
    'book.search': 'Search',
    'book.tourDate': 'Tour Date',
    'book.participants': 'Participants',
    'book.planYour': 'Plan Your',
    'book.perfectTrip': 'Perfect Trip',
    'book.subtitle': 'Book accommodations and tours for an unforgettable experience',

    // Tags
    'tags.History': 'History',
    'tags.Adventure': 'Adventure',
    'tags.Desert': 'Desert',
    'tags.Beach': 'Beach',
    'tags.Nature': 'Nature',
    'tags.Culture': 'Culture',
    'tags.Romance': 'Romance',
    'tags.Urban': 'Urban',
    'tags.Photography': 'Photography',
    'tags.Food': 'Food',
    'tags.Relaxation': 'Relaxation',
    'tags.Luxury': 'Luxury',
    'tags.Hiking': 'Hiking',
    'tags.Lifestyle': 'Lifestyle',
    'tags.Party': 'Party',
    'tags.Architecture': 'Architecture',

    // Destinations
    'dest.1.name': 'Santorini',
    'dest.1.region': 'Greece',
    'dest.1.desc': 'Stunning caldera views and ancient history awaits',
    'dest.2.name': 'Kyoto',
    'dest.2.region': 'Japan',
    'dest.2.desc': 'Temples, gardens, and traditional Japanese culture',
    'dest.3.name': 'Barcelona',
    'dest.3.region': 'Spain',
    'dest.3.desc': 'Gaudí architecture and vibrant Mediterranean life',
    'dest.4.name': 'Banff',
    'dest.4.region': 'Canada',
    'dest.4.desc': 'Majestic mountains and pristine wilderness',
    'dest.5.name': 'Machu Picchu',
    'dest.5.region': 'Peru',
    'dest.5.desc': 'Ancient Incan citadel set high in the Andes Mountains',
    'dest.6.name': 'Rome',
    'dest.6.region': 'Italy',
    'dest.6.desc': 'The Eternal City, home to the Colosseum and Vatican City',
    'dest.7.name': 'Maui',
    'dest.7.region': 'Hawaii, USA',
    'dest.7.desc': 'Tropical paradise with beaches, volcanoes, and waterfalls',
    'dest.8.name': 'Istanbul',
    'dest.8.region': 'Turkey',
    'dest.8.desc': 'Where East meets West, rich in culture and history',
    'dest.9.name': 'London',
    'dest.9.region': 'UK',
    'dest.9.desc': 'Historic landmarks, world-class museums, and royal palaces',
    'dest.10.name': 'Maldives',
    'dest.10.region': 'Maldives',
    'dest.10.desc': 'Overwater bungalows and crystal clear turquoise waters',
    'dest.11.name': 'Cape Town',
    'dest.11.region': 'South Africa',
    'dest.11.desc': 'Stunning coastline, Table Mountain, and vibrant culture',
    'dest.12.name': 'Sydney',
    'dest.12.region': 'Australia',
    'dest.12.desc': 'Iconic Opera House, Harbour Bridge, and Bondi Beach',
    'dest.13.name': 'Petra',
    'dest.13.region': 'Jordan',
    'dest.13.desc': 'The Rose City, carved into pink sandstone cliffs',
    'dest.14.name': 'Rio de Janeiro',
    'dest.14.region': 'Brazil',
    'dest.14.desc': 'Carnival spirit, Copacabana beach, and Christ the Redeemer',
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

    // Recommendations Section
    'rec.aiTitle': 'Recommandations IA',
    'rec.popTitle': 'Destinations Populaires',
    'rec.aiDesc': 'Personnalisé pour vos intérêts en préservant la confidentialité',
    'rec.popDesc': 'Parcourez les destinations du monde entier',
    'rec.aiBadge': 'Assisté par IA',

    // Site Header Additional
    'header.signIn': 'Se Connecter',
    'header.bookNow': 'Réserver',
    'header.itinerary': 'Itinéraire',

    // Book Page
    'book.loading': 'Chargement des expériences...',
    'book.checkIn': 'Arrivée',
    'book.checkOut': 'Départ',
    'book.guests': 'Voyageurs',
    'book.search': 'Rechercher',
    'book.tourDate': 'Date du tour',
    'book.participants': 'Participants',
    'book.planYour': 'Planifiez Votre',
    'book.perfectTrip': 'Voyage Parfait',
    'book.subtitle': 'Réservez des hébergements et des visites pour une expérience inoubliable',

    // Tags
    'tags.History': 'Histoire',
    'tags.Adventure': 'Aventure',
    'tags.Desert': 'Désert',
    'tags.Beach': 'Plage',
    'tags.Nature': 'Nature',
    'tags.Culture': 'Culture',
    'tags.Romance': 'Romance',
    'tags.Urban': 'Urbain',
    'tags.Photography': 'Photographie',
    'tags.Food': 'Gastronomie',
    'tags.Relaxation': 'Détente',
    'tags.Luxury': 'Luxe',
    'tags.Hiking': 'Randonnée',
    'tags.Lifestyle': 'Art de vivre',
    'tags.Party': 'Fête',
    'tags.Architecture': 'Architecture',

    // Destinations
    'dest.1.name': 'Santorin',
    'dest.1.region': 'Grèce',
    'dest.1.desc': 'Vues imprenables sur la caldeira et histoire ancienne',
    'dest.2.name': 'Kyoto',
    'dest.2.region': 'Japon',
    'dest.2.desc': 'Temples, jardins et culture japonaise traditionnelle',
    'dest.3.name': 'Barcelone',
    'dest.3.region': 'Espagne',
    'dest.3.desc': 'Architecture de Gaudí et vie méditerranéenne vibrante',
    'dest.4.name': 'Banff',
    'dest.4.region': 'Canada',
    'dest.4.desc': 'Montagnes majestueuses et nature sauvage vierge',
    'dest.5.name': 'Machu Picchu',
    'dest.5.region': 'Pérou',
    'dest.5.desc': 'Ancienne citadelle inca perchée dans les Andes',
    'dest.6.name': 'Rome',
    'dest.6.region': 'Italie',
    'dest.6.desc': 'La Ville Éternelle, abritant le Colisée et le Vatican',
    'dest.7.name': 'Maui',
    'dest.7.region': 'Hawaii, USA',
    'dest.7.desc': 'Paradis tropical avec plages, volcans et cascades',
    'dest.8.name': 'Istanbul',
    'dest.8.region': 'Turquie',
    'dest.8.desc': 'Où l\'Est rencontre l\'Ouest, riche en culture et histoire',
    'dest.9.name': 'Londres',
    'dest.9.region': 'Royaume-Uni',
    'dest.9.desc': 'Monuments historiques, musées de classe mondiale et palais royaux',
    'dest.10.name': 'Maldives',
    'dest.10.region': 'Maldives',
    'dest.10.desc': 'Bungalows sur pilotis et eaux turquoise cristallines',
    'dest.11.name': 'Le Cap',
    'dest.11.region': 'Afrique du Sud',
    'dest.11.desc': 'Côte magnifique, Montagne de la Table et culture vibrante',
    'dest.12.name': 'Sydney',
    'dest.12.region': 'Australie',
    'dest.12.desc': 'Opéra emblématique, Harbour Bridge et plage de Bondi',
    'dest.13.name': 'Pétra',
    'dest.13.region': 'Jordanie',
    'dest.13.desc': 'La Cité Rose, taillée dans les falaises de grès rose',
    'dest.14.name': 'Rio de Janeiro',
    'dest.14.region': 'Brésil',
    'dest.14.desc': 'Esprit du carnaval, plage de Copacabana et Christ Rédempteur',
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

    // Recommendations Section
    'rec.aiTitle': 'KI-gestützte Empfehlungen',
    'rec.popTitle': 'Beliebte Ziele',
    'rec.aiDesc': 'Personalisiert für Ihre Interessen mit Datenschutz',
    'rec.popDesc': 'Durchsuchen Sie Ziele auf der ganzen Welt',
    'rec.aiBadge': 'KI-Unterstützt',

    // Site Header Additional
    'header.signIn': 'Anmelden',
    'header.bookNow': 'Jetzt Buchen',
    'header.itinerary': 'Reiseroute',

    // Book Page
    'book.loading': 'Lade Erlebnisse...',
    'book.checkIn': 'Anreise',
    'book.checkOut': 'Abreise',
    'book.guests': 'Gäste',
    'book.search': 'Suchen',
    'book.tourDate': 'Reisedatum',
    'book.participants': 'Teilnehmer',
    'book.planYour': 'Planen Sie Ihre',
    'book.perfectTrip': 'Perfekte Reise',
    'book.subtitle': 'Buchen Sie Unterkünfte und Touren für ein unvergessliches Erlebnis',

    // Tags
    'tags.History': 'Geschichte',
    'tags.Adventure': 'Abenteuer',
    'tags.Desert': 'Wüste',
    'tags.Beach': 'Strand',
    'tags.Nature': 'Natur',
    'tags.Culture': 'Kultur',
    'tags.Romance': 'Romantik',
    'tags.Urban': 'Urban',
    'tags.Photography': 'Fotografie',
    'tags.Food': 'Essen',
    'tags.Relaxation': 'Entspannung',
    'tags.Luxury': 'Luxus',
    'tags.Hiking': 'Wandern',
    'tags.Lifestyle': 'Lebensstil',
    'tags.Party': 'Feiern',
    'tags.Architecture': 'Architektur',

    // Destinations
    'dest.1.name': 'Santorini',
    'dest.1.region': 'Griechenland',
    'dest.1.desc': 'Atemberaubende Caldera-Ausblicke und antike Geschichte erwarten Sie',
    'dest.2.name': 'Kyoto',
    'dest.2.region': 'Japan',
    'dest.2.desc': 'Tempel, Gärten und traditionelle japanische Kultur',
    'dest.3.name': 'Barcelona',
    'dest.3.region': 'Spanien',
    'dest.3.desc': 'Gaudí-Architektur und lebendiges mediterranes Leben',
    'dest.4.name': 'Banff',
    'dest.4.region': 'Kanada',
    'dest.4.desc': 'Majestätische Berge und unberührte Wildnis',
    'dest.5.name': 'Machu Picchu',
    'dest.5.region': 'Peru',
    'dest.5.desc': 'Antike Inka-Zitadelle hoch in den Anden',
    'dest.6.name': 'Rom',
    'dest.6.region': 'Italien',
    'dest.6.desc': 'Die Ewige Stadt, Heimat des Kolosseums und der Vatikanstadt',
    'dest.7.name': 'Maui',
    'dest.7.region': 'Hawaii, USA',
    'dest.7.desc': 'Tropisches Paradies mit Stränden, Vulkanen und Wasserfällen',
    'dest.8.name': 'Istanbul',
    'dest.8.region': 'Türkei',
    'dest.8.desc': 'Wo Osten auf Westen trifft, reich an Kultur und Geschichte',
    'dest.9.name': 'London',
    'dest.9.region': 'UK',
    'dest.9.desc': 'Historische Sehenswürdigkeiten, erstklassige Museen und königliche Paläste',
    'dest.10.name': 'Malediven',
    'dest.10.region': 'Malediven',
    'dest.10.desc': 'Überwasser-Bungalows und kristallklares türkisfarbenes Wasser',
    'dest.11.name': 'Kapstadt',
    'dest.11.region': 'Südafrika',
    'dest.11.desc': 'Atemberaubende Küste, Tafelberg und lebendige Kultur',
    'dest.12.name': 'Sydney',
    'dest.12.region': 'Australien',
    'dest.12.desc': 'Ikonisches Opernhaus, Harbour Bridge und Bondi Beach',
    'dest.13.name': 'Petra',
    'dest.13.region': 'Jordanien',
    'dest.13.desc': 'Die Rosenstadt, in rosa Sandsteinfelsen gehauen',
    'dest.14.name': 'Rio de Janeiro',
    'dest.14.region': 'Brasilien',
    'dest.14.desc': 'Karnevalsstimmung, Copacabana-Strand und Christus der Erlöser',
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

    // Recommendations Section
    'rec.aiTitle': 'توصيات مدعومة بالذكاء الاصطناعي',
    'rec.popTitle': 'الوجهات الشهيرة',
    'rec.aiDesc': 'مخصصة لاهتماماتك مع الحفاظ على الخصوصية',
    'rec.popDesc': 'تصفح الوجهات حول العالم',
    'rec.aiBadge': 'بمساعدة الذكاء الاصطناعي',

    // Site Header Additional
    'header.signIn': 'تسجيل الدخول',
    'header.bookNow': 'احجز الآن',
    'header.itinerary': 'خط سير الرحلة',

    // Book Page
    'book.loading': 'جاري تحميل التجارب...',
    'book.checkIn': 'تسجيل الوصول',
    'book.checkOut': 'تسجيل المغادرة',
    'book.guests': 'الضيوف',
    'book.search': 'بحث',
    'book.tourDate': 'تاريخ الجولة',
    'book.participants': 'المشاركون',
    'book.planYour': 'خطط لـ',
    'book.perfectTrip': 'رحلتك المثالية',
    'book.subtitle': 'احجز أماكن الإقامة والجولات لتجربة لا تُنسى',

    // Tags
    'tags.History': 'تاريخ',
    'tags.Adventure': 'مغامرة',
    'tags.Desert': 'صحراء',
    'tags.Beach': 'شاطئ',
    'tags.Nature': 'طبيعة',
    'tags.Culture': 'ثقافة',
    'tags.Romance': 'رومانسية',
    'tags.Urban': 'مدينة',
    'tags.Photography': 'تصوير',
    'tags.Food': 'طعام',
    'tags.Relaxation': 'استرخاء',
    'tags.Luxury': 'فخامة',
    'tags.Hiking': 'مشي',
    'tags.Lifestyle': 'أسلوب حياة',
    'tags.Party': 'حفلات',
    'tags.Architecture': 'عمارة',

    // Destinations
    'dest.1.name': 'سانتوريني',
    'dest.1.region': 'اليونان',
    'dest.1.desc': 'مناظر خلابة للكالديرا وتاريخ قديم في انتظارك',
    'dest.2.name': 'كيوتو',
    'dest.2.region': 'اليابان',
    'dest.2.desc': 'المعابد والحدائق والثقافة اليابانية التقليدية',
    'dest.3.name': 'برشلونة',
    'dest.3.region': 'إسبانيا',
    'dest.3.desc': 'عمارة غاودي وحياة البحر الأبيض المتوسط النابضة بالحياة',
    'dest.4.name': 'بانف',
    'dest.4.region': 'كندا',
    'dest.4.desc': 'جبال مهيبة وطبيعة برية نقية',
    'dest.5.name': 'ماتشو بيتشو',
    'dest.5.region': 'بيرو',
    'dest.5.desc': 'قلعة إنكا القديمة تقع عالياً في جبال الأنديز',
    'dest.6.name': 'روما',
    'dest.6.region': 'إيطاليا',
    'dest.6.desc': 'المدينة الخالدة، موطن الكولوسيوم ومدينة الفاتيكان',
    'dest.7.name': 'ماوي',
    'dest.7.region': 'هاواي، الولايات المتحدة',
    'dest.7.desc': 'جنة استوائية مع شواطئ وبراكين وشلالات',
    'dest.8.name': 'إسطنبول',
    'dest.8.region': 'تركيا',
    'dest.8.desc': 'حيث يلتقي الشرق بالغرب، غنية بالثقافة والتاريخ',
    'dest.9.name': 'لندن',
    'dest.9.region': 'المملكة المتحدة',
    'dest.9.desc': 'معالم تاريخية ومتاحف عالمية وقصور ملكية',
    'dest.10.name': 'جزر المالديف',
    'dest.10.region': 'جزر المالديف',
    'dest.10.desc': 'أكواخ فوق الماء ومياه فيروزية صافية وضوح الشمس',
    'dest.11.name': 'كيب تاون',
    'dest.11.region': 'جنوب أفريقيا',
    'dest.11.desc': 'ساحل مذهل وجبل الطاولة وثقافة نابضة بالحياة',
    'dest.12.name': 'سيدني',
    'dest.12.region': 'أستراليا',
    'dest.12.desc': 'دار الأوبرا الشهيرة وجسر الميناء وشاطئ بوندي',
    'dest.13.name': 'البتراء',
    'dest.13.region': 'الأردن',
    'dest.13.desc': 'المدينة الوردية، منحوتة في منحدرات الحجر الرملي الوردي',
    'dest.14.name': 'ريو دي جانيرو',
    'dest.14.region': 'البرازيل',
    'dest.14.desc': 'روح الكرنفال وشاطئ كوباكابانا والمسيح الفادي',
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

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }, [])

  useEffect(() => {
    try {
      document.documentElement.lang = language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    } catch (e) {
      // ignore server-side or other environments
    }
  }, [language])

  const t = useCallback((key: string, defaultText: string = key): string => {
    return translations[language]?.[key] || defaultText
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])

  return (
    <LanguageContext.Provider value={value}>
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
