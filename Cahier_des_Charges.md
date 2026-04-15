# 📋 CAHIER DES CHARGES
## Application de Gestion de Tontine - Cameroun
### Version 1.0 | Mars 2026

---

# TABLE DES MATIÈRES

1. [Présentation du Projet](#1-présentation-du-projet)
2. [Objectifs](#2-objectifs)
3. [Acteurs et Rôles](#3-acteurs-et-rôles)
4. [Spécifications Fonctionnelles](#4-spécifications-fonctionnelles)
5. [Parcours Utilisateurs](#5-parcours-utilisateurs)
6. [Exigences Techniques](#6-exigences-techniques)
7. [Modèle de Données](#7-modèle-de-données)
8. [Planning Prévisionnel](#8-planning-prévisionnel)

---

# 1. PRÉSENTATION DU PROJET

## 1.1 Contexte

La tontine est une pratique d'épargne collective très répandue au Cameroun. Elle permet à un groupe de personnes de cotiser régulièrement et de redistribuer les fonds collectés à tour de rôle ou selon d'autres modalités. Ce projet vise à **digitaliser** cette pratique ancestrale pour la rendre plus transparente, efficace et accessible.

## 1.2 Périmètre

| Élément | Description |
|---------|-------------|
| **Nom du projet** | TontineApp Cameroun (nom provisoire) |
| **Type d'application** | Web (Administration) + Mobile (Membres) |
| **Cible géographique** | Cameroun |
| **Langues** | Français, Anglais |
| **Utilisateurs cibles** | Associations de tontine, membres individuels |

## 1.3 Plateformes

- **Application Mobile (Android & iOS)** : Pour les membres
  - Consultation
  - Paiements
  - Notifications

- **Application Web (Administration)** : Pour le bureau
  - Président
  - Secrétaire
  - Trésorier
  - Commissaire aux comptes
  - Censeur
  - Administrateur système

---

# 2. OBJECTIFS

## 2.1 Objectifs Principaux

| # | Objectif | Indicateur de succès |
|---|----------|---------------------|
| 1 | Digitaliser la gestion des tontines | 100% des opérations réalisables en ligne |
| 2 | Assurer la transparence financière | Traçabilité complète des transactions |
| 3 | Faciliter la communication | Notifications automatiques multicanaux |
| 4 | Réduire les erreurs de gestion | Calculs automatisés des cotisations/sanctions |
| 5 | Permettre l'accès à distance | Application mobile pour tous les membres |

## 2.2 Objectifs Secondaires

- Générer des rapports automatiques
- Archiver l'historique des activités
- Faciliter l'intégration de nouveaux membres
- Permettre la gestion de plusieurs tontines par utilisateur

---

# 3. ACTEURS ET RÔLES

## 3.1 Hiérarchie des Rôles

```
                    ┌─────────────────────┐
                    │   SUPER ADMIN       │
                    │   (Plateforme)      │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │  PRÉSIDENT  │    │  PRÉSIDENT  │    │  PRÉSIDENT  │
   │  Tontine A  │    │  Tontine B  │    │  Tontine C  │
   └──────┬──────┘    └─────────────┘    └─────────────┘
          │
   ┌──────┴────────────────────���─────────────┐
   ▼           ▼          ▼         ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌───────┐ ┌───────┐
│Vice-   │ │Secré-  │ │Tréso-  │ │Commis-│ │Censeur│
│Prési.  │ │taire   │ │rier    │ │saire  │ │       │
└────────┘ └────────┘ └────────┘ └───────┘ └───────┘
                         │
                  ┌──────┴──────┐
                  ▼             ▼
            ┌──────────┐  ┌──────────┐
            │ MEMBRES  │  │ MEMBRES  │
            └──────────┘  └──────────┘
```

## 3.2 Description Détaillée des Rôles

### 🔴 Super Administrateur (Plateforme)

| Responsabilité | Actions |
|----------------|---------|
| Gestion globale | Gérer toutes les tontines de la plateforme |
| Support | Assister les administrateurs de tontines |
| Configuration | Paramétrer les options globales |
| Monitoring | Surveiller l'activité de la plateforme |

### 🟠 Président

| Responsabilité | Actions |
|----------------|---------|
| Direction | Superviser toutes les activités de la tontine |
| Création | Créer et configurer la tontine |
| Validation | Approuver les adhésions, valider les décisions |
| Bureau | Nommer/élire les membres du bureau |
| Configuration | Définir les règles (sanctions, cotisations, prêts) |

### 🟡 Vice-Président

| Responsabilité | Actions |
|----------------|---------|
| Suppléance | Remplacer le président en son absence |
| Assistance | Assister le président dans ses fonctions |
| Validation | Co-valider certaines décisions importantes |

### 🟢 Secrétaire (+ Adjoint)

| Responsabilité | Actions |
|----------------|---------|
| Planification | Créer et planifier les séances/sessions |
| Documentation | Rédiger les procès-verbaux |
| Communication | Envoyer les convocations |
| Présences | Gérer les présences/absences |
| Ordre du jour | Préparer l'ordre du jour des réunions |

### 🔵 Trésorier (+ Adjoint)

| Responsabilité | Actions |
|----------------|---------|
| Finances | Gérer la caisse principale et de secours |
| Cotisations | Enregistrer les paiements |
| Dépenses | Enregistrer et justifier les dépenses |
| Distribution | Gérer la distribution de la cagnotte |
| Prêts | Suivre les prêts et remboursements |

### 🟣 Commissaire aux Comptes

| Responsabilité | Actions |
|----------------|---------|
| Audit | Vérifier la régularité des comptes |
| Rapports | Accéder aux rapports financiers détaillés |
| Contrôle | Valider les bilans financiers |

### ⚫ Censeur

| Responsabilité | Actions |
|----------------|---------|
| Discipline | Appliquer les sanctions aux membres |
| Surveillance | Veiller au respect du règlement |
| Rapport | Faire le rapport des infractions |

### ⚪ Membre

| Responsabilité | Actions |
|----------------|---------|
| Cotisation | Payer ses cotisations régulièrement |
| Participation | Assister aux réunions |
| Prêts | Demander des prêts, servir de garant |
| Consultation | Consulter son historique et les infos de la tontine |

## 3.3 Matrice des Permissions

| Fonctionnalité | Super Admin | Président | Vice-Prés. | Secrétaire | Trésorier | Commissaire | Censeur | Membre |
|----------------|:-----------:|:---------:|:----------:|:----------:|:---------:|:-----------:|:-------:|:------:|
| Créer une tontine | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Configurer la tontine | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approuver adhésions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gérer le bureau | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Planifier réunions | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gérer présences | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Rédiger PV | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Enregistrer paiements | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Gérer dépenses | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Distribuer cagnotte | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Valider prêts | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Appliquer sanctions | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Auditer comptes | ✅ | ✅ | ❌ | ❌ | 👁️ | ✅ | ❌ | ❌ |
| Voir rapports spéciaux | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Payer cotisation | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Demander prêt | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Consulter historique | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

*Légende : ✅ = Accès complet | 👁️ = Lecture seule | ❌ = Pas d'accès*

---

# 4. SPÉCIFICATIONS FONCTIONNELLES

## 4.1 Module 1 : Gestion des Membres

### 4.1.1 Inscription et Création de Compte

**Processus d'inscription :**
```
Saisie Données → Vérification OTP → Validation Email → Compte Actif
```

**Données requises :**

| Champ | Type | Obligatoire | Validation |
|-------|------|:-----------:|------------|
| Nom | Texte | ✅ | Min 2 caractères |
| Prénom | Texte | ✅ | Min 2 caractères |
| Email | Email | ✅ | Format email valide, unique |
| Téléphone | Texte | ✅ | Format camerounais (+237) |
| Date de naissance | Date | ✅ | Âge ≥ 18 ans |
| Région | Liste | ✅ | 10 régions du Cameroun |
| N° CNI | Texte | ✅ | Format CNI camerounaise |
| Photo CNI | Image | ✅ | JPG/PNG, max 5MB |
| Photo profil | Image | ✅ | JPG/PNG, max 2MB |
| N° Mobile Money | Texte | ✅ | MTN MoMo ou Orange Money |
| Mot de passe | Texte | ✅ | Min 8 car., 1 maj., 1 chiffre |

### 4.1.2 Adhésion à une Tontine

**Deux méthodes d'adhésion :**

**MÉTHODE 1 : Via lien d'invitation**
```
Reçoit le lien → Clique le lien → Remplit formulaire → Attente approbation
```

**MÉTHODE 2 : Ajout direct par la tontine**
```
Bureau recherche → Saisit référence → Invitation envoyée → Membre accepte
```

### 4.1.3 Fonctionnalités du Profil Membre

| Fonctionnalité | Description |
|----------------|-------------|
| Modifier profil | Mettre à jour ses informations personnelles |
| Changer mot de passe | Modifier son mot de passe |
| Gérer 2FA | Activer/désactiver l'authentification à deux facteurs |
| Voir mes tontines | Liste des tontines auxquelles le membre appartient |
| Historique | Consulter son historique (paiements, sanctions, prêts) |
| Quitter tontine | Demander à quitter une tontine |

---

## 4.2 Module 2 : Gestion du Bureau

### 4.2.1 Configuration des Postes

**Postes par défaut (Modèle Camerounais) :**
- Président
- Vice-Président
- Secrétaire
- Secrétaire Adjoint
- Trésorier
- Trésorier Adjoint
- Commissaire aux Comptes
- Censeur
- Autres (personnalisables)

### 4.2.2 Modes de Désignation

| Mode | Description | Configuration |
|------|-------------|---------------|
| **Nomination** | Le président nomme directement | Simple et rapide |
| **Élection** | Vote des membres | Candidatures → Campagne → Vote → Résultats |

### 4.2.3 Gestion des Élections (si configuré)

**Processus électoral :**
```
Ouverture postes → Candidatures → Période campagne → Scrutin → Proclamation
```

### 4.2.4 Durée des Mandats

- Configurable par tontine (6 mois, 1 an, 2 ans, etc.)
- Notification automatique avant fin de mandat
- Possibilité de renouvellement

---

## 4.3 Module 3 : Gestion des Sanctions

### 4.3.1 Types de Sanctions par Défaut

| Type | Description | Montant par défaut |
|------|-------------|-------------------|
| Retard | Arrivée après l'heure officielle | Configurable |
| Absence non justifiée | Absence sans justificatif valide | Configurable |
| Absence justifiée | Absence avec justificatif accepté | Configurable (peut être 0) |
| Trouble à l'ordre | Perturbation de la réunion | Configurable |
| Non-paiement | Cotisation non payée à temps | Configurable |
| Autre | Personnalisable | Configurable |

### 4.3.2 Processus de Sanction

```
Censeur constate infraction → Sélectionne sanction → Confirmation → Notification membre → Membre paie → Sanction soldée
```

### 4.3.3 Configuration par Tontine

| Paramètre | Description |
|-----------|-------------|
| Liste des sanctions | Types de sanctions applicables |
| Montants | Montant fixe pour chaque type |
| Délai de paiement | Nombre de jours pour payer |
| Sanctions cumulatives | Les sanctions s'additionnent-elles ? |
| Seuil d'exclusion | Nombre max de sanctions avant exclusion |

---

## 4.4 Module 4 : Configuration de la Tontine

### 4.4.1 Paramètres Généraux

**IDENTITÉ**
- Nom de la tontine
- Description
- Date de création
- Devise (XAF)
- Règlement intérieur

**APPARENCE**
- Logo
- Couleur principale
- Couleur secondaire
- Thème (clair/sombre)

**RÈGLES**
- Mode désignation
- Durée mandats
- Mode distribution
- Postes du bureau

**COTISATIONS**
- Montant cotisation
- Fréquence
- Date limite paiement
- Pénalité retard

### 4.4.2 Configuration des Cycles

| Paramètre | Options | Description |
|-----------|---------|-------------|
| Fréquence des réunions | Hebdo, Bimensuel, Mensuel, Personnalisé | Rythme des séances |
| Durée d'un cycle | N séances | Nombre de séances avant nouveau cycle |
| Nouveau cycle auto | Oui/Non | Démarrage automatique après fin de cycle |
| Distribution | Tour de rôle, Enchères, Tirage | Mode de distribution de la cagnotte |

### 4.4.3 Configuration des Prêts

| Paramètre | Description |
|-----------|-------------|
| Prêts autorisés | Oui/Non |
| Taux d'intérêt | Pourcentage (ex: 5%, 10%) |
| Durée max remboursement | Nombre de mois |
| Plafond par membre | Montant maximum empruntable |
| Nombre de garants requis | 1, 2, 3... |
| Qui valide | Bureau, Président seul, Vote |

### 4.4.4 Configuration des Cotisations Extraordinaires

| Paramètre | Description |
|-----------|-------------|
| Types d'événements | Décès membre, Décès parent, Mariage, Naissance, Maladie, Autre |
| Montant par événement | Montant fixe pour chaque type |
| Obligatoire | Oui (tous les membres contribuent) |
| Délai de collecte | Nombre de jours |

---

## 4.5 Module 5 : Gestion des Paiements

### 4.5.1 Types de Paiements

- **Cotisation régulière** : Paiement périodique obligatoire
- **Sanction** : Paiement des amendes
- **Cotisation extraordinaire** : Événements spéciaux
- **Remboursement prêt** : Échéances de prêt
- **Frais adhésion** : Inscription à la tontine
- **Caisse de secours** : Contribution au fonds de secours

### 4.5.2 Moyens de Paiement

| Moyen | Intégration | Description |
|-------|-------------|-------------|
| **MTN Mobile Money** | API MTN MoMo | Paiement via numéro MTN |
| **Orange Money** | API Orange Money | Paiement via numéro Orange |
| **Espèces** | Manuel | Enregistrement par le trésorier |
| **Virement bancaire** | Manuel | Preuve de virement à télécharger |

### 4.5.3 Processus de Paiement Mobile

```
Membre initie paiement → Choix opérateur → Saisie PIN → Confirmation OTP → Notification succès → Mise à jour solde → Reçu généré
```

### 4.5.4 Gestion de la Trésorerie

**Caisses distinctes :**

| Caisse | Usage | Alimentation |
|--------|-------|--------------|
| **Caisse principale** | Cotisations régulières → Distribution | Cotisations |
| **Caisse de secours** | Urgences, aide aux membres | % cotisation ou montant fixe |
| **Caisse de fonctionnement** | Frais divers (salle, fournitures) | Frais d'adhésion, allocations |

### 4.5.5 Distribution de la Cagnotte

**Mode Tour de Rôle :**
- Ordre défini par : Ancienneté / Tirage initial / Choix libre
- Possibilité de céder son tour
- Échange de tour entre membres

**Mode Enchères :**
1. Membres éligibles font des offres (sacrifice)
2. Le plus offrant gagne la cagnotte
3. Cagnotte reçue = Total - Sacrifice
4. Sacrifice redistribué ou mis en caisse

**Mode Tirage au Sort :**
1. Membres éligibles (n'ayant pas encore reçu) participent
2. Tirage aléatoire transparent
3. Gagnant reçoit la cagnotte
4. Membre retiré du tirage pour le reste du cycle

---

## 4.6 Module 6 : Gestion des Sessions et Réunions

### 4.6.1 Cycle et Sessions

```
CYCLE (ex: 12 mois)
├── Session 1 (Janvier)
├── Session 2 (Février)
├── Session 3 (Mars)
├── ...
└── Session N (Décembre) → NOUVEAU CYCLE AUTOMATIQUE
```

### 4.6.2 Planification d'une Séance

**Informations requises :**

| Champ | Description |
|-------|-------------|
| Date | Date de la réunion |
| Heure de début | Heure officielle de début |
| Heure de fin prévue | Durée estimée |
| Lieu | Adresse physique |
| Ordre du jour | Points à aborder |
| Documents joints | Fichiers à partager |
| Bénéficiaire prévu | Membre qui recevra la cagnotte (si tour de rôle) |

### 4.6.3 Gestion des Présences

**Statuts possibles :**
- ✅ **PRÉSENT** : À l'heure
- ⏰ **RETARD** : Arrivé en retard
- ❌ **ABSENT** : Non présent
- 📄 **EXCUSÉ** : Justificatif soumis et approuvé

**Justificatifs acceptés :**
- Certificat médical
- Attestation de voyage
- Document officiel
- Autre (à valider par le secrétaire)

### 4.6.4 Procès-Verbal de Réunion

**Contenu automatique du PV :**

| Section | Contenu |
|---------|---------|
| En-tête | Date, lieu, heure début/fin |
| Présences | Liste des présents, absents, excusés, retards |
| Ordre du jour | Points prévus |
| Délibérations | Notes prises pendant la réunion |
| Décisions | Résolutions adoptées |
| Finances | Cotisations perçues, distribution effectuée |
| Sanctions | Sanctions appliquées |
| Prochaine réunion | Date et lieu prévisionnels |
| Signatures | Président, Secrétaire |

---

## 4.7 Module 7 : Gestion des Prêts

### 4.7.1 Processus de Demande de Prêt

```
Membre demande → Désigne garants → Garants acceptent → Bureau examine
                                                            │
                                        ┌───────────────────┴───────────────────┐
                                        ▼                                       ▼
                                    APPROUVÉ                                 REFUSÉ
                                        │
                                        ▼
                                  Décaissement → Trésorier enregistre → Remboursements → Prêt soldé
```

### 4.7.2 Informations du Prêt

| Champ | Description |
|-------|-------------|
| Montant demandé | Somme souhaitée (≤ plafond) |
| Motif | Raison de la demande |
| Durée souhaitée | Nombre de mois pour rembourser |
| Garants | Membres qui se portent garants |
| Taux d'intérêt | Appliqué automatiquement selon config |
| Échéancier | Calendrier de remboursement généré |

### 4.7.3 Suivi des Remboursements

| Information | Description |
|-------------|-------------|
| Montant restant dû | Capital + intérêts restants |
| Prochaine échéance | Date et montant |
| Historique paiements | Liste des remboursements effectués |
| Statut | En cours, En retard, Soldé |
| Alertes | Notifications avant échéance |

---

## 4.8 Module 8 : Gestion du Bilan

### 4.8.1 Types de Rapports

**📊 RAPPORTS FINANCIERS**
- Bilan financier global
- État de la caisse principale
- État de la caisse de secours
- État de la caisse de fonctionnement
- Récapitulatif des mouvements

**👥 RAPPORTS MEMBRES**
- État des cotisations par membre
- Membres à jour / en retard
- Historique individuel
- Liste des sanctions par membre

**💰 RAPPORTS PRÊTS**
- Prêts en cours
- Prêts soldés
- Prêts en retard
- Montant total des intérêts perçus

**📝 RAPPORTS RÉUNIONS**
- Procès-verbaux
- Statistiques de présence
- Historique des distributions

### 4.8.2 Accès aux Rapports par Rôle

| Rapport | Président | Trésorier | Commissaire | Secrétaire | Membre |
|---------|:---------:|:---------:|:-----------:|:----------:|:------:|
| Bilan global | ✅ | ✅ | ✅ | 👁️ | ❌ |
| État caisses | ✅ | ✅ | ✅ | ❌ | ❌ |
| Cotisations tous membres | ✅ | ✅ | ✅ | 👁️ | ❌ |
| Mon historique | ✅ | ✅ | ✅ | ✅ | ✅ |
| Prêts en cours | ✅ | ✅ | ✅ | ❌ | ❌ |
| PV réunions | ✅ | ✅ | ✅ | ✅ | ✅ |

### 4.8.3 Formats d'Export

| Format | Usage |
|--------|-------|
| **PDF** | Documents officiels, archivage |
| **Excel** | Analyse, traitement des données |
| **Impression** | Affichage en réunion |

---

## 4.9 Module 9 : Notifications et Communications

### 4.9.1 Canaux de Notification

- 📱 **SMS** : Messages texte
- 📲 **PUSH** : Notifications mobile
- 📧 **EMAIL** : Courriels
- 💬 **WHATSAPP** : Messages WhatsApp (via API)

*Préférences configurables par membre*

### 4.9.2 Types de Notifications Automatiques

| Événement | Destinataire | Canaux |
|-----------|--------------|--------|
| Rappel cotisation (J-3) | Membre concerné | SMS, Push, Email |
| Rappel réunion (J-1) | Tous les membres | Push, Email, WhatsApp |
| Sanction appliquée | Membre sanctionné | SMS, Push, Email |
| Dette impayée | Membre en dette | SMS, Push |
| Prêt approuvé | Demandeur | SMS, Push, Email |
| Échéance prêt (J-3) | Emprunteur | SMS, Push |
| Nouvelle adhésion | Bureau | Push, Email |
| Distribution effectuée | Bénéficiaire | SMS, Push, Email |
| Cotisation extra déclenchée | Tous les membres | SMS, Push, Email, WhatsApp |

---

## 4.10 Module 10 : Historique et Audit

### 4.10.1 Journal d'Activité

**Toutes les actions sont tracées :**

| Information | Description |
|-------------|-------------|
| Date/Heure | Horodatage précis |
| Utilisateur | Qui a fait l'action |
| Action | Description de l'action |
| Entité concernée | Membre, paiement, sanction, etc. |
| Détails | Valeurs avant/après modification |
| Adresse IP | Pour sécurité |

### 4.10.2 Accès pour Anciens Membres

- Accès en **lecture seule** à leur historique personnel
- Cotisations payées
- Sanctions reçues
- Prêts contractés
- Distributions reçues
- Date d'entrée et de sortie

---

# 5. PARCOURS UTILISATEURS

## 5.1 Parcours : Nouveau Membre

### 1️⃣ INSCRIPTION

1. Télécharge l'application mobile
2. Clique sur "Créer un compte"
3. Remplit le formulaire (nom, email, téléphone, CNI, photo...)
4. Reçoit un code OTP par SMS
5. Valide son email
6. Active l'authentification 2FA (optionnel)
7. ✅ Compte créé

### 2️⃣ ADHÉSION À UNE TONTINE

**Option A : Via lien d'invitation**
1. Reçoit un lien par SMS/WhatsApp/Email
2. Clique sur le lien
3. Accepte les conditions de la tontine
4. Soumet sa demande
5. ⏳ Attend l'approbation du bureau

**Option B : Ajouté par la tontine**
1. Reçoit une notification d'invitation
2. Consulte les détails de la tontine
3. Accepte ou refuse l'invitation
4. ✅ Membre actif

### 3️⃣ UTILISATION QUOTIDIENNE

- Consulte le tableau de bord (solde, prochaine réunion, dettes)
- Paie ses cotisations via Mobile Money
- Consulte le calendrier des séances
- Voit son historique (paiements, sanctions, distributions)
- Demande un prêt si besoin
- Reçoit les notifications (rappels, convocations)
- Consulte les PV des réunions

---

## 5.2 Parcours : Président

### 1️⃣ CRÉATION DE LA TONTINE

1. Se connecte à la plateforme web
2. Clique sur "Créer une tontine"
3. Définit l'identité (nom, description, logo)
4. Configure les règles :
   - Montant et fréquence des cotisations
   - Mode de distribution (tour de rôle/enchères/tirage)
   - Postes du bureau et mode de désignation
   - Types de sanctions et montants
   - Paramètres des prêts (taux, plafond, durée)
   - Événements de cotisation extraordinaire
5. Définit le cycle (nombre de sessions)
6. ✅ Tontine créée

### 2️⃣ CONSTITUTION DU BUREAU

**Si NOMINATION :**
1. Sélectionne les postes à pourvoir
2. Choisit un membre pour chaque poste
3. Envoie les notifications de nomination
4. Les nommés acceptent ou refusent

**Si ÉLECTION :**
1. Ouvre la période de candidature
2. Valide les candidatures reçues
3. Ouvre le scrutin
4. Proclame les résultats

### 3️⃣ GESTION DES ADHÉSIONS

1. Génère des liens d'invitation à partager
2. Ajoute directement des membres (par référence utilisateur)
3. Examine les demandes d'adhésion
4. Approuve ou refuse les demandes
5. Gère les départs de membres

### 4️⃣ SUPERVISION QUOTIDIENNE

- Consulte le tableau de bord global
- Vérifie l'état des cotisations
- Valide les demandes de prêt (avec le bureau)
- Consulte les rapports et bilans
- Modifie la configuration si nécessaire
- Gère les conflits et réclamations

---

## 5.3 Parcours : Secrétaire

### 1️⃣ PLANIFICATION D'UNE SÉANCE

1. Accède au module "Sessions"
2. Clique sur "Nouvelle séance"
3. Définit :
   - Date et heure
   - Lieu (adresse)
   - Ordre du jour
   - Bénéficiaire prévu (si tour de rôle)
4. Joint les documents nécessaires
5. Enregistre la séance
6. ✅ Notifications automatiques envoyées aux membres

### 2️⃣ GESTION DES PRÉSENCES (Jour J)

1. Ouvre la feuille de présence
2. Pointe les arrivées :
   - ✅ Présent (à l'heure)
   - ⏰ Retard (note l'heure d'arrivée)
   - ❌ Absent
3. Traite les justificatifs d'absence :
   - Examine les documents soumis
   - Valide ou refuse
   - 📄 Excusé (si validé)
4. Clôture la feuille de présence

### 3️⃣ RÉDACTION DU PROCÈS-VERBAL

1. Ouvre le formulaire PV (pré-rempli automatiquement)
2. Complète les sections :
   - Résumé des délibérations
   - Décisions prises
   - Points divers
3. Vérifie les données auto-générées :
   - Liste des présences
   - Cotisations du jour
   - Sanctions appliquées
   - Distribution effectuée
4. Définit la prochaine réunion
5. Soumet le PV pour validation
6. ✅ PV publié et accessible aux membres

### 4️⃣ GESTION DU CYCLE

- Planifie toutes les séances du cycle
- Définit l'ordre de distribution (si tour de rôle)
- Gère les échanges/cessions de tour
- Prépare le bilan de fin de cycle

---

## 5.4 Parcours : Trésorier

### 1️⃣ AVANT LA RÉUNION

1. Consulte la liste des cotisations attendues
2. Vérifie les paiements Mobile Money reçus
3. Identifie les membres en retard de paiement
4. Prépare le bordereau de caisse

### 2️⃣ PENDANT LA RÉUNION

1. Encaisse les cotisations en espèces
2. Enregistre chaque paiement dans l'application
3. Délivre les reçus (automatiques ou manuels)
4. Collecte les paiements de sanctions
5. Effectue la distribution de la cagnotte au bénéficiaire
6. Fait signer le bénéficiaire

### 3️⃣ GESTION DES DÉPENSES

1. Enregistre chaque dépense (salle, fournitures...)
2. Joint les justificatifs (factures, reçus)
3. Catégorise la dépense
4. Soumet pour validation si nécessaire

### 4️⃣ GESTION DES PRÊTS

1. Reçoit les demandes de prêt validées
2. Effectue le décaissement
3. Enregistre le prêt avec l'échéancier
4. Suit les remboursements
5. Relance les retardataires
6. Clôture les prêts soldés

### 5️⃣ RAPPORTS FINANCIERS

- Génère le bilan de chaque séance
- Prépare le bilan mensuel/trimestriel
- Exporte les rapports pour le commissaire aux comptes
- Archive les documents financiers

---

## 5.5 Parcours : Censeur

### 1️⃣ PENDANT LA RÉUNION

1. Note les infractions constatées :
   - Retards (avec heure d'arrivée)
   - Troubles à l'ordre
   - Comportements inappropriés
2. Consulte le barème des sanctions
3. Applique les sanctions appropriées
4. Notifie les membres sanctionnés

### 2️⃣ SUIVI DES SANCTIONS

1. Consulte la liste des sanctions impayées
2. Envoie des rappels aux membres concernés
3. Escalade au bureau si nécessaire
4. Propose des exclusions si seuil atteint

### 3️⃣ RAPPORT

- Présente le rapport des sanctions à chaque réunion
- Propose des ajustements au barème si nécessaire

---

## 5.6 Parcours : Commissaire aux Comptes

### 1️⃣ AUDIT PÉRIODIQUE

1. Accède aux rapports financiers détaillés
2. Vérifie la cohérence des écritures
3. Contrôle les justificatifs de dépenses
4. Compare les soldes déclarés et calculés
5. Identifie les anomalies éventuelles

### 2️⃣ RAPPORT D'AUDIT

1. Rédige le rapport d'audit
2. Formule des recommandations
3. Présente le rapport en assemblée
4. Valide ou invalide les comptes

### 3️⃣ SURVEILLANCE CONTINUE

- Accès permanent aux mouvements financiers
- Alertes en cas d'opérations inhabituelles
- Droit de demander des explications au trésorier

---

## 5.7 Parcours : Demande de Prêt (Membre)

### 1️⃣ SOUMISSION DE LA DEMANDE

1. Accède à "Mes prêts" > "Nouvelle demande"
2. Vérifie son éligibilité (affichée automatiquement)
3. Saisit le montant souhaité (≤ plafond)
4. Indique le motif
5. Choisit la durée de remboursement
6. Sélectionne ses garants (parmi les membres)
7. Soumet la demande

### 2️⃣ VALIDATION DES GARANTS

1. Les garants reçoivent une notification
2. Chaque garant consulte la demande
3. Chaque garant accepte ou refuse de se porter garant
4. Si tous acceptent → demande transmise au bureau

### 3️⃣ DÉCISION DU BUREAU

1. Le bureau examine la demande
2. Vote ou décision collégiale
3. Approbation ou refus (avec motif)
4. Notification au demandeur

### 4️⃣ DÉCAISSEMENT ET REMBOURSEMENT

1. Si approuvé : trésorier effectue le décaissement
2. Échéancier généré automatiquement
3. Rappels avant chaque échéance
4. Membre effectue les remboursements
5. Suivi du solde restant dû
6. Clôture automatique quand soldé

---

## 5.8 Parcours : Cotisation Extraordinaire

### 1️⃣ DÉCLENCHEMENT

1. Un événement survient (décès, mariage, naissance...)
2. Le président ou secrétaire crée l'événement
3. Sélectionne le type d'événement
4. Le montant est appliqué automatiquement (selon config)
5. Le bénéficiaire est désigné

### 2️⃣ NOTIFICATION

1. Tous les membres reçoivent une notification
2. Détails : type d'événement, montant, bénéficiaire, délai
3. Rappels automatiques avant la date limite

### 3️⃣ COLLECTE

1. Les membres paient via l'application
2. Le trésorier suit les paiements
3. Liste des membres ayant payé / non payé
4. Relances pour les retardataires

### 4️⃣ DISTRIBUTION

1. À la date limite, le trésorier clôture la collecte
2. Le montant total est remis au bénéficiaire
3. Reçu généré
4. Événement archivé

---

# 6. EXIGENCES TECHNIQUES

## 6.1 Architecture Générale

```
┌─────────────────────────────────────────────────────────────────────┐
│                       ARCHITECTURE SYSTÈME                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐           │
│  │   Mobile    │     │     Web     │     │   Admin     │           │
│  │    App      │     │    App      │     │   Panel     │           │
│  │ (iOS/Andr.) │     │  (React)    │     │             │           │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘           │
│         │                   │                   │                   │
│         └───────────────────┼───────────────────┘                   │
│                             │                                       │
│                             ▼                                       │
│                    ┌─────────────────┐                              │
│                    │   API Gateway   │                              │
│                    │    (REST/GQL)   │                              │
│                    └────────┬────────┘                              │
│                             │                                       │
│         ┌───────────────────┼───────────────────┐                   │
│         ▼                   ▼                   ▼                   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐           │
│  │   Auth      │     │  Business   │     │  Notifica-  │           │
│  │  Service    │     │   Logic     │     │    tions    │           │
│  └─────────────┘     └─────────────┘     └─────────────┘           │
│                             │                                       │
│                             ▼                                       │
│                    ┌─────────────────┐                              │
│                    │    Database     │                              │
│                    │   (PostgreSQL)  │                              │
│                    └─────────────────┘                              │
│                                                                     │
│  SERVICES EXTERNES :                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ MTN MoMo │ │ Orange   │ │   SMS    │ │ WhatsApp │               │
│  │   API    │ │ Money    │ │ Gateway  │ │   API    │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 6.2 Stack Technologique Recommandé

### Backend

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| Langage | Node.js / Python | Performance, écosystème |
| Framework | NestJS / FastAPI | Structure, maintenabilité |
| Base de données | PostgreSQL | Robustesse, transactions |
| Cache | Redis | Performance, sessions |
| Queue | RabbitMQ / Bull | Tâches asynchrones |

### Frontend Web

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| Framework | React / Vue.js | Réactivité, composants |
| State Management | Redux / Pinia | Gestion d'état |
| UI Library | Tailwind / Vuetify | Design moderne |
| Charts | Chart.js / ApexCharts | Visualisations |

### Mobile

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| Framework | React Native / Flutter | Cross-platform |
| Navigation | React Navigation | Routing |
| Storage | AsyncStorage / SQLite | Données locales |

### Infrastructure

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| Hébergement | AWS / DigitalOcean | Fiabilité, scalabilité |
| CI/CD | GitHub Actions | Automatisation |
| Monitoring | Sentry / DataDog | Surveillance |
| CDN | CloudFlare | Performance |

## 6.3 Sécurité

### Authentification

| Exigence | Implémentation |
|----------|----------------|
| Connexion sécurisée | JWT + Refresh Tokens |
| 2FA | OTP via SMS ou Authenticator |
| Session | Expiration configurable |
| Mot de passe | Hash bcrypt, règles de complexité |

### Protection des Données

| Exigence | Implémentation |
|----------|----------------|
| Chiffrement | HTTPS/TLS 1.3 |
| Données sensibles | Chiffrement AES-256 |
| CNI/Photos | Stockage sécurisé, accès restreint |
| Logs | Anonymisation des données sensibles |

### Audit

| Exigence | Implémentation |
|----------|----------------|
| Journal d'activité | Toutes les actions tracées |
| Rétention | 5 ans minimum |
| Accès | Lecture seule pour audit |
| Alertes | Activités suspectes |

## 6.4 Performance

| Métrique | Objectif |
|----------|----------|
| Temps de réponse API | < 200ms (95e percentile) |
| Disponibilité | 99.5% |
| Utilisateurs simultanés | 10,000+ |
| Temps de chargement mobile | < 3 secondes |

## 6.5 Intégrations Externes

### Mobile Money

| Fournisseur | API | Fonctionnalités |
|-------------|-----|-----------------|
| MTN MoMo | MTN Open API | Collection, Disbursement |
| Orange Money | Orange Money API | Paiement, Transfert |

### Notifications

| Canal | Fournisseur | Usage |
|-------|-------------|-------|
| SMS | Twilio / Africa's Talking | OTP, Rappels |
| Email | SendGrid / Mailgun | Notifications, Rapports |
| Push | Firebase Cloud Messaging | Alertes temps réel |
| WhatsApp | WhatsApp Business API | Communications |

---

# 7. MODÈLE DE DONNÉES

## 7.1 Entités Principales

### Utilisateur (User)

```
User
├── id (UUID)
├── email (unique)
├── phone (unique)
├── password_hash
├── first_name
├── last_name
├── date_of_birth
├── region
├── cni_number
├── cni_photo_url
├── profile_photo_url
├── mobile_money_number
├── mobile_money_provider (MTN/ORANGE)
├── is_verified
├── is_2fa_enabled
├── created_at
├── updated_at
└── deleted_at (soft delete)
```

### Tontine

```
Tontine
├── id (UUID)
├── name
├── description
├── logo_url
├── primary_color
├── secondary_color
├── theme (LIGHT/DARK)
├── currency (XAF)
├── contribution_amount
├── contribution_frequency (WEEKLY/BIWEEKLY/MONTHLY)
├── distribution_mode (ROTATION/AUCTION/LOTTERY)
├── cycle_sessions_count
├── loan_enabled
├── loan_interest_rate
├── loan_max_duration_months
├── loan_max_amount
├── loan_guarantors_required
├── bureau_designation_mode (NOMINATION/ELECTION)
├── bureau_mandate_duration_months
├── created_by (User)
├── created_at
├── updated_at
└── deleted_at
```

### Membre de Tontine (TontineMember)

```
TontineMember
├── id (UUID)
├── tontine_id (Tontine)
├── user_id (User)
├── role (PRESIDENT/VICE_PRESIDENT/SECRETARY/...)
├── status (PENDING/ACTIVE/SUSPENDED/LEFT)
├── joined_at
├── left_at
├── rotation_order (pour tour de rôle)
├── created_at
└── updated_at
```

### Session/Séance

```
Session
├── id (UUID)
├── tontine_id (Tontine)
├── cycle_id (Cycle)
├── session_number
├── scheduled_date
├── start_time
├── end_time
├── location_address
├── location_coordinates
├── agenda
├── beneficiary_id (TontineMember) - si rotation
├── status (SCHEDULED/IN_PROGRESS/COMPLETED/CANCELLED)
├── minutes_url (PV)
├── created_by (User)
├── created_at
└── updated_at
```

### Présence (Attendance)

```
Attendance
├── id (UUID)
├── session_id (Session)
├── member_id (TontineMember)
├── status (PRESENT/LATE/ABSENT/EXCUSED)
├── arrival_time
├── justification_document_url
├── justification_status (PENDING/APPROVED/REJECTED)
├── marked_by (User)
├── created_at
└── updated_at
```

### Paiement (Payment)

```
Payment
├── id (UUID)
├── tontine_id (Tontine)
├── member_id (TontineMember)
├── session_id (Session) - optionnel
├── type (CONTRIBUTION/SANCTION/LOAN_REPAYMENT/EXTRAORDINARY/...)
├── amount
├── payment_method (MTN_MOMO/ORANGE_MONEY/CASH/BANK_TRANSFER)
├── transaction_reference
├── status (PENDING/COMPLETED/FAILED/REFUNDED)
├── receipt_url
├── recorded_by (User)
├── created_at
└── updated_at
```

### Sanction

```
Sanction
├── id (UUID)
├── tontine_id (Tontine)
├── member_id (TontineMember)
├── session_id (Session)
├── type (LATE/ABSENT/DISTURBANCE/NON_PAYMENT/OTHER)
├── amount
├── reason
├── status (PENDING/PAID/WAIVED)
├── applied_by (User - Censeur)
├── paid_at
├── payment_id (Payment)
├── created_at
└── updated_at
```

### Prêt (Loan)

```
Loan
├── id (UUID)
├── tontine_id (Tontine)
├── borrower_id (TontineMember)
├── amount
├── interest_rate
├── total_due
├── duration_months
├── reason
├── status (PENDING/APPROVED/REJECTED/DISBURSED/REPAID)
├── approved_at
├── approved_by (User)
├── disbursed_at
├── disbursed_by (User)
├── repaid_at
├── created_at
└── updated_at
```

### Garant (LoanGuarantor)

```
LoanGuarantor
├── id (UUID)
├── loan_id (Loan)
├── guarantor_id (TontineMember)
├── status (PENDING/ACCEPTED/REJECTED)
├── responded_at
├── created_at
└── updated_at
```

### Cotisation Extraordinaire (ExtraordinaryContribution)

```
ExtraordinaryContribution
├── id (UUID)
├── tontine_id (Tontine)
├── event_type (DEATH_MEMBER/DEATH_RELATIVE/MARRIAGE/BIRTH/ILLNESS/OTHER)
├── event_description
├── beneficiary_id (TontineMember)
├── amount_per_member
├── deadline
├── total_collected
├── status (OPEN/CLOSED/DISTRIBUTED)
├── distributed_at
├── created_by (User)
├── created_at
└── updated_at
```

### Journal d'Audit (AuditLog)

```
AuditLog
├── id (UUID)
├── user_id (User)
├── tontine_id (Tontine) - optionnel
├── action (CREATE/UPDATE/DELETE/LOGIN/...)
├── entity_type (USER/TONTINE/PAYMENT/...)
├── entity_id
├── old_values (JSON)
├── new_values (JSON)
├── ip_address
├── user_agent
├── created_at
```

## 7.2 Diagramme Entité-Relation Simplifié

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│   User   │◄──────│TontineMember │──────►│ Tontine  │
└────┬─────┘       └──────┬───────┘       └────┬─────┘
     │                    │                    │
     │              ┌─────┴─────┐              │
     │              ▼           ▼              │
     │        ┌─────────┐ ┌─────────┐          │
     │        │Attendance│ │ Payment │          │
     │        └────┬────┘ └────┬────┘          │
     │             │           │               │
     │             ▼           │               │
     │        ┌─────────┐      │               │
     │        │ Session │◄─────┘               │
     │        └────┬────┘                      │
     │             │                           │
     │     ┌───────┴───────┐                   │
     │     ▼               ▼                   │
     │ ┌────────┐    ┌──────────┐              │
     │ │Sanction│    │   Loan   │◄─────────────┘
     │ └────────┘    └────┬─────┘
     │                    │
     │              ┌─────┴─────┐
     │              ▼           ▼
     │        ┌──────────┐ ┌──────────────┐
     └───────►│LoanGuaran│ │ Extraordinary │
              │   tor    │ │ Contribution │
              └──────────┘ └──────────────┘
```

---

# 8. PLANNING PRÉVISIONNEL

## 8.1 Phases du Projet

### Phase 1 : Fondations (Semaines 1-4)

| Semaine | Livrables |
|---------|-----------|
| S1 | Architecture technique, setup environnements |
| S2 | Modèle de données, API de base |
| S3 | Authentification, gestion utilisateurs |
| S4 | Tests unitaires, documentation API |

### Phase 2 : Modules Core (Semaines 5-10)

| Semaine | Livrables |
|---------|-----------|
| S5 | Module Tontine (création, configuration) |
| S6 | Module Membres (adhésion, rôles) |
| S7 | Module Bureau (postes, nominations) |
| S8 | Module Sessions (planification, présences) |
| S9 | Module Paiements (cotisations, enregistrement) |
| S10 | Tests d'intégration |

### Phase 3 : Modules Avancés (Semaines 11-16)

| Semaine | Livrables |
|---------|-----------|
| S11 | Module Sanctions |
| S12 | Module Prêts |
| S13 | Module Cotisations Extraordinaires |
| S14 | Module Distribution (rotation, enchères, tirage) |
| S15 | Module Rapports et Bilans |
| S16 | Tests d'intégration |

### Phase 4 : Mobile & Intégrations (Semaines 17-22)

| Semaine | Livrables |
|---------|-----------|
| S17-18 | Application mobile (écrans principaux) |
| S19 | Intégration Mobile Money (MTN, Orange) |
| S20 | Intégration Notifications (SMS, Push, Email) |
| S21 | Intégration WhatsApp |
| S22 | Tests end-to-end |

### Phase 5 : Finalisation (Semaines 23-26)

| Semaine | Livrables |
|---------|-----------|
| S23 | Tests utilisateurs (beta) |
| S24 | Corrections et optimisations |
| S25 | Documentation utilisateur |
| S26 | Déploiement production |

## 8.2 Résumé du Planning

| Phase | Durée | Période |
|-------|-------|---------|
| Phase 1 : Fondations | 4 semaines | Mois 1 |
| Phase 2 : Modules Core | 6 semaines | Mois 2-3 |
| Phase 3 : Modules Avancés | 6 semaines | Mois 3-4 |
| Phase 4 : Mobile & Intégrations | 6 semaines | Mois 5-6 |
| Phase 5 : Finalisation | 4 semaines | Mois 6-7 |
| **TOTAL** | **26 semaines** | **~6.5 mois** |

## 8.3 Ressources Recommandées

| Rôle | Nombre | Responsabilités |
|------|--------|-----------------|
| Chef de projet | 1 | Coordination, suivi |
| Développeur Backend | 2 | API, base de données |
| Développeur Frontend | 1 | Application web |
| Développeur Mobile | 1-2 | Applications iOS/Android |
| Designer UI/UX | 1 | Maquettes, expérience utilisateur |
| Testeur QA | 1 | Tests, qualité |
| DevOps | 1 (partiel) | Infrastructure, déploiement |

---

# 9. ANNEXES

## 9.1 Glossaire

| Terme | Définition |
|-------|------------|
| **Tontine** | Association d'épargne collective où les membres cotisent régulièrement |
| **Cagnotte** | Somme totale collectée lors d'une séance |
| **Cycle** | Période complète où chaque membre a reçu la cagnotte une fois |
| **Session/Séance** | Réunion périodique de la tontine |
| **Cotisation** | Montant que chaque membre doit verser à chaque séance |
| **Distribution** | Attribution de la cagnotte à un membre |
| **PV** | Procès-verbal de réunion |
| **2FA** | Authentification à deux facteurs |
| **OTP** | One-Time Password (code à usage unique) |
| **XAF** | Franc CFA (monnaie utilisée au Cameroun) |

## 9.2 Régions du Cameroun

1. Adamaoua
2. Centre
3. Est
4. Extrême-Nord
5. Littoral
6. Nord
7. Nord-Ouest
8. Ouest
9. Sud
10. Sud-Ouest

## 9.3 Contacts et Références

| Élément | Information |
|---------|-------------|
| Date de création | Mars 2026 |
| Version du document | 1.0 |
| Auteur | [À compléter] |
| Client | [À compléter] |

---

# FIN DU