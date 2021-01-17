# Migration `20201203134800-subscription-id`

This migration has been generated at 12/3/2020, 2:48:00 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Instance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "apiKey" TEXT NOT NULL,
    "playerLimit" INTEGER NOT NULL,
    "cost" REAL NOT NULL,
    "expires" DATETIME NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "machineId" TEXT,
    "ip" TEXT,
    "parentId" INTEGER,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("parentId") REFERENCES "Instance"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Instance" ("id", "createdAt", "updatedAt", "userId", "apiKey", "playerLimit", "cost", "expires", "machineId", "ip", "parentId") SELECT "id", "createdAt", "updatedAt", "userId", "apiKey", "playerLimit", "cost", "expires", "machineId", "ip", "parentId" FROM "Instance";
DROP TABLE "Instance";
ALTER TABLE "new_Instance" RENAME TO "Instance";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201027073602-add-card-brand..20201203134800-subscription-id
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -61,9 +61,9 @@
   apiKey         String
   playerLimit    Int
   cost           Float
   expires        DateTime
-  currentPayment String
+  subscriptionId String
   // for identifying hardware
   machineId   String?
   ip          String?
```

