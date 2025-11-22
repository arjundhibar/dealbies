-- CreateTable
CREATE TABLE "schema_markup_settings" (
    "id" TEXT NOT NULL DEFAULT 'schema-markup-settings',
    "deals_schema" TEXT DEFAULT '{"@context":"https://schema.org","@type":"Offer"}',
    "coupons_schema" TEXT DEFAULT '{"@context":"https://schema.org","@type":"Coupon"}',
    "articles_schema" TEXT DEFAULT '{"@context":"https://schema.org","@type":"Article"}',
    "stores_schema" TEXT DEFAULT '{"@context":"https://schema.org","@type":"Organization"}',
    "faq_schema" TEXT DEFAULT '{"@context":"https://schema.org","@type":"FAQPage"}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schema_markup_settings_pkey" PRIMARY KEY ("id")
);
