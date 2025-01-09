
# Ticket Master

Ce projet implémente un système de tickets pour un bot Discord, permettant aux utilisateurs de créer et de gérer des tickets avec différentes actions comme la réclamation, la fermeture et l'invitation d'autres utilisateurs. Le bot prend également en charge la fermeture automatique des tickets après 24 heures d'inactivité et la transcription des conversations de tickets pour un archivage.

### (Je le continuerai Surement)

## Fonctionnalités

- **Créer un Ticket** : Les utilisateurs peuvent créer un ticket via la commande `/nouveauticket`, ce qui génère automatiquement un canal de ticket privé.
- **Actions sur le Ticket** :
    - **Réclamer** : Permet aux utilisateurs de réclamer un ticket.
    - **Fermer** : Ferme le ticket après avoir fourni un motif de fermeture.
    - **Inviter** : Ajoute temporairement un autre utilisateur au canal de ticket.
- **Fermeture Automatique des Tickets** : Les tickets inactifs sont automatiquement fermés après 24 heures.
- **Transcription** : Tous les messages dans les tickets fermés sont enregistrés dans un fichier pour référence future.

## Installation

### Prérequis
- Node.js installé
- Un token de bot Discord
- Un fichier `.env` avec les variables suivantes :
    - `TOKEN`: Le token de votre bot
    - `CATEGORY_ID`: L'ID de la catégorie où les tickets seront créés
    - `LOG_CHANNEL_ID`: L'ID du canal où les logs et transcriptions seront envoyés

### Installer les Dépendances
Pour installer les dépendances requises, exécutez la commande suivante :

```bash
npm install discord.js dotenv
```

### Lancer le Bot
Pour démarrer le bot, exécutez la commande suivante :

```bash
node index.js
```

## Fichiers et Répertoires

- **transcripts** : Un répertoire où les transcriptions des tickets fermés seront enregistrées.
- **bot.js** : Le fichier principal du bot contenant la logique pour la création de tickets, les actions et la transcription.

## Sur le bot
- Mettre logo.png sur le bot 
- Mettre le nom TicketMaster
- Description "Créé par la AxelCorp

## Commandes

- **/nouveauticket** : Crée un nouveau ticket pour l'utilisateur.


## Facultatif
- **Vous pouvez supprimer README.md**

## Licence
Ce projet est sous licence MIT.
