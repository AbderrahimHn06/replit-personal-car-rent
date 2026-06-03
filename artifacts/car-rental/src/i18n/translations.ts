import type { LanguageCode } from "@/data/localStore";

export type TranslationKey =
  /* ── Navigation ── */
  | "nav.overview" | "nav.rentals" | "nav.fleet" | "nav.availability"
  | "nav.maintenance" | "nav.clients" | "nav.blockedClients"
  | "nav.alerts" | "nav.reports" | "nav.settings" | "nav.backToWebsite"
  | "nav.group.rentals" | "nav.group.fleet" | "nav.group.clients"
  | "nav.group.insights" | "nav.group.system"
  /* ── Section titles & subtitles ── */
  | "section.overview.title" | "section.overview.sub"
  | "section.rentals.title" | "section.rentals.sub"
  | "section.fleet.title" | "section.fleet.sub"
  | "section.clients.title" | "section.clients.sub"
  | "section.blocked.title" | "section.blocked.sub"
  | "section.availability.title" | "section.availability.sub"
  | "section.maintenance.title" | "section.maintenance.sub"
  | "section.alerts.title" | "section.alerts.sub"
  | "section.reports.title" | "section.reports.sub"
  | "section.settings.title" | "section.settings.sub"
  /* ── Common actions ── */
  | "action.add" | "action.edit" | "action.delete" | "action.save"
  | "action.cancel" | "action.search" | "action.book" | "action.confirm"
  | "action.close" | "action.dismiss" | "action.dismissAll" | "action.export"
  | "action.exportPDF" | "action.saveChanges" | "action.scheduleService"
  | "action.markAllRead" | "action.viewAll" | "action.viewReports"
  | "action.manageFleet" | "action.review" | "action.callClient"
  | "action.viewRental" | "action.checkIn" | "action.viewService"
  | "action.viewClient" | "action.return" | "action.print"
  | "action.newRental" | "action.newWalkIn" | "action.approve"
  | "action.reject" | "action.block" | "action.unblock"
  | "action.addClient" | "action.saved"
  /* ── Status labels ── */
  | "status.active" | "status.reserved" | "status.overdue" | "status.completed"
  | "status.new" | "status.contacted" | "status.confirmed" | "status.cancelled"
  | "status.available" | "status.rented" | "status.maintenance" | "status.inService"
  | "status.dueSoon" | "status.inProgress" | "status.vip"
  /* ── KPI labels ── */
  | "kpi.totalBookings" | "kpi.pendingRequests" | "kpi.confirmed"
  | "kpi.activeRentals" | "kpi.availableCars" | "kpi.rentedCars"
  | "kpi.inMaintenance" | "kpi.totalClients" | "kpi.blockedClients"
  | "kpi.bookingRequests" | "kpi.walkInRentals" | "kpi.pendingActions"
  | "kpi.confirmedToday" | "kpi.overdueReturns" | "kpi.monthlyRevenue"
  | "kpi.fleetUtilization" | "kpi.revenueGrowth"
  | "kpi.online" | "kpi.repeatClients"
  /* ── KPI sub-labels ── */
  | "kpi.sub.allTimeReservations" | "kpi.sub.awaitingConfirmation"
  | "kpi.sub.confirmedThisMonth" | "kpi.sub.currentlyOnRoad"
  | "kpi.sub.currentlyRentedOut" | "kpi.sub.temporarilyOffRoad"
  | "kpi.sub.registeredAccounts" | "kpi.sub.restrictedFromRenting"
  | "kpi.sub.newCount" | "kpi.sub.activeCounter" | "kpi.sub.onTheRoad"
  | "kpi.sub.needResponse" | "kpi.sub.confirmed" | "kpi.sub.followUpNow"
  | "kpi.sub.online" | "kpi.sub.walkin" | "kpi.sub.repeat" | "kpi.sub.currentlyRenting"
  /* ── Overview page ── */
  | "overview.title" | "overview.sub" | "overview.keyMetrics"
  | "overview.recentActivity" | "overview.operationsLog"
  | "overview.urgentAlerts" | "overview.requiringAttention"
  | "overview.fleetStatus" | "overview.vehicles" | "overview.utilization"
  | "overview.quickAccess" | "overview.bookingsBySource"
  | "overview.revenueSnapshot" | "overview.thisMonth" | "overview.lastMonth"
  | "overview.comparedToLastMonth" | "overview.noUrgentAlerts"
  | "overview.dailySnapshot"
  | "fleet.available" | "fleet.rented" | "fleet.reserved" | "fleet.maintenance"
  | "booking.source.website" | "booking.source.walkin" | "booking.source.phone"
  /* ── Operations page ── */
  | "ops.title" | "ops.sub" | "ops.searchPlaceholder"
  | "ops.tab.bookings" | "ops.tab.walkin" | "ops.tab.rentals"
  /* ── Filters ── */
  | "filter.all" | "filter.new" | "filter.contacted" | "filter.confirmed"
  | "filter.cancelled" | "filter.active" | "filter.reserved" | "filter.overdue"
  | "filter.completed" | "filter.dueSoon" | "filter.inProgress"
  /* ── Table headers ── */
  | "table.client" | "table.vehicle" | "table.dates" | "table.location"
  | "table.status" | "table.total" | "table.deposit" | "table.source"
  | "table.reference" | "table.phone" | "table.actions" | "table.plate"
  | "table.scheduled" | "table.completed" | "table.garage" | "table.cost"
  | "table.city" | "table.lastRental" | "table.trust"
  /* ── Clients page ── */
  | "clients.subtitle"
  /* ── Settings page ── */
  | "settings.subtitle" | "settings.agencyInfo" | "settings.agencyName"
  | "settings.address" | "settings.mobile" | "settings.website" | "settings.taxId"
  | "settings.businessHours" | "settings.closed"
  | "settings.locations" | "settings.locationsSubtitle" | "settings.addLocation"
  | "settings.inactive" | "settings.disable" | "settings.enable"
  | "settings.currency" | "settings.currencySubtitle" | "settings.mainCurrency"
  | "settings.supportedCurrencies"
  | "settings.language" | "settings.languageSubtitle" | "settings.mainLanguage"
  | "settings.supportedLanguages" | "settings.mainLanguageLabel"
  | "settings.terms" | "settings.branding" | "settings.logo"
  | "settings.brandColors" | "settings.primaryColor" | "settings.accentColor"
  /* ── Availability ── */
  | "availability.to"
  /* ── Alerts ── */
  | "alerts.title" | "alerts.active" | "alerts.urgent" | "alerts.allClear"
  | "alerts.urgentGroup" | "alerts.warningsGroup" | "alerts.infoGroup"
  | "alerts.noAlerts" | "alerts.runningSmoothly"
  | "severity.urgent" | "severity.warning" | "severity.info"
  /* ── Maintenance ── */
  | "maintenance.title" | "maintenance.sub" | "maintenance.scheduleService"
  | "maintenance.selectVehicle" | "maintenance.serviceType" | "maintenance.selectPreset"
  | "maintenance.customService" | "maintenance.dates" | "maintenance.serviceDate"
  | "maintenance.nextServiceDate" | "maintenance.details" | "maintenance.garage"
  | "maintenance.estimatedCost" | "maintenance.notes" | "maintenance.addTitle"
  | "maintenance.addSub" | "maintenance.editTitle" | "maintenance.editSub"
  | "maintenance.noVehicles" | "maintenance.searchVehicle" | "maintenance.plate"
  | "maintenance.scheduled" | "maintenance.completedDate"
  /* ── Reports ── */
  | "reports.title" | "reports.sub" | "reports.monthly" | "reports.totalBookings"
  | "reports.totalClients" | "reports.fleetUtilization" | "reports.rentalDuration"
  | "reports.bookingsBySource" | "reports.fleetBreakdown"
  /* ── Notifications ── */
  | "notif.title" | "notif.empty" | "notif.caughtUp" | "notif.viewAllAlerts"
  /* ── Empty states ── */
  | "empty.noResults" | "empty.noRentals" | "empty.noBookings" | "empty.noCars"
  | "empty.noClients" | "empty.noAlerts" | "empty.noMaintenance" | "empty.noLocations"
  /* ── Form labels ── */
  | "form.name" | "form.phone" | "form.email" | "form.notes" | "form.required"
  | "form.status" | "form.pickupLocation" | "form.returnLocation"
  | "form.pickupDate" | "form.returnDate" | "form.deposit"
  /* ── Drawer labels ── */
  | "drawer.client" | "drawer.vehicle" | "drawer.dates" | "drawer.rentalDetails"
  | "drawer.submitted" | "drawer.timeline" | "drawer.license"
  /* ── Booking request statuses ── */
  | "booking.status.requestReceived" | "booking.status.clientContacted" | "booking.status.bookingConfirmed"
  /* ── Misc ── */
  | "misc.agency" | "misc.totalVehicles" | "misc.ofTotal"
  | "misc.searchByNameOrPlate" | "misc.chooseService" | "misc.describeService"
  | "misc.garageCity" | "misc.detailsAboutService";

type Translations = Record<TranslationKey, string>;

const fr: Translations = {
  /* Navigation */
  "nav.overview": "Vue d'ensemble",
  "nav.rentals": "Locations",
  "nav.fleet": "Flotte",
  "nav.availability": "Disponibilité",
  "nav.maintenance": "Maintenance",
  "nav.clients": "Clients",
  "nav.blockedClients": "Clients bloqués",
  "nav.alerts": "Alertes",
  "nav.reports": "Rapports",
  "nav.settings": "Paramètres",
  "nav.backToWebsite": "Retour au site",
  "nav.group.rentals": "Locations",
  "nav.group.fleet": "Flotte",
  "nav.group.clients": "Clients",
  "nav.group.insights": "Analyses",
  "nav.group.system": "Système",
  /* Section titles */
  "section.overview.title": "Vue d'ensemble",
  "section.overview.sub": "Résumé du jour et indicateurs clés",
  "section.rentals.title": "Locations",
  "section.rentals.sub": "Réservations, guichet et cycle de vie des locations",
  "section.fleet.title": "Flotte",
  "section.fleet.sub": "Inventaire et état des véhicules",
  "section.clients.title": "Clients",
  "section.clients.sub": "Profils clients enregistrés",
  "section.blocked.title": "Clients bloqués",
  "section.blocked.sub": "Clients restreints de location",
  "section.availability.title": "Disponibilité",
  "section.availability.sub": "Planning hebdomadaire des véhicules",
  "section.maintenance.title": "Maintenance",
  "section.maintenance.sub": "File d'attente et planification des services",
  "section.alerts.title": "Alertes",
  "section.alerts.sub": "Alertes opérationnelles nécessitant attention",
  "section.reports.title": "Rapports",
  "section.reports.sub": "Résumé des performances commerciales",
  "section.settings.title": "Paramètres",
  "section.settings.sub": "Configuration de l'agence",
  /* Actions */
  "action.add": "Ajouter",
  "action.edit": "Modifier",
  "action.delete": "Supprimer",
  "action.save": "Enregistrer",
  "action.cancel": "Annuler",
  "action.search": "Rechercher",
  "action.book": "Réserver",
  "action.confirm": "Confirmer",
  "action.close": "Fermer",
  "action.dismiss": "Ignorer",
  "action.dismissAll": "Tout ignorer",
  "action.export": "Exporter",
  "action.exportPDF": "Exporter PDF",
  "action.saveChanges": "Enregistrer les modifications",
  "action.scheduleService": "Planifier service",
  "action.markAllRead": "Tout marquer lu",
  "action.viewAll": "Tout voir",
  "action.viewReports": "Voir rapports",
  "action.manageFleet": "Gérer la flotte",
  "action.review": "Examiner",
  "action.callClient": "Appeler client",
  "action.viewRental": "Voir location",
  "action.checkIn": "Restitution",
  "action.viewService": "Voir service",
  "action.viewClient": "Voir client",
  "action.return": "Retour",
  "action.print": "Imprimer",
  "action.newRental": "Nouvelle location",
  "action.newWalkIn": "Guichet",
  "action.approve": "Approuver",
  "action.reject": "Rejeter",
  "action.block": "Bloquer",
  "action.unblock": "Débloquer",
  /* Status */
  "status.active": "Actif",
  "status.reserved": "Réservé",
  "status.overdue": "En retard",
  "status.completed": "Terminé",
  "status.new": "Nouveau",
  "status.contacted": "Contacté",
  "status.confirmed": "Confirmé",
  "status.cancelled": "Annulé",
  "status.available": "Disponible",
  "status.rented": "Loué",
  "status.maintenance": "Maintenance",
  "status.inService": "En service",
  "status.dueSoon": "Bientôt dû",
  "status.inProgress": "En cours",
  /* KPI labels */
  "kpi.totalBookings": "Total réservations",
  "kpi.pendingRequests": "Demandes en attente",
  "kpi.confirmed": "Confirmé",
  "kpi.activeRentals": "Locations actives",
  "kpi.availableCars": "Voitures disponibles",
  "kpi.rentedCars": "Voitures louées",
  "kpi.inMaintenance": "En maintenance",
  "kpi.totalClients": "Total clients",
  "kpi.blockedClients": "Clients bloqués",
  "kpi.bookingRequests": "Demandes de réservation",
  "kpi.walkInRentals": "Locations guichet",
  "kpi.pendingActions": "Actions en attente",
  "kpi.confirmedToday": "Confirmés aujourd'hui",
  "kpi.overdueReturns": "Retours en retard",
  "kpi.monthlyRevenue": "Revenu mensuel",
  "kpi.fleetUtilization": "Utilisation flotte",
  "kpi.revenueGrowth": "Croissance revenus",
  /* KPI sub-labels */
  "kpi.sub.allTimeReservations": "Toutes les réservations",
  "kpi.sub.awaitingConfirmation": "En attente de confirmation",
  "kpi.sub.confirmedThisMonth": "Confirmés ce mois",
  "kpi.sub.currentlyOnRoad": "Actuellement en route",
  "kpi.sub.currentlyRentedOut": "Actuellement loués",
  "kpi.sub.temporarilyOffRoad": "Temporairement hors service",
  "kpi.sub.registeredAccounts": "Comptes enregistrés",
  "kpi.sub.restrictedFromRenting": "Restriction de location",
  "kpi.sub.newCount": "nouveau(x)",
  "kpi.sub.activeCounter": "Compteur actif",
  "kpi.sub.onTheRoad": "En route",
  "kpi.sub.needResponse": "Besoin de réponse",
  "kpi.sub.confirmed": "Confirmés",
  "kpi.sub.followUpNow": "Suivre maintenant",
  /* Overview */
  "overview.title": "Vue d'ensemble",
  "overview.sub": "Snapshot des opérations du jour",
  "overview.keyMetrics": "Indicateurs clés",
  "overview.recentActivity": "Activité récente",
  "overview.operationsLog": "Journal des opérations",
  "overview.urgentAlerts": "Alertes urgentes",
  "overview.requiringAttention": "nécessite(nt) attention",
  "overview.fleetStatus": "État de la flotte",
  "overview.vehicles": "véhicules",
  "overview.utilization": "utilisation",
  "overview.quickAccess": "Accès rapide",
  "overview.bookingsBySource": "Réservations par source",
  "overview.revenueSnapshot": "Aperçu des revenus",
  "overview.thisMonth": "Ce mois",
  "overview.lastMonth": "Mois dernier",
  "overview.comparedToLastMonth": "par rapport au mois dernier",
  "overview.noUrgentAlerts": "Aucune alerte urgente",
  "overview.dailySnapshot": "Snapshot des opérations du jour",
  "fleet.available": "Disponible",
  "fleet.rented": "Loué",
  "fleet.reserved": "Réservé",
  "fleet.maintenance": "Maintenance",
  "booking.source.website": "Site web",
  "booking.source.walkin": "Guichet",
  "booking.source.phone": "Téléphone",
  /* Operations */
  "ops.title": "Locations",
  "ops.sub": "Réservations, guichet et cycle de vie en un espace",
  "ops.searchPlaceholder": "Rechercher clients, voitures…",
  "ops.tab.bookings": "Demandes de réservation",
  "ops.tab.walkin": "Locations guichet",
  "ops.tab.rentals": "Locations",
  /* Filters */
  "filter.all": "Tout",
  "filter.new": "Nouveau",
  "filter.contacted": "Contacté",
  "filter.confirmed": "Confirmé",
  "filter.cancelled": "Annulé",
  "filter.active": "Actif",
  "filter.reserved": "Réservé",
  "filter.overdue": "En retard",
  "filter.completed": "Terminé",
  "filter.dueSoon": "Bientôt dû",
  "filter.inProgress": "En cours",
  /* Table headers */
  "table.client": "Client",
  "table.vehicle": "Véhicule",
  "table.dates": "Dates",
  "table.location": "Lieu",
  "table.status": "Statut",
  "table.total": "Total",
  "table.deposit": "Caution",
  "table.source": "Source",
  "table.reference": "Référence",
  "table.phone": "Téléphone",
  "table.actions": "Actions",
  "table.plate": "Immatriculation",
  "table.scheduled": "Planifié",
  "table.completed": "Terminé",
  "table.garage": "Garage",
  "table.cost": "Coût",
  /* Alerts */
  "alerts.title": "Alertes",
  "alerts.active": "actives",
  "alerts.urgent": "urgentes",
  "alerts.allClear": "Tout est clair — aucune alerte active",
  "alerts.urgentGroup": "Urgent",
  "alerts.warningsGroup": "Avertissements",
  "alerts.infoGroup": "Informations",
  "alerts.noAlerts": "Aucune alerte",
  "alerts.runningSmoothly": "Tout fonctionne normalement",
  "severity.urgent": "Urgent",
  "severity.warning": "Attention",
  "severity.info": "Info",
  /* Maintenance */
  "maintenance.title": "Maintenance",
  "maintenance.sub": "File de service et travaux planifiés",
  "maintenance.scheduleService": "Planifier service",
  "maintenance.selectVehicle": "Sélectionner un véhicule *",
  "maintenance.serviceType": "Type de service",
  "maintenance.selectPreset": "Sélectionner un preset *",
  "maintenance.customService": "Description du service personnalisé *",
  "maintenance.dates": "Dates",
  "maintenance.serviceDate": "Date de service *",
  "maintenance.nextServiceDate": "Prochain service",
  "maintenance.details": "Détails",
  "maintenance.garage": "Garage / Atelier",
  "maintenance.estimatedCost": "Coût estimé ($)",
  "maintenance.notes": "Notes",
  "maintenance.addTitle": "Planifier un service",
  "maintenance.addSub": "Ajouter un nouveau service de maintenance",
  "maintenance.editTitle": "Modifier le service",
  "maintenance.editSub": "Mettre à jour les informations de maintenance",
  "maintenance.noVehicles": "Aucun véhicule trouvé",
  "maintenance.searchVehicle": "Rechercher par nom ou immatriculation…",
  "maintenance.plate": "Immatriculation",
  "maintenance.scheduled": "Planifié",
  "maintenance.completedDate": "Terminé le",
  /* Reports */
  "reports.title": "Rapports & Résumé",
  "reports.sub": "Aperçu des performances commerciales — Mai 2026",
  "reports.monthly": "Revenu mensuel",
  "reports.totalBookings": "Total réservations",
  "reports.totalClients": "Total clients",
  "reports.fleetUtilization": "Utilisation flotte",
  "reports.rentalDuration": "Durée de location",
  "reports.bookingsBySource": "Réservations par source",
  "reports.fleetBreakdown": "Répartition de la flotte",
  /* Notifications */
  "notif.title": "Notifications",
  "notif.empty": "Aucune notification",
  "notif.caughtUp": "Vous êtes à jour !",
  "notif.viewAllAlerts": "Voir toutes les alertes →",
  /* Empty states */
  "empty.noResults": "Aucun résultat",
  "empty.noRentals": "Aucune location",
  "empty.noBookings": "Aucune réservation",
  "empty.noCars": "Aucun véhicule",
  "empty.noClients": "Aucun client",
  "empty.noAlerts": "Aucune alerte",
  "empty.noMaintenance": "Aucune maintenance",
  /* Form labels */
  "form.name": "Nom",
  "form.phone": "Téléphone",
  "form.email": "Email",
  "form.notes": "Notes",
  "form.required": "requis",
  "form.status": "Statut",
  "form.pickupLocation": "Lieu de prise en charge",
  "form.returnLocation": "Lieu de retour",
  "form.pickupDate": "Date de prise en charge",
  "form.returnDate": "Date de retour",
  "form.deposit": "Caution",
  /* Drawer labels */
  "drawer.client": "Client",
  "drawer.vehicle": "Véhicule",
  "drawer.dates": "Dates",
  "drawer.rentalDetails": "Détails de la location",
  "drawer.submitted": "Soumis",
  "drawer.timeline": "Chronologie",
  "drawer.license": "Permis",
  /* Booking status steps */
  "booking.status.requestReceived": "Demande reçue",
  "booking.status.clientContacted": "Client contacté",
  "booking.status.bookingConfirmed": "Réservation confirmée",
  /* Misc */
  "misc.agency": "Responsable agence",
  "misc.totalVehicles": "véhicules au total",
  "misc.ofTotal": "sur",
  "misc.searchByNameOrPlate": "Rechercher par nom ou immatriculation…",
  "misc.chooseService": "Choisir un service…",
  "misc.describeService": "Décrire le service…",
  "misc.garageCity": "Nom du garage et ville",
  "misc.detailsAboutService": "Détails sur le service…",
  /* Extra actions */
  "action.addClient": "Ajouter client",
  "action.saved": "Enregistré !",
  /* Extra statuses */
  "status.vip": "VIP",
  /* Extra KPI */
  "kpi.online": "En ligne",
  "kpi.repeatClients": "Clients fidèles",
  "kpi.sub.online": "Inscrits en ligne",
  "kpi.sub.walkin": "Clients au guichet",
  "kpi.sub.repeat": "Plus de 2 locations",
  "kpi.sub.currentlyRenting": "En cours de location",
  /* Extra table headers */
  "table.city": "Ville",
  "table.lastRental": "Dernière location",
  "table.trust": "Confiance",
  /* Clients page */
  "clients.subtitle": "Gérez les profils, l'historique, les documents et le statut de confiance",
  /* Availability */
  "availability.to": "à",
  /* Empty states */
  "empty.noLocations": "Aucun site pour l'instant",
  /* Settings */
  "settings.subtitle": "Configuration de l'agence et préférences",
  "settings.agencyInfo": "Informations de l'agence",
  "settings.agencyName": "Nom de l'agence",
  "settings.address": "Adresse",
  "settings.mobile": "Mobile",
  "settings.website": "Site web",
  "settings.taxId": "N° fiscal / RC",
  "settings.businessHours": "Horaires d'ouverture",
  "settings.closed": "Fermé",
  "settings.locations": "Sites",
  "settings.locationsSubtitle": "Points de prise en charge et restitution",
  "settings.addLocation": "Ajouter un site",
  "settings.inactive": "Inactif",
  "settings.disable": "Désactiver",
  "settings.enable": "Activer",
  "settings.currency": "Devise",
  "settings.currencySubtitle": "Devise principale et devises acceptées",
  "settings.mainCurrency": "Devise principale",
  "settings.supportedCurrencies": "Devises acceptées",
  "settings.language": "Langue",
  "settings.languageSubtitle": "Préférences de langue pour l'interface et les documents",
  "settings.mainLanguage": "Langue principale",
  "settings.supportedLanguages": "Langues supportées",
  "settings.mainLanguageLabel": "Langue principale",
  "settings.terms": "Conditions générales",
  "settings.branding": "Identité visuelle",
  "settings.logo": "Logo de l'agence",
  "settings.brandColors": "Couleurs de marque",
  "settings.primaryColor": "Couleur principale",
  "settings.accentColor": "Couleur d'accent",
};

const en: Translations = {
  /* Navigation */
  "nav.overview": "Overview",
  "nav.rentals": "Rentals",
  "nav.fleet": "Fleet",
  "nav.availability": "Availability",
  "nav.maintenance": "Maintenance",
  "nav.clients": "Clients",
  "nav.blockedClients": "Blocked Clients",
  "nav.alerts": "Alerts",
  "nav.reports": "Reports",
  "nav.settings": "Settings",
  "nav.backToWebsite": "Back to Website",
  "nav.group.rentals": "Rentals",
  "nav.group.fleet": "Fleet",
  "nav.group.clients": "Clients",
  "nav.group.insights": "Insights",
  "nav.group.system": "System",
  /* Section titles */
  "section.overview.title": "Overview",
  "section.overview.sub": "Today's summary and key metrics",
  "section.rentals.title": "Rentals",
  "section.rentals.sub": "Bookings, walk-ins, and rental lifecycle in one workspace",
  "section.fleet.title": "Fleet",
  "section.fleet.sub": "Vehicle inventory and status",
  "section.clients.title": "Clients",
  "section.clients.sub": "Registered client profiles",
  "section.blocked.title": "Blocked Clients",
  "section.blocked.sub": "Clients restricted from renting",
  "section.availability.title": "Availability",
  "section.availability.sub": "Weekly vehicle schedule",
  "section.maintenance.title": "Maintenance",
  "section.maintenance.sub": "Service queue and scheduling",
  "section.alerts.title": "Alerts",
  "section.alerts.sub": "Operational alerts requiring attention",
  "section.reports.title": "Reports",
  "section.reports.sub": "Business performance summary",
  "section.settings.title": "Settings",
  "section.settings.sub": "Agency configuration",
  /* Actions */
  "action.add": "Add",
  "action.edit": "Edit",
  "action.delete": "Delete",
  "action.save": "Save",
  "action.cancel": "Cancel",
  "action.search": "Search",
  "action.book": "Book",
  "action.confirm": "Confirm",
  "action.close": "Close",
  "action.dismiss": "Dismiss",
  "action.dismissAll": "Dismiss All",
  "action.export": "Export",
  "action.exportPDF": "Export PDF",
  "action.saveChanges": "Save Changes",
  "action.scheduleService": "Schedule Service",
  "action.markAllRead": "Mark all read",
  "action.viewAll": "View all",
  "action.viewReports": "View reports",
  "action.manageFleet": "Manage fleet",
  "action.review": "Review",
  "action.callClient": "Call Client",
  "action.viewRental": "View Rental",
  "action.checkIn": "Check In",
  "action.viewService": "View Service",
  "action.viewClient": "View Client",
  "action.return": "Return",
  "action.print": "Print",
  "action.newRental": "New Rental",
  "action.newWalkIn": "Walk-in",
  "action.approve": "Approve",
  "action.reject": "Reject",
  "action.block": "Block",
  "action.unblock": "Unblock",
  /* Status */
  "status.active": "Active",
  "status.reserved": "Reserved",
  "status.overdue": "Overdue",
  "status.completed": "Completed",
  "status.new": "New",
  "status.contacted": "Contacted",
  "status.confirmed": "Confirmed",
  "status.cancelled": "Cancelled",
  "status.available": "Available",
  "status.rented": "Rented",
  "status.maintenance": "Maintenance",
  "status.inService": "In Service",
  "status.dueSoon": "Due Soon",
  "status.inProgress": "In Progress",
  /* KPI labels */
  "kpi.totalBookings": "Total Bookings",
  "kpi.pendingRequests": "Pending Requests",
  "kpi.confirmed": "Confirmed",
  "kpi.activeRentals": "Active Rentals",
  "kpi.availableCars": "Available Cars",
  "kpi.rentedCars": "Rented Cars",
  "kpi.inMaintenance": "In Maintenance",
  "kpi.totalClients": "Total Clients",
  "kpi.blockedClients": "Blocked Clients",
  "kpi.bookingRequests": "Booking Requests",
  "kpi.walkInRentals": "Walk-in Rentals",
  "kpi.pendingActions": "Pending Actions",
  "kpi.confirmedToday": "Confirmed Today",
  "kpi.overdueReturns": "Overdue Returns",
  "kpi.monthlyRevenue": "Monthly Revenue",
  "kpi.fleetUtilization": "Fleet Utilization",
  "kpi.revenueGrowth": "Revenue Growth",
  /* KPI sub-labels */
  "kpi.sub.allTimeReservations": "All time reservations",
  "kpi.sub.awaitingConfirmation": "Awaiting confirmation",
  "kpi.sub.confirmedThisMonth": "Confirmed this month",
  "kpi.sub.currentlyOnRoad": "Currently on the road",
  "kpi.sub.currentlyRentedOut": "Currently rented out",
  "kpi.sub.temporarilyOffRoad": "Temporarily off-road",
  "kpi.sub.registeredAccounts": "Registered accounts",
  "kpi.sub.restrictedFromRenting": "Restricted from renting",
  "kpi.sub.newCount": "new",
  "kpi.sub.activeCounter": "Active counter",
  "kpi.sub.onTheRoad": "On the road",
  "kpi.sub.needResponse": "Need response",
  "kpi.sub.confirmed": "Confirmed",
  "kpi.sub.followUpNow": "Follow up now",
  /* Overview */
  "overview.title": "Overview",
  "overview.sub": "Daily operations snapshot",
  "overview.keyMetrics": "Key Metrics",
  "overview.recentActivity": "Recent Activity",
  "overview.operationsLog": "Operations log",
  "overview.urgentAlerts": "Urgent Alerts",
  "overview.requiringAttention": "requiring attention",
  "overview.fleetStatus": "Fleet Status",
  "overview.vehicles": "vehicles",
  "overview.utilization": "utilization",
  "overview.quickAccess": "Quick Access",
  "overview.bookingsBySource": "Bookings by Source",
  "overview.revenueSnapshot": "Revenue Snapshot",
  "overview.thisMonth": "This Month",
  "overview.lastMonth": "Last Month",
  "overview.comparedToLastMonth": "compared to last month",
  "overview.noUrgentAlerts": "No urgent alerts",
  "overview.dailySnapshot": "Daily operations snapshot",
  "fleet.available": "Available",
  "fleet.rented": "Rented",
  "fleet.reserved": "Reserved",
  "fleet.maintenance": "Maintenance",
  "booking.source.website": "Website",
  "booking.source.walkin": "Walk-in",
  "booking.source.phone": "Phone",
  /* Operations */
  "ops.title": "Rentals",
  "ops.sub": "Bookings, walk-ins, and rental lifecycle in one workspace",
  "ops.searchPlaceholder": "Search clients, cars…",
  "ops.tab.bookings": "Booking Requests",
  "ops.tab.walkin": "Walk-in Rentals",
  "ops.tab.rentals": "Rentals",
  /* Filters */
  "filter.all": "All",
  "filter.new": "New",
  "filter.contacted": "Contacted",
  "filter.confirmed": "Confirmed",
  "filter.cancelled": "Cancelled",
  "filter.active": "Active",
  "filter.reserved": "Reserved",
  "filter.overdue": "Overdue",
  "filter.completed": "Completed",
  "filter.dueSoon": "Due Soon",
  "filter.inProgress": "In Progress",
  /* Table headers */
  "table.client": "Client",
  "table.vehicle": "Vehicle",
  "table.dates": "Dates",
  "table.location": "Location",
  "table.status": "Status",
  "table.total": "Total",
  "table.deposit": "Deposit",
  "table.source": "Source",
  "table.reference": "Reference",
  "table.phone": "Phone",
  "table.actions": "Actions",
  "table.plate": "Plate",
  "table.scheduled": "Scheduled",
  "table.completed": "Completed",
  "table.garage": "Garage",
  "table.cost": "Cost",
  /* Alerts */
  "alerts.title": "Alerts",
  "alerts.active": "active",
  "alerts.urgent": "urgent",
  "alerts.allClear": "All clear — no active alerts",
  "alerts.urgentGroup": "Urgent",
  "alerts.warningsGroup": "Warnings",
  "alerts.infoGroup": "Information",
  "alerts.noAlerts": "No alerts",
  "alerts.runningSmoothly": "Everything is running smoothly",
  "severity.urgent": "Urgent",
  "severity.warning": "Warning",
  "severity.info": "Info",
  /* Maintenance */
  "maintenance.title": "Maintenance",
  "maintenance.sub": "Service queue and scheduled work",
  "maintenance.scheduleService": "Schedule Service",
  "maintenance.selectVehicle": "Select Vehicle *",
  "maintenance.serviceType": "Service Type",
  "maintenance.selectPreset": "Select Preset *",
  "maintenance.customService": "Custom Service Description *",
  "maintenance.dates": "Dates",
  "maintenance.serviceDate": "Service Date *",
  "maintenance.nextServiceDate": "Next Service Date",
  "maintenance.details": "Details",
  "maintenance.garage": "Garage / Workshop",
  "maintenance.estimatedCost": "Estimated Cost ($)",
  "maintenance.notes": "Notes",
  "maintenance.addTitle": "Schedule a Service",
  "maintenance.addSub": "Add a new maintenance service",
  "maintenance.editTitle": "Edit Service",
  "maintenance.editSub": "Update maintenance information",
  "maintenance.noVehicles": "No vehicles found",
  "maintenance.searchVehicle": "Search by name or plate…",
  "maintenance.plate": "Plate",
  "maintenance.scheduled": "Scheduled",
  "maintenance.completedDate": "Completed",
  /* Reports */
  "reports.title": "Reports & Summary",
  "reports.sub": "Business performance overview — May 2026",
  "reports.monthly": "Monthly Revenue",
  "reports.totalBookings": "Total Bookings",
  "reports.totalClients": "Total Clients",
  "reports.fleetUtilization": "Fleet Utilization",
  "reports.rentalDuration": "Rental Duration",
  "reports.bookingsBySource": "Bookings by Source",
  "reports.fleetBreakdown": "Fleet Breakdown",
  /* Notifications */
  "notif.title": "Notifications",
  "notif.empty": "No notifications",
  "notif.caughtUp": "You're all caught up!",
  "notif.viewAllAlerts": "View all alerts →",
  /* Empty states */
  "empty.noResults": "No results found",
  "empty.noRentals": "No rentals",
  "empty.noBookings": "No bookings",
  "empty.noCars": "No vehicles",
  "empty.noClients": "No clients",
  "empty.noAlerts": "No alerts",
  "empty.noMaintenance": "No maintenance",
  /* Form labels */
  "form.name": "Name",
  "form.phone": "Phone",
  "form.email": "Email",
  "form.notes": "Notes",
  "form.required": "required",
  "form.status": "Status",
  "form.pickupLocation": "Pickup Location",
  "form.returnLocation": "Return Location",
  "form.pickupDate": "Pickup Date",
  "form.returnDate": "Return Date",
  "form.deposit": "Deposit",
  /* Drawer labels */
  "drawer.client": "Client",
  "drawer.vehicle": "Vehicle",
  "drawer.dates": "Dates",
  "drawer.rentalDetails": "Rental Details",
  "drawer.submitted": "Submitted",
  "drawer.timeline": "Timeline",
  "drawer.license": "License",
  /* Booking status steps */
  "booking.status.requestReceived": "Request received",
  "booking.status.clientContacted": "Client contacted",
  "booking.status.bookingConfirmed": "Booking confirmed",
  /* Misc */
  "misc.agency": "Agency Manager",
  "misc.totalVehicles": "total vehicles",
  "misc.ofTotal": "of",
  "misc.searchByNameOrPlate": "Search by name or plate…",
  "misc.chooseService": "Choose a service…",
  "misc.describeService": "Describe the service…",
  "misc.garageCity": "Garage name and city",
  "misc.detailsAboutService": "Details about the service…",
};

const ar: Translations = {
  /* Navigation */
  "nav.overview": "لوحة المتابعة",
  "nav.rentals": "التأجير",
  "nav.fleet": "الأسطول",
  "nav.availability": "التوفر",
  "nav.maintenance": "الصيانة",
  "nav.clients": "العملاء",
  "nav.blockedClients": "العملاء المحظورون",
  "nav.alerts": "التنبيهات",
  "nav.reports": "التقارير",
  "nav.settings": "الإعدادات",
  "nav.backToWebsite": "العودة للموقع",
  "nav.group.rentals": "التأجير",
  "nav.group.fleet": "الأسطول",
  "nav.group.clients": "العملاء",
  "nav.group.insights": "التحليلات",
  "nav.group.system": "النظام",
  /* Section titles */
  "section.overview.title": "لوحة المتابعة",
  "section.overview.sub": "ملخص اليوم والمؤشرات الرئيسية",
  "section.rentals.title": "التأجير",
  "section.rentals.sub": "الحجوزات والتأجير المباشر ودورة حياة العقود",
  "section.fleet.title": "الأسطول",
  "section.fleet.sub": "مخزون المركبات وحالتها",
  "section.clients.title": "العملاء",
  "section.clients.sub": "ملفات العملاء المسجلين",
  "section.blocked.title": "العملاء المحظورون",
  "section.blocked.sub": "العملاء الممنوعون من الاستئجار",
  "section.availability.title": "التوفر",
  "section.availability.sub": "جدول المركبات الأسبوعي",
  "section.maintenance.title": "الصيانة",
  "section.maintenance.sub": "قائمة انتظار الخدمة والجدولة",
  "section.alerts.title": "التنبيهات",
  "section.alerts.sub": "تنبيهات تشغيلية تستدعي الانتباه",
  "section.reports.title": "التقارير",
  "section.reports.sub": "ملخص الأداء التجاري",
  "section.settings.title": "الإعدادات",
  "section.settings.sub": "إعداد الوكالة",
  /* Actions */
  "action.add": "إضافة",
  "action.edit": "تعديل",
  "action.delete": "حذف",
  "action.save": "حفظ",
  "action.cancel": "إلغاء",
  "action.search": "بحث",
  "action.book": "حجز",
  "action.confirm": "تأكيد",
  "action.close": "إغلاق",
  "action.dismiss": "رفض",
  "action.dismissAll": "رفض الكل",
  "action.export": "تصدير",
  "action.exportPDF": "تصدير PDF",
  "action.saveChanges": "حفظ التغييرات",
  "action.scheduleService": "جدولة الخدمة",
  "action.markAllRead": "تعليم الكل كمقروء",
  "action.viewAll": "عرض الكل",
  "action.viewReports": "عرض التقارير",
  "action.manageFleet": "إدارة الأسطول",
  "action.review": "مراجعة",
  "action.callClient": "الاتصال بالعميل",
  "action.viewRental": "عرض التأجير",
  "action.checkIn": "استلام",
  "action.viewService": "عرض الخدمة",
  "action.viewClient": "عرض العميل",
  "action.return": "إرجاع",
  "action.print": "طباعة",
  "action.newRental": "تأجير جديد",
  "action.newWalkIn": "استقبال مباشر",
  "action.approve": "موافقة",
  "action.reject": "رفض",
  "action.block": "حظر",
  "action.unblock": "إلغاء الحظر",
  /* Status */
  "status.active": "نشط",
  "status.reserved": "محجوز",
  "status.overdue": "متأخر",
  "status.completed": "مكتمل",
  "status.new": "جديد",
  "status.contacted": "تم التواصل",
  "status.confirmed": "مؤكد",
  "status.cancelled": "ملغى",
  "status.available": "متاح",
  "status.rented": "مؤجر",
  "status.maintenance": "صيانة",
  "status.inService": "قيد الخدمة",
  "status.dueSoon": "قريباً",
  "status.inProgress": "جارٍ",
  /* KPI labels */
  "kpi.totalBookings": "إجمالي الحجوزات",
  "kpi.pendingRequests": "الطلبات المعلقة",
  "kpi.confirmed": "مؤكد",
  "kpi.activeRentals": "التأجيرات النشطة",
  "kpi.availableCars": "السيارات المتاحة",
  "kpi.rentedCars": "السيارات المؤجرة",
  "kpi.inMaintenance": "في الصيانة",
  "kpi.totalClients": "إجمالي العملاء",
  "kpi.blockedClients": "العملاء المحظورون",
  "kpi.bookingRequests": "طلبات الحجز",
  "kpi.walkInRentals": "التأجير المباشر",
  "kpi.pendingActions": "الإجراءات المعلقة",
  "kpi.confirmedToday": "مؤكد اليوم",
  "kpi.overdueReturns": "المرتجعات المتأخرة",
  "kpi.monthlyRevenue": "الإيراد الشهري",
  "kpi.fleetUtilization": "استخدام الأسطول",
  "kpi.revenueGrowth": "نمو الإيرادات",
  /* KPI sub-labels */
  "kpi.sub.allTimeReservations": "إجمالي الحجوزات",
  "kpi.sub.awaitingConfirmation": "في انتظار التأكيد",
  "kpi.sub.confirmedThisMonth": "مؤكد هذا الشهر",
  "kpi.sub.currentlyOnRoad": "في الطريق حالياً",
  "kpi.sub.currentlyRentedOut": "مؤجرة حالياً",
  "kpi.sub.temporarilyOffRoad": "خارج الخدمة مؤقتاً",
  "kpi.sub.registeredAccounts": "حسابات مسجلة",
  "kpi.sub.restrictedFromRenting": "ممنوع من الاستئجار",
  "kpi.sub.newCount": "جديد",
  "kpi.sub.activeCounter": "عداد نشط",
  "kpi.sub.onTheRoad": "في الطريق",
  "kpi.sub.needResponse": "تحتاج رداً",
  "kpi.sub.confirmed": "مؤكد",
  "kpi.sub.followUpNow": "متابعة الآن",
  /* Overview */
  "overview.title": "لوحة المتابعة",
  "overview.sub": "لقطة العمليات اليومية",
  "overview.keyMetrics": "المؤشرات الرئيسية",
  "overview.recentActivity": "النشاط الأخير",
  "overview.operationsLog": "سجل العمليات",
  "overview.urgentAlerts": "التنبيهات العاجلة",
  "overview.requiringAttention": "يتطلب الانتباه",
  "overview.fleetStatus": "حالة الأسطول",
  "overview.vehicles": "مركبات",
  "overview.utilization": "استخدام",
  "overview.quickAccess": "وصول سريع",
  "overview.bookingsBySource": "الحجوزات حسب المصدر",
  "overview.revenueSnapshot": "نظرة على الإيرادات",
  "overview.thisMonth": "هذا الشهر",
  "overview.lastMonth": "الشهر الماضي",
  "overview.comparedToLastMonth": "مقارنة بالشهر الماضي",
  "overview.noUrgentAlerts": "لا توجد تنبيهات عاجلة",
  "overview.dailySnapshot": "لقطة العمليات اليومية",
  "fleet.available": "متاح",
  "fleet.rented": "مؤجر",
  "fleet.reserved": "محجوز",
  "fleet.maintenance": "صيانة",
  "booking.source.website": "الموقع",
  "booking.source.walkin": "مباشر",
  "booking.source.phone": "هاتف",
  /* Operations */
  "ops.title": "التأجير",
  "ops.sub": "الحجوزات والمباشر ودورة حياة العقود في مكان واحد",
  "ops.searchPlaceholder": "البحث عن عملاء أو سيارات…",
  "ops.tab.bookings": "طلبات الحجز",
  "ops.tab.walkin": "التأجير المباشر",
  "ops.tab.rentals": "التأجيرات",
  /* Filters */
  "filter.all": "الكل",
  "filter.new": "جديد",
  "filter.contacted": "تم التواصل",
  "filter.confirmed": "مؤكد",
  "filter.cancelled": "ملغى",
  "filter.active": "نشط",
  "filter.reserved": "محجوز",
  "filter.overdue": "متأخر",
  "filter.completed": "مكتمل",
  "filter.dueSoon": "قريباً",
  "filter.inProgress": "جارٍ",
  /* Table headers */
  "table.client": "العميل",
  "table.vehicle": "المركبة",
  "table.dates": "التواريخ",
  "table.location": "الموقع",
  "table.status": "الحالة",
  "table.total": "الإجمالي",
  "table.deposit": "التأمين",
  "table.source": "المصدر",
  "table.reference": "المرجع",
  "table.phone": "الهاتف",
  "table.actions": "الإجراءات",
  "table.plate": "لوحة الترقيم",
  "table.scheduled": "مجدول",
  "table.completed": "مكتمل",
  "table.garage": "الورشة",
  "table.cost": "التكلفة",
  /* Alerts */
  "alerts.title": "التنبيهات",
  "alerts.active": "نشطة",
  "alerts.urgent": "عاجلة",
  "alerts.allClear": "كل شيء على ما يرام — لا توجد تنبيهات نشطة",
  "alerts.urgentGroup": "عاجل",
  "alerts.warningsGroup": "تحذيرات",
  "alerts.infoGroup": "معلومات",
  "alerts.noAlerts": "لا توجد تنبيهات",
  "alerts.runningSmoothly": "كل شيء يعمل بسلاسة",
  "severity.urgent": "عاجل",
  "severity.warning": "تحذير",
  "severity.info": "معلومة",
  /* Maintenance */
  "maintenance.title": "الصيانة",
  "maintenance.sub": "قائمة انتظار الخدمة والأعمال المجدولة",
  "maintenance.scheduleService": "جدولة خدمة",
  "maintenance.selectVehicle": "اختر مركبة *",
  "maintenance.serviceType": "نوع الخدمة",
  "maintenance.selectPreset": "اختر نوعاً محدداً *",
  "maintenance.customService": "وصف الخدمة المخصصة *",
  "maintenance.dates": "التواريخ",
  "maintenance.serviceDate": "تاريخ الخدمة *",
  "maintenance.nextServiceDate": "تاريخ الخدمة القادمة",
  "maintenance.details": "التفاصيل",
  "maintenance.garage": "الورشة / الكراج",
  "maintenance.estimatedCost": "التكلفة التقديرية ($)",
  "maintenance.notes": "ملاحظات",
  "maintenance.addTitle": "جدولة خدمة",
  "maintenance.addSub": "إضافة خدمة صيانة جديدة",
  "maintenance.editTitle": "تعديل الخدمة",
  "maintenance.editSub": "تحديث معلومات الصيانة",
  "maintenance.noVehicles": "لم يُعثر على مركبات",
  "maintenance.searchVehicle": "البحث بالاسم أو لوحة الترقيم…",
  "maintenance.plate": "لوحة الترقيم",
  "maintenance.scheduled": "مجدول",
  "maintenance.completedDate": "تاريخ الإنجاز",
  /* Reports */
  "reports.title": "التقارير والملخص",
  "reports.sub": "نظرة عامة على الأداء التجاري — مايو 2026",
  "reports.monthly": "الإيراد الشهري",
  "reports.totalBookings": "إجمالي الحجوزات",
  "reports.totalClients": "إجمالي العملاء",
  "reports.fleetUtilization": "استخدام الأسطول",
  "reports.rentalDuration": "مدة التأجير",
  "reports.bookingsBySource": "الحجوزات حسب المصدر",
  "reports.fleetBreakdown": "توزيع الأسطول",
  /* Notifications */
  "notif.title": "الإشعارات",
  "notif.empty": "لا توجد إشعارات",
  "notif.caughtUp": "أنت في آخر الأخبار!",
  "notif.viewAllAlerts": "عرض كل التنبيهات →",
  /* Empty states */
  "empty.noResults": "لا توجد نتائج",
  "empty.noRentals": "لا توجد تأجيرات",
  "empty.noBookings": "لا توجد حجوزات",
  "empty.noCars": "لا توجد مركبات",
  "empty.noClients": "لا يوجد عملاء",
  "empty.noAlerts": "لا توجد تنبيهات",
  "empty.noMaintenance": "لا توجد صيانة",
  /* Form labels */
  "form.name": "الاسم",
  "form.phone": "الهاتف",
  "form.email": "البريد الإلكتروني",
  "form.notes": "ملاحظات",
  "form.required": "مطلوب",
  "form.status": "الحالة",
  "form.pickupLocation": "موقع الاستلام",
  "form.returnLocation": "موقع الإرجاع",
  "form.pickupDate": "تاريخ الاستلام",
  "form.returnDate": "تاريخ الإرجاع",
  "form.deposit": "التأمين",
  /* Drawer labels */
  "drawer.client": "العميل",
  "drawer.vehicle": "المركبة",
  "drawer.dates": "التواريخ",
  "drawer.rentalDetails": "تفاصيل التأجير",
  "drawer.submitted": "تاريخ الإرسال",
  "drawer.timeline": "الجدول الزمني",
  "drawer.license": "الرخصة",
  /* Booking status steps */
  "booking.status.requestReceived": "تم استلام الطلب",
  "booking.status.clientContacted": "تم التواصل مع العميل",
  "booking.status.bookingConfirmed": "تم تأكيد الحجز",
  /* Misc */
  "misc.agency": "مدير الوكالة",
  "misc.totalVehicles": "إجمالي المركبات",
  "misc.ofTotal": "من",
  "misc.searchByNameOrPlate": "البحث بالاسم أو لوحة الترقيم…",
  "misc.chooseService": "اختر خدمة…",
  "misc.describeService": "صف الخدمة…",
  "misc.garageCity": "اسم الكراج والمدينة",
  "misc.detailsAboutService": "تفاصيل حول الخدمة…",
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = { fr, en, ar };
