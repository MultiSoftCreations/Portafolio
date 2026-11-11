# Firebase — MultiSoftCreations

## Admin
Correo admin: `ricardotorresgalvez005@gmail.com`  
En `javascript/firebase.js` → `ADMIN_EMAILS` (ya configurado).

## Reglas Firestore (Rules → Publish)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null
        && request.auth.token.email.lower() in [
          'ricardotorresgalvez005@gmail.com',
          'yocepliliamurguia@gmail.com'
        ];
    }

    match /solicitudes/{id} {
      allow create: if request.resource.data.nombre is string
        && request.resource.data.nombre.size() > 0
        && request.resource.data.nombre.size() <= 100
        && request.resource.data.mensaje is string
        && request.resource.data.mensaje.size() >= 10
        && request.resource.data.mensaje.size() <= 4000;
      allow read, update, delete: if isAdmin();
    }

    match /comentarios/{id} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.texto is string
        && request.resource.data.texto.size() >= 2
        && request.resource.data.texto.size() <= 1000;
      allow update: if request.auth != null
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likes'])
        && request.resource.data.likes == resource.data.likes + 1;
      allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }

    match /perfiles/{uid} {
      allow read: if true;
      allow create: if request.auth != null
        && request.auth.uid == uid
        && request.resource.data.rango == 'usuario';
      allow update: if isAdmin()
        || (request.auth != null
            && request.auth.uid == uid
            && request.resource.data.rango == resource.data.rango);
      allow delete: if isAdmin();
    }

    match /usernames/{name} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.uid == request.auth.uid
        && name.matches('^[a-z0-9_-]{3,20}$');
      allow update, delete: if false;
    }
  }
}
```

## Índice
`comentarios`: projectId ASC + createdAt DESC (enlace en consola del navegador si lo pide).

## Rangos (solo admin)
Creador · Co-creador/a · Colaborador (logo verificado) · Cliente frecuente · Cliente · Usuario

## Username único
Colección `usernames/{username}` → un correo = una cuenta Auth (Firebase lo impide duplicar).
