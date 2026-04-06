# Deploy de AgroGuía Tropical en AWS S3 + CloudFront

## Requisitos previos
- AWS CLI instalado y configurado (`aws configure`)
- Node.js 20+ y Angular CLI instalados
- Cuenta de AWS con permisos en S3 y CloudFront

---

## Paso 1 — Crear el bucket S3

```bash
# Reemplaza NOMBRE-BUCKET por un nombre único globalmente, ej: agroguia-tropical-2024
aws s3 mb s3://NOMBRE-BUCKET --region us-east-1
```

### Habilitar static website hosting

```bash
aws s3 website s3://NOMBRE-BUCKET \
  --index-document index.html \
  --error-document index.html
```

> El `error-document` también apunta a `index.html` para que el router de Angular maneje las rutas correctamente (SPA routing).

---

## Paso 2 — Configurar bucket policy para acceso público

Crea el archivo `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::NOMBRE-BUCKET/*"
    }
  ]
}
```

Aplica la policy:

```bash
aws s3api put-bucket-policy \
  --bucket NOMBRE-BUCKET \
  --policy file://bucket-policy.json
```

También deshabilita el bloqueo de acceso público:

```bash
aws s3api put-public-access-block \
  --bucket NOMBRE-BUCKET \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

---

## Paso 3 — Build de producción

```bash
cd agro-guia
npm run build -- --configuration production
```

Los archivos estáticos se generan en `dist/agro-guia/browser/`.

---

## Paso 4 — Subir archivos a S3

```bash
aws s3 sync dist/agro-guia/browser/ s3://NOMBRE-BUCKET --delete
```

El flag `--delete` elimina del bucket los archivos que ya no existen en el build.

---

## Paso 5 — Configurar CloudFront (CDN)

### Desde la consola AWS:

1. Ve a **CloudFront → Create distribution**
2. **Origin domain**: selecciona tu bucket S3 (usa el endpoint de website, no el de REST)
   - Formato: `NOMBRE-BUCKET.s3-website-us-east-1.amazonaws.com`
3. **Viewer protocol policy**: Redirect HTTP to HTTPS
4. **Default root object**: `index.html`
5. **Custom error responses** (para SPA routing):
   - HTTP error code: `403` → Response page: `/index.html` → HTTP 200
   - HTTP error code: `404` → Response page: `/index.html` → HTTP 200
6. Crea la distribución y espera ~15 minutos para propagación global.

### Tu URL de producción:

```
https://XXXXXXXXXX.cloudfront.net
```

---

## Paso 6 — Deploy automatizado con GitHub Actions

Ver `.github/workflows/deploy.yml` para el pipeline de CI/CD.

**Secrets necesarios en GitHub (Settings → Secrets and variables → Actions):**

| Secret              | Valor                         |
|---------------------|-------------------------------|
| `CLAUDE_API_KEY`    | Tu API key de Anthropic        |
| `AWS_ACCESS_KEY_ID` | Access key de tu usuario IAM  |
| `AWS_SECRET_ACCESS_KEY` | Secret key de tu usuario IAM |
| `S3_BUCKET`         | Nombre del bucket S3           |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID de tu distribución CF (opcional, para invalidar caché) |

---

## Comandos de uso frecuente

```bash
# Desarrollo local
cd agro-guia
ng serve

# Build de producción
npm run build -- --configuration production

# Deploy manual
aws s3 sync dist/agro-guia/browser/ s3://NOMBRE-BUCKET --delete

# Invalidar caché de CloudFront (tras un deploy)
aws cloudfront create-invalidation \
  --distribution-id EXXXXXXXXX \
  --paths "/*"
```

---

## Estructura de costos estimada (uso moderado)

| Servicio    | Costo estimado/mes |
|-------------|-------------------|
| S3 storage  | < $0.01           |
| S3 requests | < $0.10           |
| CloudFront  | < $1.00 (1M req)  |
| **Total**   | **< $2/mes**      |
