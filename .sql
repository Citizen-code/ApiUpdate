CREATE TABLE "users"(
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ram" TEXT NULL,
    "processor" TEXT NULL,
    "manufacturer" TEXT NULL,
    "description" TEXT NULL,
    "video_card" TEXT NULL,
    "video_processor" TEXT NULL,
    "video_ram" TEXT NULL,
    "driver_version" TEXT NULL,
    "hard_drive" TEXT NULL,
    "size" TEXT NULL,
);

CREATE TABLE "version"(
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NULL,
    "version" TEXT NULL,
	"type" TEXT NOT NULL,
    "description" TEXT NULL,
    "url" TEXT NULL,
    "last" BOOLEAN NOT NULL DEFAULT false
);