# Guide de Migration - Ressources Entrepreneurs

Ce guide explique comment appliquer les migrations en production lors du déploiement.

## Workflow de développement

1. **Développement local** : Utilisez Supabase local avec Docker
   ```bash
   supabase start  # Démarre Supabase local
   # Les migrations sont appliquées automatiquement
   ```

2. **Test local** : Testez vos changements avec Supabase local
   - API URL: http://127.0.0.1:54321
   - Studio URL: http://127.0.0.1:54323

3. **Déploiement en production** : Appliquez les migrations sur Supabase production

## Appliquer les migrations en production

### Option 1 : Via le Dashboard Supabase (Recommandé)

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Pour chaque nouvelle migration dans `supabase/migrations/` :
   - Ouvrez le fichier de migration
   - Copiez tout le contenu SQL
   - Collez dans le SQL Editor
   - Cliquez sur **Run**

### Option 2 : Via le CLI Supabase (si le projet est lié)

```bash
# Lier le projet (une seule fois)
supabase link --project-ref YOUR_PROJECT_REF

# Pousser les migrations vers la production
supabase db push
```

### Option 3 : Via le script npm

```bash
# Pour la migration 0006 (types de ressources)
npm run migrate:prod 0006_create_resource_types_relation.sql

# Ou pour initialiser uniquement les types (si les tables existent déjà)
npm run init:types
```

## Migrations disponibles

- `0001_init.sql` - Tables de base (resources, resources_meta, storage)
- `0002_drop_resources_meta.sql` - Supprime resources_meta
- `0003_remove_social_media_duplicates.sql` - Crée social_media et supprime doublons
- `0004_create_resources_storage_bucket.sql` - Configuration du bucket storage
- `0005_add_resource_types_array.sql` - Ajoute le champ types JSONB (déprécié)
- `0006_create_resource_types_relation.sql` - **Nouvelle structure avec relations** ⭐

## Migration 0006 - Types de ressources (Relation)

Cette migration crée :
- Table `resource_types` : Liste de tous les types disponibles
- Table `resource_resource_types` : Table de jonction many-to-many
- Migre automatiquement les données existantes
- Configure les politiques RLS

**Important** : Cette migration remplace l'ancien système JSONB par des relations normalisées.

## Vérification après migration

Après avoir appliqué une migration en production, vérifiez :

1. **Tables créées** :
   ```sql
   SELECT * FROM resource_types;
   SELECT * FROM resource_resource_types LIMIT 10;
   ```

2. **Types insérés** :
   ```bash
   npm run init:types
   ```
   Devrait afficher "12 type(s) déjà présent(s)"

3. **Test dans l'application** :
   - Essayez d'ajouter un type à une ressource
   - Essayez de supprimer un type
   - Vérifiez que les types s'affichent correctement

## Commandes utiles

```bash
# Démarrer Supabase local
supabase start

# Arrêter Supabase local
supabase stop

# Voir le statut
supabase status

# Réinitialiser la base locale (⚠️ supprime toutes les données)
supabase db reset

# Voir les migrations appliquées
supabase migration list
```

## Dépannage

### Erreur "relation does not exist"
- Vérifiez que les migrations précédentes ont été appliquées
- Appliquez les migrations dans l'ordre (0001, 0002, 0003, etc.)

### Erreur "duplicate key"
- Normal si la migration a déjà été appliquée partiellement
- Les migrations utilisent `on conflict do nothing` pour éviter les erreurs

### Types non trouvés dans l'application
- Vérifiez que la migration 0006 a été appliquée
- Exécutez `npm run init:types` pour insérer les types manquants

