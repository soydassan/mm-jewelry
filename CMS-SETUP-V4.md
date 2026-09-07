# M&M Jewelry CMS v4

## 1. Supabase
En el proyecto `mm-jewelry` abrí **SQL Editor → New query**, pegá todo `supabase_v4_setup.sql` y ejecutalo.

Este patch modifica el esquema actual y agrega:
- campos de stock y pricing en `products`;
- tabla administrable `brands`;
- tabla privada `internal_quotes`;
- recálculo de `products.display_price` al cambiar cotizaciones;
- bucket `product-images` para fotos.

Importante: las cotizaciones no tienen policy de lectura para `anon`, por lo que no se publican.

## 2. GitHub Pages
Reemplazá los archivos del repositorio por los de este ZIP, manteniendo `assets/` en la raíz.

## 3. Panel
Abrí `https://soydassan.github.io/mm-jewelry/admin.html` y entrá con el usuario de Supabase.

## 4. Producto
- USD: completás `Base en USD`.
- ORO: completás `Gramos de oro` + `Hechura/adicional`.
- PLATA: completás `Gramos de plata` + `Hechura/adicional`.

Las cotizaciones internas las cargás desde **Cotizaciones**. La web pública sólo recibe `display_price`.
